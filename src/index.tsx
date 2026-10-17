import { Hono } from "hono";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { html } from "hono/html";
import type { Child, FC } from "hono/jsx";
import { script, style } from "./styles";

type Item = { id: number; name: string; points: number };
type User = { id: number; name: string; balance: number; week: number; month: number };
type Log = { id: number; user_name: string; chore_name: string; points: number; at: string };
type Data = Awaited<ReturnType<typeof load>>;
type Env = { Bindings: CloudflareBindings };
type View = "week" | "month" | "all";
type Kind = "chores" | "rewards";

const app = new Hono<Env>();

const VIEWS: Record<View, string> = { week: "今週", month: "今月", all: "残高" };
const viewOf = (url: string): View => {
  const v = new URL(url).searchParams.get("view");
  return v === "month" || v === "all" ? v : "week";
};

// 週の始まり（月曜 0 時）と月初を JST で求め、created_at と同じ UTC 文字列にする
function periodStarts() {
  const jst = new Date(Date.now() + 9 * 3600e3);
  const [y, m, d] = [jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate()];
  const fmt = (ms: number) => new Date(ms - 9 * 3600e3).toISOString().slice(0, 19).replace("T", " ");
  return [fmt(Date.UTC(y, m, d - ((jst.getUTCDay() + 6) % 7))), fmt(Date.UTC(y, m, 1))];
}

async function load(db: D1Database) {
  const [weekStart, monthStart] = periodStarts();
  const [users, chores, rewards, logs] = await db.batch([
    // 今週・今月は稼いだ分だけ、残高は交換分も引いた合計
    db
      .prepare(
        `SELECT u.id, u.name,
           COALESCE(SUM(l.points), 0) AS balance,
           COALESCE(SUM(CASE WHEN l.points > 0 AND l.created_at >= ? THEN l.points END), 0) AS week,
           COALESCE(SUM(CASE WHEN l.points > 0 AND l.created_at >= ? THEN l.points END), 0) AS month
         FROM users u LEFT JOIN logs l ON l.user_id = u.id GROUP BY u.id ORDER BY u.id`,
      )
      .bind(weekStart, monthStart),
    db.prepare("SELECT * FROM chores ORDER BY id"),
    db.prepare("SELECT * FROM rewards ORDER BY points"),
    db.prepare(
      "SELECT l.id, u.name AS user_name, l.chore_name, l.points, strftime('%m/%d %H:%M', l.created_at, '+9 hours') AS at FROM logs l JOIN users u ON u.id = l.user_id ORDER BY l.id DESC LIMIT 50",
    ),
  ]);
  return {
    users: users.results as User[],
    chores: chores.results as Item[],
    rewards: rewards.results as Item[],
    logs: logs.results as Log[],
  };
}

