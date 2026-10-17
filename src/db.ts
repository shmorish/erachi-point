export type Env = { Bindings: CloudflareBindings };
export type Item = { id: number; name: string; points: number };
export type User = { id: number; name: string; balance: number; week: number; month: number };
export type Log = { id: number; user_name: string; chore_name: string; points: number; at: string };
export type Data = Awaited<ReturnType<typeof load>>;
export type View = "week" | "month" | "all";
export type Kind = "chores" | "rewards";

export const VIEWS: Record<View, string> = { week: "今週", month: "今月", all: "残高" };
export const viewOf = (url: string): View => {
  const v = new URL(url).searchParams.get("view");
  return v === "month" || v === "all" ? v : "week";
};

// 週の始まり（月曜 0 時）と月初を JST で求め、created_at と同じ UTC 文字列にする
function periodStarts() {
  const jst = new Date(Date.now() + 9 * 3600e3);
  const [y, m, d] = [jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate()];
  const fmt = (ms: number) => new Date(ms - 9 * 3600e3).toISOString().slice(0, 19).replace("T", " ");
  return [fmt(Date.UTC(y, m, d - ((jst.getUTCDay() + 6) % 7))), fmt(Date.UTC(y, m, 1))];
}

export async function load(db: D1Database) {
  const [weekStart, monthStart] = periodStarts();
  const [users, chores, rewards, logs] = await db.batch([
    // 今週・今月は稼いだ分だけ、残高は交換分も引いた合計
    db
      .prepare(
        `SELECT u.id, u.name,
           COALESCE(SUM(l.points), 0) AS balance,
           COALESCE(SUM(CASE WHEN l.points > 0 AND l.created_at >= ? THEN l.points END), 0) AS week,
           COALESCE(SUM(CASE WHEN l.points > 0 AND l.created_at >= ? THEN l.points END), 0) AS month
         FROM users u LEFT JOIN logs l ON l.user_id = u.id GROUP BY u.id ORDER BY u.id`,
      )
      .bind(weekStart, monthStart),
    db.prepare("SELECT * FROM chores ORDER BY id"),
    db.prepare("SELECT * FROM rewards ORDER BY points"),
    db.prepare(
      "SELECT l.id, u.name AS user_name, l.chore_name, l.points, strftime('%m/%d %H:%M', l.created_at, '+9 hours') AS at FROM logs l JOIN users u ON u.id = l.user_id ORDER BY l.id DESC LIMIT 50",
    ),
  ]);
  return {
    users: users.results as User[],
    chores: chores.results as Item[],
    rewards: rewards.results as Item[],
    logs: logs.results as Log[],
  };
}
