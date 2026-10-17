import { Hono } from "hono";
import type { Env } from "./db";
import { edit } from "./pages/edit";
import { records } from "./pages/records";

const app = new Hono<Env>();

app.route("/", records);
app.route("/", edit);

export default app;
