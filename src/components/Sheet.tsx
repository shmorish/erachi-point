import type { FC } from "hono/jsx";
import type { Data } from "../db";
import { ICON_CLOSE, Icon } from "./Icon";
import { empty, label, seg, segInput, segItem, whoColor } from "./ui";

// 下からスライドして出てくる <dialog>。閉じるときも下へ戻るよう display と overlay も遷移させる
const sheet =
  "fixed inset-x-0 top-auto bottom-0 mx-auto my-0 max-h-[85dvh] w-full max-w-shell translate-y-full rounded-t-[28px] bg-paper text-ink shadow-sheet transition-[translate,overlay,display] transition-discrete duration-420 ease-sheet open:translate-y-0 starting:open:translate-y-full backdrop:bg-scrim-0 backdrop:transition-[background-color,overlay,display] backdrop:transition-discrete backdrop:duration-420 backdrop:ease-sheet open:backdrop:bg-scrim starting:open:backdrop:bg-scrim-0";

const tile =
  "flex cursor-pointer flex-col items-start gap-3xs rounded-card p-sm text-left font-semibold text-ink transition duration-220 ease-spring hover:-translate-y-1 hover:shadow-lift active:translate-y-0.5 active:shadow-none active:duration-70 disabled:translate-none disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none htmx-request:pointer-events-none htmx-request:opacity-60 motion-reduce:hover:translate-none motion-reduce:active:translate-none";
const choreTile = `${tile} bg-[color-mix(in_oklch,var(--color-accent)_30%,var(--color-paper))] hover:bg-[color-mix(in_oklch,var(--color-accent)_55%,var(--color-paper))]`;
const rewardTile = `${tile} bg-[color-mix(in_oklch,var(--color-accent-2)_18%,var(--color-paper))] hover:bg-[color-mix(in_oklch,var(--color-accent-2)_32%,var(--color-paper))]`;
const tileGrid = "grid grid-cols-[repeat(auto-fill,minmax(min(140px,100%),1fr))] gap-xs";

// ボトムシート。家事を押すと記録、ごほうびを押すと交換して、シートを閉じる
export const Sheet: FC<Pick<Data, "users" | "chores" | "rewards"> & { who: number }> = ({
  users,
  chores,
  rewards,
  who,
}) => (
  <dialog id="sheet" class={sheet} aria-labelledby="sheet-title">
    {/* 外側の dialog に余白を持たせず、背景タップを dialog 自身へのクリックとして判定する */}
    <div class="max-h-[85dvh] overflow-y-auto overscroll-contain px-gutter pt-2xs pb-[calc(var(--spacing-lg)+env(safe-area-inset-bottom))]">
      <div class="mx-auto mb-xs h-[5px] w-10 rounded-pill bg-rule" aria-hidden="true"></div>
      <div class="mb-md flex items-center justify-between gap-xs">
        <div class={seg} role="radiogroup" aria-label="種類">
          <label class={segItem}>
            <input class={segInput} type="radio" name="sheet-tab" value="chores" checked />
            家事をやった
          </label>
          <label class={segItem}>
            <input class={segInput} type="radio" name="sheet-tab" value="rewards" />
            ごほうび
          </label>
        </div>
        <h2 id="sheet-title" class="sr-only">
          記録する
        </h2>
        <button
          type="button"
          class="grid size-10 cursor-pointer place-items-center rounded-pill bg-paper-2 text-ink transition-colors duration-160 ease-out hover:bg-[color-mix(in_oklch,var(--color-ink)_10%,var(--color-paper))] active:scale-94"
          data-close-sheet
          aria-label="閉じる"
        >
          <Icon d={ICON_CLOSE} />
        </button>
      </div>
      <fieldset class="mb-md grid grid-cols-2 gap-2xs">
        <legend class={`${label} mb-2xs text-ink-2`}>だれ？</legend>
        {users.map((u, i) => (
          <label
            class={`${whoColor(i)} flex cursor-pointer items-center justify-center gap-2xs rounded-pill border-[1.5px] border-rule px-sm py-xs font-semibold whitespace-nowrap transition-colors duration-160 ease-out hover:border-(--who) has-checked:border-(--who) has-checked:bg-[color-mix(in_oklch,var(--who)_22%,var(--color-paper))] has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-focus`}
          >
            <input
              class="accent-(--who)"
              type="radio"
              name="user_id"
              value={u.id}
              checked={u.id === who}
              data-balance={u.balance}
            />
            {u.name}
            <span class="font-label text-xs uppercase opacity-70">{u.balance}pt</span>
          </label>
        ))}
      </fieldset>
      <div class="[#sheet:has([name=sheet-tab][value=rewards]:checked)_&]:hidden">
        {chores.length === 0 ? (
          <p class={empty}>家事がまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class={tileGrid}>
            {chores.map((ch) => (
              <button
                type="button"
                class={choreTile}
                data-sheet-action
                hx-post="/logs"
                hx-vals={JSON.stringify({ chore_id: ch.id })}
                hx-include="#sheet [name=user_id]"
                hx-swap="none"
              >
                {ch.name}
                <span class={label}>+{ch.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div class="[#sheet:has([name=sheet-tab][value=chores]:checked)_&]:hidden">
        {rewards.length === 0 ? (
          <p class={empty}>ごほうびがまだありません。右下の「編集」から追加してください。</p>
        ) : (
          <div class={tileGrid}>
            {rewards.map((r) => (
              <button
                type="button"
                class={rewardTile}
                data-sheet-action
                data-cost={r.points}
                hx-post="/redeem"
                hx-vals={JSON.stringify({ reward_id: r.id })}
                hx-include="#sheet [name=user_id]"
                hx-swap="none"
              >
                {r.name}
                <span class={label}>-{r.points} pt</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </dialog>
);
