import type { FC } from "hono/jsx";
import { type Data, type User, VIEWS, type View } from "../db";

export const Records: FC<Pick<Data, "users" | "logs"> & { view: View }> = ({ users, logs, view }) => {
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
              <button type="button" class="ghost" hx-delete={`/logs/${l.id}`} hx-target="#records" hx-swap="outerHTML">
                取り消す
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
