import type { Context } from "hono";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { renderPage } from "../components/Layout";
import { Records } from "../components/Records";
import { pageTitle } from "../components/ui";
import { type Env, load, viewOf } from "../db";

export const records = new Hono<Env>();

records.get("/", async (c) => {
  const data = await load(c.env.DB);
  return renderPage(
    c,
    data,
    "records",
    "えらちぽいんと",
    <>
      <h1 class={pageTitle}>えらちぽいんと</h1>
      <Records users={data.users} logs={data.logs} view={viewOf(c.req.url)} />
    </>,
  );
});

// 記録ページにいるなら #records だけ差し替える（シートが閉じるアニメーションを残すため）。それ以外なら記録ページへ移動
async function afterLog(c: Context<Env>, userId: string) {
  // 端末ごとに「だれ」を覚えておく
  setCookie(c, "who", userId, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "Lax", httpOnly: true });
  const current = c.req.header("HX-Current-URL") ?? c.req.url;
  if (new URL(current).pathname !== "/") {
    c.header("HX-Location", "/");
    return c.body(null);
  }
  c.header("HX-Retarget", "#records");
  c.header("HX-Reswap", "outerHTML");
  const { users, logs } = await load(c.env.DB);
  return c.html(<Records users={users} logs={logs} view={viewOf(current)} />);
}

records.post("/logs", async (c) => {
  const { user_id, chore_id } = await c.req.parseBody();
  // JOIN で家事とユーザーの両方が存在するときだけ挿入される
  const { meta } = await c.env.DB.prepare(
    "INSERT INTO logs (user_id, chore_name, points) SELECT u.id, ch.name, ch.points FROM users u, chores ch WHERE u.id = ? AND ch.id = ?",
  )
    .bind(String(user_id), String(chore_id))
    .run();
  if (meta.changes === 0) return c.text("invalid user or chore", 400);
  return afterLog(c, String(user_id));
});

records.post("/redeem", async (c) => {
  const { user_id, reward_id } = await c.req.parseBody();
  // 残高が足りるときだけ、マイナスのポイントとして挿入される
  const { meta } = await c.env.DB.prepare(
    `INSERT INTO logs (user_id, chore_name, points)
     SELECT u.id, r.name, -r.points FROM users u, rewards r
     WHERE u.id = ? AND r.id = ? AND (SELECT COALESCE(SUM(points), 0) FROM logs WHERE user_id = u.id) >= r.points`,
  )
    .bind(String(user_id), String(reward_id))
    .run();
  if (meta.changes === 0) return c.text("invalid user, reward, or not enough points", 400);
  return afterLog(c, String(user_id));
});

records.delete("/logs/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM logs WHERE id = ?").bind(c.req.param("id")).run();
  const { users, logs } = await load(c.env.DB);
  return c.html(<Records users={users} logs={logs} view={viewOf(c.req.header("HX-Current-URL") ?? c.req.url)} />);
});
