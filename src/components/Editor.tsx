import type { FC } from "hono/jsx";
import type { Item, Kind } from "../db";
import { empty, ghostButton, pushButton, row, rowPoints, rowText } from "./ui";

export const KIND_LABEL: Record<Kind, string> = { chores: "家事", rewards: "ごほうび" };

// 編集ページの切り替え（name="edit-tab"）で、選ばれていない方を隠す
const HIDDEN_UNLESS_SELECTED: Record<Kind, string> = {
  chores: "[main:has([name=edit-tab][value=rewards]:checked)_&]:hidden",
  rewards: "[main:has([name=edit-tab][value=chores]:checked)_&]:hidden",
};

const input =
  "min-w-0 rounded-input border-[1.5px] border-rule bg-paper px-xs py-2xs text-[max(16px,1em)] text-ink hover:border-ink-2";

export const Editor: FC<{ kind: Kind; items: Item[] }> = ({ kind, items }) => (
  <section id={`editor-${kind}`} class={`mt-md ${HIDDEN_UNLESS_SELECTED[kind]}`} aria-label={KIND_LABEL[kind]}>
    {items.length === 0 ? (
      <p class={empty}>{KIND_LABEL[kind]}がまだありません。下のフォームから追加してください。</p>
    ) : (
      <ul>
        {items.map((it) => (
          <li class={row}>
            <span class={rowText}>{it.name}</span>
            <span class={rowPoints}>{it.points}pt</span>
            <button
              type="button"
              class={ghostButton}
              hx-delete={`/${kind}/${it.id}`}
              hx-confirm={`「${it.name}」を削除しますか？`}
              hx-target={`#editor-${kind}`}
              hx-swap="outerHTML"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    )}
    <form class="mt-md flex flex-wrap gap-2xs" hx-post={`/${kind}`} hx-target={`#editor-${kind}`} hx-swap="outerHTML">
      <input
        class={`${input} flex-[1_1_10rem]`}
        name="name"
        placeholder={`${KIND_LABEL[kind]}の名前`}
        required
        maxlength={50}
        aria-label={`${KIND_LABEL[kind]}の名前`}
      />
      <input
        class={`${input} flex-[0_0_5.5rem]`}
        name="points"
        type="number"
        inputmode="numeric"
        placeholder="pt"
        required
        min={1}
        max={1000}
        aria-label="ポイント"
      />
      <button type="submit" class={pushButton}>
        追加する
      </button>
    </form>
  </section>
);
