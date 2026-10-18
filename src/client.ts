// 合計ポイントのカウントアップ、加点時の星のエフェクト、ボトムシートの開閉、ごほうびの残高チェック
export const clientScript = `
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const prev = {};
function burst(el) {
  const r = el.getBoundingClientRect();
  const s = document.createElement("span");
  s.className =
    "pointer-events-none fixed size-6 animate-star-burst bg-[linear-gradient(90deg,transparent_47%,var(--color-accent-3)_47%_53%,transparent_53%),linear-gradient(0deg,transparent_47%,var(--color-accent-3)_47%_53%,transparent_53%)]";
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
  else if (e.target.closest("[data-close-sheet], [data-sheet-action]") || e.target === sheet) sheet.close();
});
`;
