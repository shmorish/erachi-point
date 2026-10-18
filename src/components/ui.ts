// 複数のコンポーネントで使うクラスの組み合わせ。Tailwind が検出できるよう、クラス名は省略せずに書く

export const pageTitle = "min-w-0 text-xl font-bold tracking-[-0.025em] wrap-anywhere";
export const sectionTitle = "mt-xl mb-sm min-w-0 text-lg font-bold tracking-[-0.025em] wrap-anywhere";
export const label = "font-label text-xs tracking-[0.1em] uppercase";
export const empty = "py-sm text-ink-2";

// 1 人目は水色、2 人目はラベンダー。--who を使う側で背景や枠線の色を決める
export const whoColor = (index: number) =>
  index === 1 ? "[--who:var(--color-lavender)]" : "[--who:var(--color-accent-2)]";

// 記録や家事の一覧の 1 行
export const row = "flex items-baseline gap-2xs border-b-[1.5px] border-dashed border-rule py-xs";
export const rowText = "min-w-0 flex-1";
export const rowPoints = "font-bold whitespace-nowrap";

// 「取り消す」「削除」の控えめなボタン
export const ghostButton =
  "cursor-pointer rounded-pill border-[1.5px] border-rule px-xs py-3xs text-sm whitespace-nowrap text-ink-2 transition-colors duration-160 ease-out hover:border-ink hover:text-ink active:translate-y-px htmx-request:pointer-events-none htmx-request:opacity-50";

// 押し込める黄色いボタン
export const pushButton =
  "inline-flex cursor-pointer items-center justify-center rounded-pill bg-accent px-md py-2xs font-semibold whitespace-nowrap text-ink shadow-push transition-[translate,box-shadow] duration-140 ease-snap hover:-translate-y-0.5 hover:shadow-push-hover active:translate-y-[3px] active:shadow-push-active active:duration-70 htmx-request:pointer-events-none htmx-request:opacity-60 motion-reduce:hover:translate-none motion-reduce:active:translate-none";

// セグメント切り替え（記録ページの期間、シートの種類、編集ページの対象）
export const seg = "flex w-fit gap-3xs rounded-pill bg-paper-2 p-3xs";
export const segItem =
  "cursor-pointer rounded-pill px-sm py-3xs text-sm font-semibold whitespace-nowrap text-ink-2 transition-colors duration-160 ease-out hover:text-ink aria-[current=page]:bg-paper aria-[current=page]:text-ink aria-[current=page]:shadow-seg has-checked:bg-paper has-checked:text-ink has-checked:shadow-seg has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus";
export const segInput = "pointer-events-none absolute opacity-0";
