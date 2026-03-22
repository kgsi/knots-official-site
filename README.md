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
| `npm run dev:full`        | ビルド → Wrangler Dev 起動（認証+R2動画再生が動作）   |
| `npm run build`           | 本番ビルドを `./dist/` に出力                          |
| `npm run preview`         | デプロイ前にローカルでビルド結果をプレビュー           |
| `npm run astro ...`       | `astro add` や `astro check` などの CLI コマンドを実行 |
| `npm run astro -- --help` | Astro CLI のヘルプを表示                               |

## 🎬 アーカイブ動画機能

KNOTS 2026 カンファレンスのセッション動画を、noteの有料記事購入者に限定公開する機能。

### アーキテクチャ

```
[note有料記事] → /archive?token=xxx → [Worker認証] → [静的HTML] → [R2動画配信]
  購入者が        トークン付きURL       cookie発行      Astro SSG     <video>タグ
```

| レイヤー | 技術 |
|---------|------|
| 認証 | Cloudflare Workers（トークン検証 → HMAC署名cookie） |
| ページ | Astro 静的生成（`src/pages/archive/`） |
| 動画配信 | Cloudflare R2（`worker/video.ts` 経由、Range対応） |
| データ | `src/data/videos.json`（静的JSON管理） |

### 認証フロー

1. noteの有料記事に `https://knots.crossrel.jp/archive?token=knots2026-archive-xK9mP4wQ` を記載
2. Worker がトークンを検証 → `knots_session` cookieを発行（30日有効）
3. 以降はcookieで認証（トークン不要）
4. 未認証アクセスは `/` にリダイレクト

### Cookie仕様

- `HttpOnly` / `SameSite=Lax` / `Path=/` / 30日有効
- 本番（https）: `Secure` フラグあり
- ローカル（http://localhost）: `Secure` フラグなし（自動判定）
- `HttpOnly` のため `document.cookie` からは参照不可（クライアントJSでの認証チェックは不可）

### ディレクトリ構成

```
worker/                    # Cloudflare Worker
├── index.ts               # ルーティング
├── auth.ts                # トークン・cookie認証
├── video.ts               # R2からの動画配信（Range対応）
├── cookie.ts              # HMAC-SHA256署名cookie
├── constants.ts           # 共通定数
└── types.ts               # Env型定義

src/
├── components/archive/    # アーカイブUI
│   ├── VideoPlayer.astro  # <video>プレイヤー
│   ├── VideoCard.astro    # カード
│   ├── VideoGrid.astro    # グリッド
│   ├── TrackFilter.astro  # Wave/Crossフィルター
│   ├── VideoMeta.astro    # 動画情報
│   ├── VideoNav.astro     # 前後ナビ
│   └── InformationPanel.astro # 注意書き
├── pages/archive/
│   ├── index.astro        # 一覧ページ
│   └── [id].astro         # 個別視聴ページ
├── data/videos.json       # 動画メタデータ（25本）
└── types/videoTypes.ts    # Video型定義
```

### 動画データ管理（videos.json）

```json
{
  "id": "talk-01",
  "title": "セッションタイトル",
  "speaker": "登壇者名",
  "speakerAffiliation": "所属",
  "duration": "20:00",
  "description": "概要テキスト",
  "driveFileId": "Google DriveファイルID（バックアップ用）",
  "videoPath": "cross/talk-01.mp4",
  "thumbnail": "talk-01.png",
  "track": "cross",
  "published": true
}
```

- `published: false` にすると一覧・個別ページから非表示になる
- サムネイル画像: `public/images/archive/thumbnails/`
- 動画ソース: `movie/compressed/`（.gitignore済み）

### 開発

```bash
# UI開発（認証なし、動画再生不可）
npm run dev

# フルスタック確認（認証+R2動画再生）
npm run dev:full
```

`dev:full` は `astro build && wrangler dev` を実行。ローカルR2シミュレーターで動画再生を確認できる。

> `npm run dev`（Astro dev server）はWorkerが動かないため、認証・動画再生は機能しない。
> アーカイブ機能の確認には必ず `npm run dev:full` を使用すること。
> ローカルテスト時はブラウザのcookieをクリアしてからトークン付きURLでアクセスする。

### 環境変数（Cloudflare Secrets）

| 変数名 | 用途 |
|--------|------|
| `KNOTS_AUTH_TOKENS` | カンマ区切りの有効トークンリスト |
| `COOKIE_SECRET` | HMAC署名用シークレット（32文字以上） |

ローカル開発用は `.dev.vars` に記載（.gitignore済み）。

### R2バケット

- バケット名: `knots-videos-2026`
- 動画パス: `cross/*.mp4`, `wave/*.mp4`
- 無料枠: ストレージ10GB / 読取100万回/月（現在1.1GB使用）

### 運用

| 操作 | 手順 |
|------|------|
| 動画追加 | `videos.json` に追記 → R2にアップロード → デプロイ |
| 動画非公開 | `videos.json` の `published` を `false` に → デプロイ |
| トークン漏洩 | 新トークンを `wrangler secret put` → note記事のURL更新 |
| トークン追加 | `KNOTS_AUTH_TOKENS` にカンマ区切りで追加 |

---

## 📈 Google アナリティクスの設定

Google Analytics 4 を利用する場合は `src/components/GoogleAnalytics.astro` の
`measurementId` に測定 ID を直接記述してください。

```astro
const measurementId = 'G-XXXXXXXXXX'
```

`G-XXXXXXXXXX` を実際の測定 ID に置き換えると、本番ビルド時に自動で GA
スニペットが挿入されます（開発サーバーでは送信しません）。

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
  - 削除は `pull_request_target` の `closed` イベントで実行し、マージ/未マージの両方を対象とします（Secrets を安全に利用）。

### トラブルシューティング

- 403（権限エラー）: API トークンに「Workers Scripts: Edit」と「Account: Read」が含まれているかを確認。
- workers.dev サブドメイン未登録: まだ登録していない場合は Cloudflare ダッシュボードから設定してください（または `wrangler subdomain`）。
- URL がコメントされない: `wrangler deploy` の出力から URL を抽出できなかった可能性があります。ジョブログの「Deploy preview to Cloudflare Workers」末尾を確認してください。
