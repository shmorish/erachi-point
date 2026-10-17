import type { FC } from "hono/jsx";

export const Icon: FC<{ d: string }> = ({ d }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export const ICON_LIST = "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01";
export const ICON_PLUS = "M12 5v14M5 12h14";
export const ICON_EDIT = "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4";
export const ICON_CLOSE = "M6 6l12 12M18 6 6 18";
