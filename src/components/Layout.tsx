import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { clientScript } from "../client";
import type { Data, Env } from "../db";
import { style } from "../styles";
import { Sheet } from "./Sheet";
import { type Tab, TabBar } from "./TabBar";

// 全ページ共通の外枠（head、ボトムシート、下タブ）を付けて HTML を返す
export function renderPage(c: Context<Env>, data: Data, active: Tab, title: string, children: Child) {
  const who = Number(getCookie(c, "who")) || data.users[0]?.id;
  return c.html(
    html`<!doctype html>${(
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#f7f5ec" />
          <title>{title}</title>
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="えらちぽいんと" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Zen+Maru+Gothic:wght@500;700&family=JetBrains+Mono:wght@500&display=swap"
          />
          <style dangerouslySetInnerHTML={{ __html: style }} />
          <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.4/dist/htmx.min.js"></script>
          {/* head のスクリプトは hx-boost で body を差し替えても再実行されない */}
          <script dangerouslySetInnerHTML={{ __html: clientScript }} />
        </head>
        <body>
          <main>{children}</main>
          <Sheet users={data.users} chores={data.chores} rewards={data.rewards} who={who} />
          <TabBar active={active} />
        </body>
      </html>
    )}`,
  );
}
