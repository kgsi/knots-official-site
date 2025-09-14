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

## PR プレビュー（Cloudflare Pages）

このリポジトリは、GitHub の Pull Request ごとに Cloudflare Pages にプレビュー用 URL を自動で発行するよう設定されています。

ワークフロー定義: `.github/workflows/pr-preview.yml`

### 事前準備（1 回のみ）

1. Cloudflare API トークン（`CLOUDFLARE_API_TOKEN`）を作成

- Cloudflare ダッシュボード → My Profile → API Tokens → Create Token
- テンプレート「Pages - Edit」を使用、または下記の権限でカスタム作成
  - Permissions: Account → Read、Pages → Edit
  - Account Resources: 対象アカウント（必要に応じて All accounts でも可）
- 作成後に表示されるトークン値をコピーして保管（後で GitHub Secrets に登録）

2. Cloudflare アカウント ID（`CLOUDFLARE_ACCOUNT_ID`）を確認

- Cloudflare ダッシュボード → 右上のアカウント切替付近、または「Workers & Pages」→ 右上の Account ID で確認可能
- もしくはローカルで `npx wrangler whoami` を実行して `account_id` を確認（Wrangler のログインが必要）

3. GitHub Secrets を設定

- GitHub リポジトリ → Settings → Secrets and variables → Actions → New repository secret
- 次の 2 つを追加
  - `CLOUDFLARE_API_TOKEN`: 手順 1 で作成した API トークン
  - `CLOUDFLARE_ACCOUNT_ID`: 手順 2 で確認したアカウント ID
- `GITHUB_TOKEN` について
  - `GITHUB_TOKEN` は GitHub が各ワークフロー実行時に自動で注入するビルトイントークンです。通常は追加設定不要で、ワークフロー内では `${{ secrets.GITHUB_TOKEN }}` として利用できます。
  - もし独自の権限が必要な場合（例: 他リポジトリへの書き込みなど）、Personal Access Token（classic または fine-grained）を作成し、任意の名前で Secret 登録し、`.github/workflows/pr-preview.yml` の `gitHubToken` にその Secret を渡してください。

4. Cloudflare Pages プロジェクト名

- 既定では `knots-official-site-preview` を使用しています（ワークフロー内の `projectName`）。
- 既存の Pages プロジェクトを使いたい場合は、`.github/workflows/pr-preview.yml` の `projectName` を変更してください。
- 存在しない場合は自動作成されることがあります。作成されない場合は Cloudflare ダッシュボードで Pages の「Direct Upload」タイプのプロジェクトを先に作成してください。

### 使い方（PR 作成時）

- PR の作成・更新・再オープン時にワークフローが起動します。
- Node.js 20 / `npm ci` / `npm run build` を実行し、`dist` を作成します。
- `cloudflare/pages-action@v1` が `dist` を Cloudflare Pages にデプロイし、PR にプレビュー用のデプロイメントステータス（URL）を付与します。

### 注意事項

- このワークフローはプレビュー用のみ（PR 対象）で、本番デプロイの設定には影響しません。
- 本番用の自動デプロイが必要な場合は、別途ワークフローを追加するか、同じ Pages プロジェクトの Production ブランチへデプロイする設定を用意してください。

### トラブルシューティング

- 403（権限エラー）: API トークンの権限（Account: Read / Pages: Edit）、および対象アカウントの指定を確認してください。
- 404/プロジェクト未検出: `projectName` が正しいか確認し、必要に応じて Pages プロジェクトを事前作成してください。
- Node のバージョン差異: ワークフローは Node 20 を使用しています。プロジェクト要件に合わせて `actions/setup-node` の `node-version` を調整してください。
