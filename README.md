# KNOTS Official Site

```sh
npm create astro@latest -- --template basics
```

🧑‍🚀 経験者の方は、このファイルを削除して自由に進めてください。

## 🚀 プロジェクト構成

このリポジトリの構成は次のとおりです。

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

Astro のフォルダ構成については公式ドキュメントの「Project Structure」を参照してください: https://docs.astro.build/en/basics/project-structure/

## 🧞 コマンド

すべてのコマンドはプロジェクトルートで実行します。

| コマンド                  | 説明                                                   |
| :------------------------ | :----------------------------------------------------- |
| `npm install`             | 依存関係をインストール                                 |
| `npm run dev`             | ローカル開発サーバーを起動（`localhost:4321`）         |
| `npm run build`           | 本番ビルドを `./dist/` に出力                          |
| `npm run preview`         | デプロイ前にローカルでビルド結果をプレビュー           |
| `npm run astro ...`       | `astro add` や `astro check` などの CLI コマンドを実行 |
| `npm run astro -- --help` | Astro CLI のヘルプを表示                               |

## 👀 もっと知る

公式ドキュメント: https://docs.astro.build
コミュニティ Discord: https://astro.build/chat

---

## PR プレビュー（Cloudflare Workers）

このリポジトリは、GitHub の Pull Request ごとに Cloudflare Workers へビルド成果物（`dist`）をデプロイし、PR 専用のプレビュー URL を発行します。PR が閉じられるとプレビュー用 Worker は自動削除されます。

ワークフロー定義: `.github/workflows/pr-preview.yml`

### 事前準備（1 回のみ）

1. Cloudflare API トークン（`CLOUDFLARE_API_TOKEN`）を作成

- Cloudflare ダッシュボード → My Profile → API Tokens → Create Token
- テンプレート例: 「Edit Cloudflare Workers」相当、または以下の権限を含むカスタムトークン
  - Permissions: Account → Read、Workers Scripts → Edit（必要に応じて Workers Scripts → Read も含める）
- Account Resources: 対象アカウント（必要に応じて All accounts）
- 作成後に表示されるトークン値をコピーして保管（後で GitHub Secrets に登録）

2. Cloudflare アカウント ID（`CLOUDFLARE_ACCOUNT_ID`）を確認

- Cloudflare ダッシュボード → 右上のアカウント切替付近、または「Workers & Pages」→ 右上の Account ID で確認
- もしくは `npx wrangler whoami` で `account_id` を確認（Wrangler でログインが必要）

3. GitHub Secrets を設定

- GitHub リポジトリ → Settings → Secrets and variables → Actions → New repository secret
- 次の 2 つを追加
  - `CLOUDFLARE_API_TOKEN`: 手順 1 の API トークン
  - `CLOUDFLARE_ACCOUNT_ID`: 手順 2 で確認したアカウント ID
- `GITHUB_TOKEN` は GitHub が自動注入します（通常は追加設定不要）。

### 使い方（PR 作成時）

- PR の作成・更新・再オープン時にワークフローが起動します。
- Node.js 20 / `npm ci` / `npm run build` で `dist` を生成。
- Wrangler（CLI）で `wrangler deploy --name knots-official-site-pr-<PR番号> --assets dist` を実行し、プレビュー用 Worker をデプロイします。
- ワークフローが PR に「Preview is ready: <URL>」というコメントを自動投稿します。

プレビュー URL の形式
- 例: `https://knots-official-site-pr-123.<あなたのサブドメイン>.workers.dev`
- サブドメインはアカウント固有です（Workers & Pages ダッシュボードで確認可能）。

### 注意事項

- 本番用の Worker 名は `wrangler.jsonc` の `name`（現在は `knots-official-site`）です。PR プレビューは `knots-official-site-pr-<PR番号>` という別サービスとして作成します。
- PR を Close すると、該当プレビュー Worker は自動削除されます。
  - セキュリティと安定性のため、削除は「PR がマージされたとき」に実行します（`pull_request_target: closed` で Secrets を使用して安全に実行）。

### トラブルシューティング

- 403（権限エラー）: API トークンに「Workers Scripts: Edit」と「Account: Read」が含まれているかを確認。
- workers.dev サブドメイン未登録: まだ登録していない場合は Cloudflare ダッシュボードから設定してください（または `wrangler subdomain`）。
- URL がコメントされない: `wrangler deploy` の出力から URL を抽出できなかった可能性があります。ジョブログの「Deploy preview to Cloudflare Workers」末尾を確認してください。
