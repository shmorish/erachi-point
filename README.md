# えらちぽいんと

2 人で使う家事ポイントアプリ。家事をするとポイントが貯まり、貯めたポイントはごほうびと交換できる。スマホでの利用を前提にしている。

## 技術構成

| 役割 | 使っているもの |
|---|---|
| 実行環境 | Cloudflare Workers |
| Web フレームワーク | Hono（JSX でサーバー側から HTML を返す） |
| 画面の部分更新 | htmx 2（CDN から読み込み） |
| DB | Cloudflare D1（SQLite） |
| 静的ファイル | Workers Static Assets（`public/`：PWA の manifest とアイコン） |
| ビルド・デプロイ | wrangler |
| 言語 | TypeScript |
| パッケージ管理 | pnpm |

フロントエンドのビルドはない。CSS とブラウザ側の JS は文字列としてサーバーから HTML に埋め込んでいる。

## 仕組み

- サーバーは常に HTML を返す。JSON の API はない
- 家事の記録や取り消しなどの操作は、htmx が画面の一部（`#records`、`#editor-*`）だけを差し替える
- ページ間の移動は `hx-boost` で body だけを差し替えるので、ページ全体は読み込み直さない
- 「なにをやった？」のボトムシートは `<dialog>` と CSS（`@starting-style`）で動かしている
- 持ちポイントは保存せず、`logs` の合計から毎回計算する。ごほうびとの交換はマイナスのポイントとして `logs` に記録する
- 「だれがやった？」の選択は端末ごとに cookie で覚える

## ディレクトリ構成

```
src/
├── index.ts          ルートの組み立て
├── db.ts             型、期間の計算、DB 読み込み
├── styles.ts         CSS
├── client.ts         ブラウザ側の JS（カウントアップ、シートの開閉、残高チェック）
├── components/       画面の部品（Layout, Records, Editor, Sheet, TabBar, Icon）
└── pages/            ページごとのルートと API（records, edit）
migrations/           D1 のマイグレーション（SQL）
public/               PWA の manifest とアイコン
```

## DB

| テーブル | 中身 |
|---|---|
| `users` | 2 人のユーザー |
| `chores` | 家事とポイント |
| `rewards` | ごほうびと必要なポイント |
| `logs` | 誰がいつ何をしたか。家事はプラス、ごほうびはマイナスのポイント。家事やごほうびを消しても履歴が残るよう、名前とポイントをコピーして持つ |

## 開発

```sh
pnpm install && pnpm cf-typegen
pnpm wrangler d1 migrations apply erachi-point --local
pnpm dev                                    # http://localhost:8787
```

## デプロイ

```sh
pnpm run deploy
pnpm wrangler d1 migrations apply erachi-point --remote
```

D1 は初回デプロイ時に自動で作成される。マイグレーションを追加したときは `--remote` での適用を忘れないこと。
