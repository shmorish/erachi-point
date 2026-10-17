import type { FC } from "hono/jsx";
import { Icon, ICON_EDIT, ICON_LIST, ICON_PLUS } from "./Icon";

export type Tab = "records" | "editor";

export const TabBar: FC<{ active: Tab }> = ({ active }) => (
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
