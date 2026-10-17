import type { FC } from "hono/jsx";
import type { Item, Kind } from "../db";

export const KIND_LABEL: Record<Kind, string> = { chores: "家事", rewards: "ごほうび" };

export const Editor: FC<{ kind: Kind; items: Item[] }> = ({ kind, items }) => (
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
