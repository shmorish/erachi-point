import { Hono } from "hono";
import { Editor, KIND_LABEL } from "../components/Editor";
import { renderPage } from "../components/Layout";
import { pageTitle, seg, segInput, segItem } from "../components/ui";
import { type Env, type Kind, load } from "../db";

export const edit = new Hono<Env>();

edit.get("/edit", async (c) => {
  const data = await load(c.env.DB);
  return renderPage(
    c,
    data,
    "editor",
    "編集 | えらちぽいんと",
    <>
      <h1 class={pageTitle}>編集</h1>
      {/* 切り替えは CSS だけで行う。ラジオは差し替え対象の外にあるので、追加・削除しても選択が残る */}
      <div class={`${seg} mt-sm`} role="radiogroup" aria-label="編集する対象">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <label class={segItem}>
            <input class={segInput} type="radio" name="edit-tab" value={k} checked={k === "chores"} />
            {KIND_LABEL[k]}
          </label>
        ))}
      </div>
      <Editor kind="chores" items={data.chores} />
      <Editor kind="rewards" items={data.rewards} />
    </>,
  );
});

// kind はルートの正規表現で chores / rewards に限定しているので、テーブル名に埋め込んでも安全
edit.post("/:kind{chores|rewards}", async (c) => {
  const kind = c.req.param("kind") as Kind;
  const body = await c.req.parseBody();
  const name = String(body.name ?? "").trim();
  const points = Number(body.points);
  if (!name || name.length > 50 || !Number.isInteger(points) || points < 1 || points > 1000) {
    return c.text("invalid item", 400);
  }
  await c.env.DB.prepare(`INSERT INTO ${kind} (name, points) VALUES (?, ?)`).bind(name, points).run();
  return c.html(<Editor kind={kind} items={(await load(c.env.DB))[kind]} />);
});

edit.delete("/:kind{chores|rewards}/:id", async (c) => {
  const kind = c.req.param("kind") as Kind;
  await c.env.DB.prepare(`DELETE FROM ${kind} WHERE id = ?`).bind(c.req.param("id")).run();
  return c.html(<Editor kind={kind} items={(await load(c.env.DB))[kind]} />);
});
