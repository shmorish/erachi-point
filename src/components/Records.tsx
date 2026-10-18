import type { FC } from "hono/jsx";
import { type Data, type User, VIEWS, type View } from "../db";
import { empty, ghostButton, label, row, rowPoints, rowText, sectionTitle, seg, segItem, whoColor } from "./ui";

export const Records: FC<Pick<Data, "users" | "logs"> & { view: View }> = ({ users, logs, view }) => {
  const pts = (u: User) => (view === "all" ? u.balance : u[view]);
  const top = Math.max(...users.map(pts));
  const leaders = users.filter((u) => pts(u) === top);
  const leader = top > 0 && leaders.length === 1 ? leaders[0] : null;
  const diff = leader ? top - Math.min(...users.map(pts)) : 0;
  return (
    <div id="records">
      <nav class={`${seg} mt-sm`} aria-label="集計期間" hx-boost="true">
        {(Object.keys(VIEWS) as View[]).map((v) => (
          <a href={v === "week" ? "/" : `/?view=${v}`} class={segItem} aria-current={v === view ? "page" : undefined}>
            {VIEWS[v]}
          </a>
        ))}
      </nav>
      <section class="mt-md grid grid-cols-2 gap-xs" aria-label={`${VIEWS[view]}のポイント`}>
        {users.map((u, i) => (
          <div
            class={`${whoColor(i)} relative rounded-card bg-[color-mix(in_oklch,var(--who)_12%,var(--color-paper))] p-sm transition-[rotate,translate] duration-320 ease-spring ${
              u === leader
                ? "-translate-y-1 -rotate-2 shadow-leader motion-reduce:translate-none motion-reduce:rotate-0"
                : ""
            }`}
          >
            <div class="truncate font-semibold">{u.name}</div>
            {/* 期間ごとにキーを分け、切り替え時は 0 からカウントアップさせる */}
            <div class="text-count leading-none font-bold tracking-[-0.03em]" data-count={`${view}-${u.id}`}>
              {pts(u)}
            </div>
            <div class={`${label} text-ink-2`}>{view === "all" ? "残高 pt" : "獲得 pt"}</div>
          </div>
        ))}
      </section>
      <p class="mt-sm text-ink-2" aria-live="polite">
        {VIEWS[view]}は
        {leader ? (
          <>
            {leader.name}が{" "}
            <span class="bg-[linear-gradient(var(--color-accent-3-soft)_0_0)] bg-[length:100%_0.32em] bg-[position:0_85%] bg-no-repeat font-semibold text-ink box-decoration-clone">
              {diff}pt
            </span>{" "}
            リード中。
          </>
        ) : (
          "同点。"
        )}
      </p>

      <h2 class={sectionTitle}>さいきんの記録</h2>
      {logs.length === 0 ? (
        <p class={empty}>まだ記録がありません。家事をしたら下の＋ボタンから記録してください。</p>
      ) : (
        <ul>
          {logs.map((l) => (
            <li class={row}>
              <span class={`${label} text-ink-2`}>{l.at}</span>
              <span class={rowText}>
                {l.user_name}・{l.chore_name}
              </span>
              <span class={l.points < 0 ? `${rowPoints} text-accent-3` : rowPoints}>
                {l.points < 0 ? l.points : `+${l.points}`}
              </span>
              <button
                type="button"
                class={ghostButton}
                hx-delete={`/logs/${l.id}`}
                hx-target="#records"
                hx-swap="outerHTML"
              >
                取り消す
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
