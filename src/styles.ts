export const style = `
/* Hallmark · genre: playful · macrostructure: Stat-Led · theme: Hum · tone: playful · anchor hue: pear 95 · enrichment: none · nav: bottom tab bar (3) + bottom sheet · footer: none · mobile-first */
:root {
  --color-paper: oklch(97% 0.012 95);
  --color-paper-2: oklch(94% 0.016 95);
  --color-ink: oklch(20% 0.012 250);
  --color-ink-2: oklch(20% 0.012 250 / 0.68);
  --color-rule: oklch(20% 0.012 250 / 0.2);
  --color-accent: oklch(86% 0.18 95);
  --color-accent-deep: oklch(70% 0.15 80);
  --color-accent-cast: oklch(76% 0.2 95 / 0.45);
  --color-accent-2: oklch(66% 0.18 235);
  --color-accent-3: oklch(68% 0.24 18);
  --color-lavender: oklch(74% 0.16 305);
  --color-focus: oklch(52% 0.18 235);
  --color-shadow: oklch(20% 0.012 250 / 0.14);
  --color-scrim: oklch(20% 0.012 250 / 0.4);
  --color-scrim-0: oklch(20% 0.012 250 / 0);

  --font-body: "Plus Jakarta Sans", "Zen Maru Gothic", system-ui, sans-serif;
  --font-label: "JetBrains Mono", ui-monospace, monospace;

  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-md: 1rem; --text-lg: 1.25rem; --text-xl: 1.75rem;
  --text-count: clamp(2.5rem, 9vw + 0.5rem, 4.5rem);

  --space-3xs: 0.25rem; --space-2xs: 0.5rem; --space-xs: 0.75rem; --space-sm: 1rem;
  --space-md: 1.5rem; --space-lg: 2rem; --space-xl: 3rem;
  --page-gutter: clamp(16px, 4vw, 24px);
  --shell: 560px;

  --radius-card: 20px; --radius-input: 12px; --radius-pill: 999px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-snap: cubic-bezier(0.2, 0.7, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --dur-sheet: 420ms;
  --tabbar-h: 68px;
}

*, *::before, *::after { box-sizing: border-box; }
html, body { overflow-x: clip; }
body {
  margin: 0; background: var(--color-paper); color: var(--color-ink);
  font-family: var(--font-body); font-size: var(--text-md); line-height: 1.6;
  font-variant-numeric: tabular-nums;
}
main { max-width: var(--shell); margin-inline: auto; padding: calc(var(--space-md) + env(safe-area-inset-top)) var(--page-gutter) calc(var(--tabbar-h) + var(--space-xl) + env(safe-area-inset-bottom)); }
.page-title { font-size: var(--text-xl); font-weight: 700; }
h1, h2 { font-style: normal; letter-spacing: -0.025em; overflow-wrap: anywhere; min-width: 0; margin: 0; }
h2 { font-size: var(--text-lg); font-weight: 700; margin: var(--space-xl) 0 var(--space-sm); }
.label { font-family: var(--font-label); font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-ink-2); }
:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }


/* who picker */
.who { border: 0; padding: 0; margin: 0 0 var(--space-md); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-2xs); }
.who legend { padding: 0; margin-bottom: var(--space-2xs); }
.who label {
  --who: var(--color-accent-2);
  display: flex; align-items: center; justify-content: center; gap: var(--space-2xs);
  padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-rule); font-weight: 600; white-space: nowrap; cursor: pointer;
  transition: background-color 160ms var(--ease-out), border-color 160ms var(--ease-out);
}
.who label:nth-of-type(2) { --who: var(--color-lavender); }
.who label:hover { border-color: var(--who); }
.who label .label { color: inherit; opacity: 0.7; letter-spacing: 0; }
.who label:has(:checked) { background: color-mix(in oklch, var(--who) 22%, var(--color-paper)); border-color: var(--who); }
.who label:has(:focus-visible) { outline: 3px solid var(--color-focus); outline-offset: 3px; }
.who input { accent-color: var(--who); margin: 0; }

/* scoreboard */
.board { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-xs); margin-top: var(--space-md); }
.score {
  --who: var(--color-accent-2);
  position: relative; padding: var(--space-sm); border-radius: var(--radius-card);
  background: color-mix(in oklch, var(--who) 12%, var(--color-paper));
  transition: transform 320ms var(--ease-spring);
}
.score:nth-child(2) { --who: var(--color-lavender); }
.score .name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.score .count { font-size: var(--text-count); font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
.score.is-leader { transform: rotate(-2deg) translateY(-4px); box-shadow: 0 2px 0 0 var(--color-shadow), 0 16px 32px -18px var(--color-shadow); }
.status { margin: var(--space-sm) 0 0; color: var(--color-ink-2); }
.hl {
  color: var(--color-ink); font-weight: 600;
  background-image: linear-gradient(oklch(68% 0.24 18 / 0.35) 0 0);
  background-repeat: no-repeat; background-size: 100% 0.32em; background-position: 0 85%;
  -webkit-box-decoration-break: clone; box-decoration-break: clone;
}

/* chore tiles: borderless tinted blocks */
.chores { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr)); gap: var(--space-xs); }
.chore {
  display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-3xs);
  padding: var(--space-sm); border: 0; border-radius: var(--radius-card); cursor: pointer;
  font: inherit; font-weight: 600; color: var(--color-ink); text-align: left;
  background: color-mix(in oklch, var(--color-accent) 30%, var(--color-paper));
  transition: transform 220ms var(--ease-spring), background-color 220ms var(--ease-out), box-shadow 220ms var(--ease-out);
}
.chore:hover { transform: translateY(-4px); background: color-mix(in oklch, var(--color-accent) 55%, var(--color-paper)); box-shadow: 0 2px 0 0 var(--color-shadow), 0 14px 24px -14px var(--color-shadow); }
.chore:active { transform: translateY(2px); box-shadow: none; transition-duration: 70ms; }
.chore.htmx-request { opacity: 0.6; pointer-events: none; }
.chore .label { color: var(--color-ink); }
.reward { background: color-mix(in oklch, var(--color-accent-2) 18%, var(--color-paper)); }
.reward:hover { background: color-mix(in oklch, var(--color-accent-2) 32%, var(--color-paper)); }
.chore:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

/* segmented control: period switch on records, kind switch in the sheet */
.seg { display: flex; gap: var(--space-3xs); padding: var(--space-3xs); border-radius: var(--radius-pill); background: var(--color-paper-2); width: fit-content; }
.seg a, .seg label {
  padding: var(--space-3xs) var(--space-sm); border-radius: var(--radius-pill); font-size: var(--text-sm); font-weight: 600;
  white-space: nowrap; color: var(--color-ink-2); text-decoration: none; cursor: pointer;
  transition: background-color 160ms var(--ease-out), color 160ms var(--ease-out);
}
.seg a:hover, .seg label:hover { color: var(--color-ink); }
.seg a[aria-current=page], .seg label:has(:checked) { background: var(--color-paper); color: var(--color-ink); box-shadow: 0 1px 0 0 var(--color-shadow), 0 4px 10px -6px var(--color-shadow); }
.seg label:has(:focus-visible) { outline: 3px solid var(--color-focus); outline-offset: 2px; }
.seg input { position: absolute; opacity: 0; pointer-events: none; }
#records > .seg, .edit-seg { margin-top: var(--space-sm); }
.editor { margin-top: var(--space-md); }
main:has([name=edit-tab][value=chores]:checked) #editor-rewards,
main:has([name=edit-tab][value=rewards]:checked) #editor-chores { display: none; }
.sheet:has([name=sheet-tab][value=chores]:checked) .panel-rewards,
.sheet:has([name=sheet-tab][value=rewards]:checked) .panel-chores { display: none; }
.rows .pt.is-spent { color: var(--color-accent-3); }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* rows: dashed rules */
.rows { list-style: none; margin: 0; padding: 0; }
.rows li { display: flex; align-items: baseline; gap: var(--space-2xs); padding: var(--space-xs) 0; border-bottom: 1.5px dashed var(--color-rule); }
.rows .what { flex: 1; min-width: 0; }
.rows .pt { font-weight: 700; white-space: nowrap; }
.empty { color: var(--color-ink-2); padding: var(--space-sm) 0; }
.ghost {
  font: inherit; font-size: var(--text-sm); color: var(--color-ink-2); white-space: nowrap;
  background: none; border: 1.5px solid var(--color-rule); border-radius: var(--radius-pill);
  padding: var(--space-3xs) var(--space-xs); cursor: pointer;
  transition: border-color 160ms var(--ease-out), color 160ms var(--ease-out);
}
.ghost:hover { color: var(--color-ink); border-color: var(--color-ink); }
.ghost:active { transform: translateY(1px); }
.ghost.htmx-request { opacity: 0.5; pointer-events: none; }

/* editor */
.add { display: flex; flex-wrap: wrap; gap: var(--space-2xs); margin-top: var(--space-md); }
.add input {
  font: inherit; font-size: max(16px, 1em); padding: var(--space-2xs) var(--space-xs); border-radius: var(--radius-input);
  border: 1.5px solid var(--color-rule); background: var(--color-paper); color: var(--color-ink); min-width: 0;
}
.add input:hover { border-color: var(--color-ink-2); }
.add input[name=name] { flex: 1 1 10rem; }
.add input[name=points] { flex: 0 0 5.5rem; }

/* the one push button */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: var(--space-2xs) var(--space-md); font: inherit; font-weight: 600; white-space: nowrap;
  border: 0; border-radius: var(--radius-pill); color: var(--color-ink); background: var(--color-accent); cursor: pointer;
  box-shadow: 0 4px 0 0 var(--color-accent-deep), 0 6px 12px -3px var(--color-accent-cast);
  transition: transform 140ms var(--ease-snap), box-shadow 140ms var(--ease-snap);
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 0 var(--color-accent-deep), 0 12px 22px -4px var(--color-accent-cast); }
.btn:active { transform: translateY(3px); box-shadow: 0 1px 0 0 var(--color-accent-deep), 0 2px 6px -2px var(--color-accent-cast); transition-duration: 70ms; }
.btn.htmx-request { opacity: 0.6; pointer-events: none; }

.star-burst {
  position: fixed; width: 24px; height: 24px; pointer-events: none;
  background:
    linear-gradient(90deg, transparent 47%, var(--color-accent-3) 47% 53%, transparent 53%),
    linear-gradient(0deg, transparent 47%, var(--color-accent-3) 47% 53%, transparent 53%);
  animation: star-burst 420ms var(--ease-out) forwards;
}
@keyframes star-burst {
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  60% { transform: scale(1.2) rotate(35deg); opacity: 0.9; }
  100% { transform: scale(1.4) rotate(45deg); opacity: 0; }
}

/* bottom tab bar */
.tabbar {
  position: fixed; inset: auto 0 0; z-index: 10;
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: end;
  max-width: var(--shell); margin-inline: auto;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom)); padding: 0 var(--page-gutter) env(safe-area-inset-bottom);
  background: var(--color-paper); border-top: 1.5px dashed var(--color-rule);
}
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  height: var(--tabbar-h); font: inherit; font-size: var(--text-xs); font-weight: 600; white-space: nowrap;
  color: var(--color-ink-2); text-decoration: none; background: none; border: 0; cursor: pointer;
  -webkit-tap-highlight-color: transparent; transition: color 160ms var(--ease-out);
}
.tab:hover, .tab[aria-current=page] { color: var(--color-ink); }
.tab[aria-current=page] svg { color: var(--color-accent-2); }
.tab:active svg { transform: scale(0.92); }
.tab-main { color: var(--color-ink); }
.tab-main-dot {
  display: grid; place-items: center; width: 56px; height: 56px; margin-top: -22px;
  border-radius: var(--radius-pill); background: var(--color-accent);
  box-shadow: 0 4px 0 0 var(--color-accent-deep), 0 8px 16px -4px var(--color-accent-cast);
  transition: transform 140ms var(--ease-snap), box-shadow 140ms var(--ease-snap);
}
.tab-main:hover .tab-main-dot { transform: translateY(-2px); box-shadow: 0 6px 0 0 var(--color-accent-deep), 0 12px 22px -4px var(--color-accent-cast); }
.tab-main:active .tab-main-dot { transform: translateY(3px); box-shadow: 0 1px 0 0 var(--color-accent-deep); transition-duration: 70ms; }
.tab-main:focus-visible { outline: none; }
.tab-main:focus-visible .tab-main-dot { outline: 3px solid var(--color-focus); outline-offset: 3px; }

/* bottom sheet: native dialog sliding up */
.sheet {
  position: fixed; inset: auto 0 0; margin: 0 auto; padding: 0; border: 0;
  width: 100%; max-width: var(--shell); max-height: 85dvh;
  border-radius: 28px 28px 0 0; background: var(--color-paper); color: var(--color-ink);
  box-shadow: 0 -12px 40px -16px var(--color-shadow);
  transform: translateY(100%);
  transition: transform var(--dur-sheet) var(--ease-sheet), overlay var(--dur-sheet) allow-discrete, display var(--dur-sheet) allow-discrete;
}
.sheet[open] { transform: translateY(0); }
@starting-style { .sheet[open] { transform: translateY(100%); } }
.sheet::backdrop {
  background: var(--color-scrim-0);
  transition: background-color var(--dur-sheet) var(--ease-sheet), overlay var(--dur-sheet) allow-discrete, display var(--dur-sheet) allow-discrete;
}
.sheet[open]::backdrop { background: var(--color-scrim); }
@starting-style { .sheet[open]::backdrop { background: var(--color-scrim-0); } }
.sheet-body { padding: var(--space-2xs) var(--page-gutter) calc(var(--space-lg) + env(safe-area-inset-bottom)); max-height: 85dvh; overflow-y: auto; overscroll-behavior: contain; }
.sheet-handle { width: 40px; height: 5px; margin: 0 auto var(--space-xs); border-radius: var(--radius-pill); background: var(--color-rule); }
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: var(--space-xs); margin-bottom: var(--space-md); }
.sheet-head h2 { margin: 0; }
.icon-btn {
  display: grid; place-items: center; width: 40px; height: 40px; border: 0; border-radius: var(--radius-pill);
  background: var(--color-paper-2); color: var(--color-ink); cursor: pointer; transition: background-color 160ms var(--ease-out);
}
.icon-btn:hover { background: color-mix(in oklch, var(--color-ink) 10%, var(--color-paper)); }
.icon-btn:active { transform: scale(0.94); }
html:has(.sheet[open]) { overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: 150ms !important; }
  .chore:hover, .chore:active, .btn:hover, .btn:active, .score.is-leader { transform: none; }
}
`;