const Icon: FC<{ d: string }> = ({ d }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICON_LIST = "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01";
const ICON_PLUS = "M12 5v14M5 12h14";
const ICON_EDIT = "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4";
const ICON_CLOSE = "M6 6l12 12M18 6 6 18";

const Records: FC<Pick<Data, "users" | "logs"> & { view: View }> = ({ users, logs, view }) => {
  const pts = (u: User) => (view === "all" ? u.balance : u[view]);
  const top = Math.max(...users.map(pts));
  const leaders = users.filter((u) => pts(u) === top);
  const leader = top > 0 && leaders.length === 1 ? leaders[0] : null;
  const diff = leader ? top - Math.min(...users.map(pts)) : 0;
  return (
    <div id="records">
      <nav class="seg" aria-label="集計期間" hx-boost="true">
        {(Object.keys(VIEWS) as View[]).map((v) => (
          <a href={v === "week" ? "/" : `/?view=${v}`} aria-current={v === view ? "page" : undefined}>
            {VIEWS[v]}
          </a>
        ))}
      </nav>
      <section class="board" aria-label={`${VIEWS[view]}のポイント`}>
        {users.map((u) => (
          <div class={u === leader ? "score is-leader" : "score"}>
            <div class="name">{u.name}</div>
            {/* 期間ごとにキーを分け、切り替え時は 0 からカウントアップさせる */}
            <div class="count" data-count={`${view}-${u.id}`}>
              {pts(u)}
            </div>
            <div class="label">{view === "all" ? "残高 pt" : "獲得 pt"}</div>
          </div>
        ))}
      </section>
      <p class="status" aria-live="polite">
        {VIEWS[view]}は
        {leader ? (
          <>
            {leader.name}が <span class="hl">{diff}pt</span> リード中。
          </>
        ) : (
          "同点。"
        )}
      </p>

      <h2>さいきんの記録</h2>
      {logs.length === 0 ? (
        <p class="empty">まだ記録がありません。家事をしたら下の＋ボタンから記録してください。</p>
      ) : (
        <ul class="rows">
          {logs.map((l) => (
            <li>
              <span class="label">{l.at}</span>
              <span class="what">
                {l.user_name}・{l.chore_name}
              </span>
              <span class={l.points < 0 ? "pt is-spent" : "pt"}>{l.points < 0 ? l.points : `+${l.points}`}</span>
              <button class="ghost" hx-delete={`/logs/${l.id}`} hx-target="#records" hx-swap="outerHTML">
                取り消す
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const KIND_LABEL: Record<Kind, string> = { chores: "家事", rewards: "ごほうび" };

const Editor: FC<{ kind: Kind; items: Item[] }> = ({ kind, items }) => (
  <section id={`editor-${kind}`} class="editor" aria-label={KIND_LABEL[kind]}>
    {items.length === 0 ? (
      <p class="empty">{KIND_LABEL[kind]}がまだありません。下のフォームから追加してください。</p>
    ) : (
      <ul class="rows">
        {items.map((it) => (
          <li>
            <span class="what">{it.name}</span>
            <span class="pt">{it.points}pt</span>
            <button class="ghost" hx-delete={`/${kind}/${it.id}`} hx-confirm={`「${it.name}」を削除しますか？`} hx-target={`#editor-${kind}`} hx-swap="outerHTML">
              削除
            </button>
          </li>
        ))}
      </ul>
    )}
    <form class="add" hx-post={`/${kind}`} hx-target={`#editor-${kind}`} hx-swap="outerHTML">
      <input name="name" placeholder={`${KIND_LABEL[kind]}の名前`} required maxlength={50} aria-label={`${KIND_LABEL[kind]}の名前`} />
      <input name="points" type="number" inputmode="numeric" placeholder="pt" required min={1} max={1000} aria-label="ポイント" />
      <button class="btn">追加する</button>
    </form>
  </section>
);

// ボトムシート。家事を押すと記録、ごほうびを押すと交換して、シートを閉じる
const Sheet: FC<Pick<Data, "users" | "chores" | "rewards"> & { who: number }> = ({ users, chores, rewards, who }) => (
  <dialog id="sheet" class="sheet" aria-labelledby="sheet-title">
    {/* 外側の dialog に余白を持たせず、背景タップを dialog 自身へのクリックとして判定する */}
    <div class="sheet-body">
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="sheet-head">
        <div class="seg" role="radiogroup" aria-label="種類">
          <label>
            <input type="radio" name="sheet-tab" value="chores" checked />
            家事をやった
          </label>
          <label>
            <input type="radio" name="sheet-tab" value="rewards" />
            ごほうび
          </label>
        </div>
        <h2 id="sheet-title" class="visually-hidden">
          記録する
        </h2>
        <button class="icon-btn" data-close-sheet aria-label="閉じる">
          <Icon d={ICON_CLOSE} />
        </button>
      </div>
      <fieldset class="who">
        <legend class="label">だれ？</legend>
        {users.map((u) => (
          <label>
            <input type="radio" name="user_id" value={u.id} checked={u.id === who} data-balance={u.balance} />
            {u.name}
            <span class="label">{u.balance}pt</span>
          </label>
        ))}
      </fieldset>
      <div class="panel panel-chores">
        {chores.length === 0 ? (
          <p class="empty">家事がまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class="chores">
            {chores.map((ch) => (
              <button class="chore" hx-post="/logs" hx-vals={JSON.stringify({ chore_id: ch.id })} hx-include="#sheet [name=user_id]" hx-swap="none">
                {ch.name}
                <span class="label">+{ch.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div class="panel panel-rewards">
        {rewards.length === 0 ? (
          <p class="empty">ごほうびがまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class="chores">
            {rewards.map((r) => (
              <button class="chore reward" data-cost={r.points} hx-post="/redeem" hx-vals={JSON.stringify({ reward_id: r.id })} hx-include="#sheet [name=user_id]" hx-swap="none">
                {r.name}
                <span class="label">-{r.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </dialog>
);

const TabBar: FC<{ active: "records" | "editor" }> = ({ active }) => (
  <nav class="tabbar" aria-label="メニュー" hx-boost="true">
    <a href="/" class="tab" aria-current={active === "records" ? "page" : undefined}>
      <Icon d={ICON_LIST} />
      記録
    </a>
    <button class="tab tab-main" data-open-sheet aria-haspopup="dialog">
      <span class="tab-main-dot">
        <Icon d={ICON_PLUS} />
      </span>
      やった
    </button>
    <a href="/edit" class="tab" aria-current={active === "editor" ? "page" : undefined}>
      <Icon d={ICON_EDIT} />
      編集
    </a>
  </nav>
);

function render(c: Context<Env>, data: Data, active: "records" | "editor", title: string, children: Child) {
  const who = Number(getCookie(c, "who")) || data.users[0]?.id;
  return c.html(html`<!doctype html>${(
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f7f5ec" />
        <title>{title}</title>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="えらちぽいんと" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Zen+Maru+Gothic:wght@500;700&family=JetBrains+Mono:wght@500&display=swap"
        />
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.4/dist/htmx.min.js"></script>
        {/* head のスクリプトは hx-boost で body を差し替えても再実行されない */}
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </head>
      <body>
        <main>{children}</main>
        <Sheet users={data.users} chores={data.chores} rewards={data.rewards} who={who} />
        <TabBar active={active} />
      </body>
    </html>
  )}`);
}

app.get("/", async (c) => {
  const data = await load(c.env.DB);
  return render(
    c,
    data,
    "records",
    "えらちぽいんと",
    <>
      <h1 class="page-title">えらちぽいんと</h1>
      <Records users={data.users} logs={data.logs} view={viewOf(c.req.url)} />
    </>,
  );
});

app.get("/edit", async (c) => {
  const data = await load(c.env.DB);
  return render(
    c,
    data,
    "editor",
    "編集 | えらちぽいんと",
    <>
      <h1 class="page-title">編集</h1>
      {/* 切り替えは CSS だけで行う。ラジオは差し替え対象の外にあるので、追加・削除しても選択が残る */}
      <div class="seg edit-seg" role="radiogroup" aria-label="編集する対象">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <label>
            <input type="radio" name="edit-tab" value={k} checked={k === "chores"} />
            {KIND_LABEL[k]}
          </label>
        ))}
      </div>
      <Editor kind="chores" items={data.chores} />
      <Editor kind="rewards" items={data.rewards} />
    </>,
  );
});

// 記録ページにいるなら #records だけ差し替える（シートが閉じるアニメーションを残すため）。それ以外なら記録ページへ移動
async function afterLog(c: Context<Env>, userId: string) {
  // 端末ごとに「だれ」を覚えておく
  setCookie(c, "who", userId, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "Lax", httpOnly: true });
  const current = c.req.header("HX-Current-URL") ?? c.req.url;
  if (new URL(current).pathname !== "/") {
    c.header("HX-Location", "/");
    return c.body(null);
  }
  c.header("HX-Retarget", "#records");
  c.header("HX-Reswap", "outerHTML");
  const { users, logs } = await load(c.env.DB);
  return c.html(<Records users={users} logs={logs} view={viewOf(current)} />);
}

app.post("/logs", async (c) => {
  const { user_id, chore_id } = await c.req.parseBody();
  // JOIN で家事とユーザーの両方が存在するときだけ挿入される
  const { meta } = await c.env.DB.prepare(
    "INSERT INTO logs (user_id, chore_name, points) SELECT u.id, ch.name, ch.points FROM users u, chores ch WHERE u.id = ? AND ch.id = ?",
  )
    .bind(String(user_id), String(chore_id))
    .run();
  if (meta.changes === 0) return c.text("invalid user or chore", 400);
  return afterLog(c, String(user_id));
});

app.post("/redeem", async (c) => {
  const { user_id, reward_id } = await c.req.parseBody();
  // 残高が足りるときだけ、マイナスのポイントとして挿入される
  const { meta } = await c.env.DB.prepare(
    `INSERT INTO logs (user_id, chore_name, points)
     SELECT u.id, r.name, -r.points FROM users u, rewards r
     WHERE u.id = ? AND r.id = ? AND (SELECT COALESCE(SUM(points), 0) FROM logs WHERE user_id = u.id) >= r.points`,
  )
    .bind(String(user_id), String(reward_id))
    .run();
  if (meta.changes === 0) return c.text("invalid user, reward, or not enough points", 400);
  return afterLog(c, String(user_id));
});

app.delete("/logs/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM logs WHERE id = ?").bind(c.req.param("id")).run();
  const { users, logs } = await load(c.env.DB);
  return c.html(<Records users={users} logs={logs} view={viewOf(c.req.header("HX-Current-URL") ?? c.req.url)} />);
});

// kind はルートの正規表現で chores / rewards に限定しているので、テーブル名に埋め込んでも安全
app.post("/:kind{chores|rewards}", async (c) => {
  const kind = c.req.param("kind") as Kind;
  const body = await c.req.parseBody();
  const name = String(body.name ?? "").trim();
  const points = Number(body.points);
  if (!name || name.length > 50 || !Number.isInteger(points) || points < 1 || points > 1000) {
    return c.text("invalid item", 400);
  }
  await c.env.DB.prepare(`INSERT INTO ${kind} (name, points) VALUES (?, ?)`).bind(name, points).run();
  return c.html(<Editor kind={kind} items={(await load(c.env.DB))[kind]} />);
});

app.delete("/:kind{chores|rewards}/:id", async (c) => {
  const kind = c.req.param("kind") as Kind;
  await c.env.DB.prepare(`DELETE FROM ${kind} WHERE id = ?`).bind(c.req.param("id")).run();
  return c.html(<Editor kind={kind} items={(await load(c.env.DB))[kind]} />);
});

export default app;
