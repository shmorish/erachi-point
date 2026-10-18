import type { FC } from "hono/jsx";
import { ICON_EDIT, ICON_LIST, ICON_PLUS, Icon } from "./Icon";

export type Tab = "records" | "editor";

const tab =
  "flex h-tabbar cursor-pointer flex-col items-center justify-center gap-0.5 text-xs font-semibold whitespace-nowrap transition-colors duration-160 ease-out [-webkit-tap-highlight-color:transparent] active:[&_svg]:scale-92";
const sideTab = `${tab} text-ink-2 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:[&_svg]:text-accent-2`;

export const TabBar: FC<{ active: Tab }> = ({ active }) => (
  <nav
    class="fixed inset-x-0 bottom-0 z-10 mx-auto grid h-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom))] max-w-shell grid-cols-3 items-end border-t-[1.5px] border-dashed border-rule bg-paper px-gutter pb-[env(safe-area-inset-bottom)]"
    aria-label="メニュー"
    hx-boost="true"
  >
    <a href="/" class={sideTab} aria-current={active === "records" ? "page" : undefined}>
      <Icon d={ICON_LIST} />
      記録
    </a>
    <button
      type="button"
      class={`${tab} group text-ink focus-visible:outline-none`}
      data-open-sheet
      aria-haspopup="dialog"
    >
      <span class="-mt-[22px] grid size-14 place-items-center rounded-pill bg-accent shadow-dot transition-[translate,box-shadow] duration-140 ease-snap group-hover:-translate-y-0.5 group-hover:shadow-push-hover group-active:translate-y-[3px] group-active:shadow-dot-active group-active:duration-70 group-focus-visible:outline-3 group-focus-visible:outline-offset-3 group-focus-visible:outline-focus">
        <Icon d={ICON_PLUS} />
      </span>
      やった
    </button>
    <a href="/edit" class={sideTab} aria-current={active === "editor" ? "page" : undefined}>
      <Icon d={ICON_EDIT} />
      編集
    </a>
  </nav>
);