// 合計ポイントのカウントアップ、加点時の星のエフェクト、ボトムシートの開閉、ごほうびの残高チェック
export const script = `
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const prev = {};
function burst(el) {
  const r = el.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "star-burst";
  s.style.left = r.left + r.width / 2 - 12 + "px";
  s.style.top = r.top + r.height / 2 - 12 + "px";
  s.addEventListener("animationend", () => s.remove());
  document.documentElement.append(s);
}
function tick() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const id = el.dataset.count, to = Number(el.textContent), from = prev[id] ?? 0;
    const gained = id in prev && to > from;
    prev[id] = to;
    if (reduce || from === to) return;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / 900, 1);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
      else if (gained) burst(el);
    };
    requestAnimationFrame(step);
  });
}
// 選んだ人の残高が足りないごほうびは押せないようにする（サーバー側でも検証している）
function gate() {
  const who = document.querySelector("#sheet [name=user_id]:checked");
  document.querySelectorAll("#sheet [data-cost]").forEach((b) => {
    b.disabled = !who || Number(b.dataset.cost) > Number(who.dataset.balance);
  });
}
document.addEventListener("change", (e) => e.target.name === "user_id" && gate());
document.addEventListener("DOMContentLoaded", tick);
document.addEventListener("htmx:afterSettle", tick);
document.addEventListener("click", (e) => {
  const sheet = document.getElementById("sheet");
  if (e.target.closest("[data-open-sheet]")) { gate(); sheet.showModal(); }
  else if (e.target.closest("[data-close-sheet], .chore") || e.target === sheet) sheet.close();
});
`;
