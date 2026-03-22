# KNOTS 動画アーカイブサイト 実装計画

## Context

KNOTSカンファレンスのアーカイブ動画（25本）を、noteの有料記事購入者に限定公開するための動画視聴機能を、既存のknots-official-site（Astro v5静的サイト）に追加する。

**決定事項:**
- 認証: 静的生成 + Cloudflare Workers middleware（`run_worker_first`）
- 動画再生: Google Drive iframe埋め込み
- UI: 既存の下層ページパターン（HeaderLower + FooterLower + LowerWrapper）
- カテゴリ: Wave / Cross の2トラック構成（フィルタータブ付き）

**重要な発見:** 既存プロジェクトは Cloudflare Pages ではなく **Cloudflare Workers static assets モード**（`wrangler.jsonc` に `assets.directory` 設定）。そのため `functions/` ディレクトリではなく `worker/` ディレクトリ + `run_worker_first` で認証を実装する。

---

## アーキテクチャ概要

```
[note有料記事] → [knots.crossrel.jp/archive?token=xxx] → [Worker認証] → [静的HTML] → [Google Drive iframe]
  購入者が         トークン付きURLで                       cookie発行      Astro SSG     動画再生
  リンクを取得      アクセス                                               ページ表示
```

---

## 進捗状況

### Phase 1: MVP実装 ✅ 完了
- Worker認証（worker/ 4ファイル）
- 全コンポーネント（src/components/archive/ 6ファイル）
- ページ（archive/index.astro, archive/[id].astro）
- データ型定義 + ダミーデータ5件
- wrangler.jsonc更新、Layout.astro拡張、.gitignore更新
- Astroビルド成功確認済み

### Phase 2: 動作確認・コミット・仕上げ
- Worker認証のローカル動作確認
- レスポンシブ・UIの確認と調整
- エラーハンドリング

### Phase 3: コンテンツ投入（未着手）
- 25本分の動画メタデータ登録（videos.json）
- サムネイル画像作成・配置
- Google Driveへの全動画アップロード・共有設定
- driveFileId の更新

### Phase 4: 仕上げ・デプロイ（未着手）
- 本番環境変数設定（KNOTS_AUTH_TOKENS, COOKIE_SECRET）
- Cloudflareへのデプロイ
- noteの有料記事にアクセスURLを設置

---

## ディレクトリ構成

```
worker/                              # Cloudflare Worker（認証）
├── index.ts                         # エントリーポイント
├── auth.ts                          # トークン検証・cookie発行
├── cookie.ts                        # HMAC-SHA256署名cookie
└── types.ts                         # Env型定義

src/
├── data/
│   └── videos.json                  # 動画メタデータ（25本分）
├── types/
│   └── videoTypes.ts                # Video型定義
├── pages/
│   └── archive/
│       ├── index.astro              # 動画一覧ページ
│       └── [id].astro               # 個別視聴ページ（getStaticPaths）
└── components/
    └── archive/
        ├── VideoCard.astro          # 動画カード
        ├── VideoPlayer.astro        # Google Drive iframeプレイヤー
        ├── TrackFilter.astro        # Wave/Crossフィルタータブ
        ├── VideoGrid.astro          # グリッドラッパー
        ├── VideoMeta.astro          # 動画情報（個別ページ）
        └── VideoNav.astro           # 前後ナビゲーション

public/
└── images/
    └── archive/
        └── thumbnails/              # サムネイル画像

.dev.vars                            # ローカル開発用シークレット（.gitignore済み）
```

**変更した既存ファイル:**
- `wrangler.jsonc` — `main`, `assets.binding`, `run_worker_first` を追加
- `src/layouts/Layout.astro` — `description`, `ogImage` propsを追加
- `.gitignore` — `.dev.vars` を追加

---

## 認証設計

### 認証フロー
1. `?token=xxx` あり → トークン検証 → 有効ならcookie発行 + tokenをURLから除去してリダイレクト
2. `?token` なし → cookie検証 → 有効なら `env.ASSETS.fetch(request)` で静的HTML返却
3. 認証失敗 → `/` にリダイレクト

### Cookie設計
- 名前: `knots_session`
- 値: `authenticated.<timestamp>.<HMAC-SHA256署名>`（トークン値は含めない）
- 属性: `HttpOnly; Secure; SameSite=Lax; Path=/archive; Max-Age=2592000`（30日）
- Web Crypto APIでHMAC署名（外部ライブラリ不要）
- タイミング攻撃対策の固定時間比較を実装

### wrangler.jsonc
```jsonc
{
  "name": "knots-official-site",
  "compatibility_date": "2025-08-02",
  "main": "./worker/index.ts",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "404-page",
    "run_worker_first": ["/archive", "/archive/*"]
  }
}
```

### 環境変数
- `KNOTS_AUTH_TOKENS`: カンマ区切りの有効トークンリスト
- `COOKIE_SECRET`: HMAC署名用シークレット（32文字以上）

---

## データ設計

### Video型（src/types/videoTypes.ts）
```typescript
export type Track = 'wave' | 'cross'

export interface Video {
  id: string
  title: string
  speaker: string
  speakerAffiliation: string
  duration: string           // "25:30"形式
  description: string
  driveFileId: string
  thumbnail: string          // ファイル名 "talk-01.jpg"
  track: Track
}
```

---

## コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| VideoCard.astro | カード型リンク。サムネイル(16:9) + durationバッジ + タイトル + 登壇者名。`data-track`属性でフィルター対応 |
| VideoPlayer.astro | Google Drive iframe埋め込み。`aspect-ratio: 16/9`、border-radius: 8px |
| TrackFilter.astro | すべて/Wave/Cross の3ボタン。`role="tablist"`でARIA対応。vanilla JSでフィルタリング |
| VideoGrid.astro | CSS Grid: PC 3カラム / TB 2カラム / SP 1カラム |
| VideoMeta.astro | 動画タイトル(h1)、登壇者名・所属、再生時間、概要テキスト |
| VideoNav.astro | prev/nextリンク + 一覧に戻るボタン。getStaticPathsで事前計算 |

---

## CSS方針

既存パターンに完全準拠:
- `@layer components { }` 内に全スタイルを定義
- PostCSS関数: `rem()`, `vw()`, `pw()`
- カスタムメディア: `--sp`, `--tb`, `--pc`, `--hover`
- 既存CSS変数を再利用
- BEMライク命名

---

## 検証チェックリスト

- [ ] トークン認証: 有効トークンでcookie発行、無効トークンでリダイレクト
- [ ] cookie認証: cookie有効時にページ表示、cookie無効時にリダイレクト
- [ ] 既存ページ: /, /job-board 等が正常に表示される（影響なし）
- [ ] 一覧ページ: カードがグリッド表示
- [ ] フィルター: Wave/Cross/すべて の切り替え動作
- [ ] 個別ページ: iframe動画再生、前後ナビゲーション
- [ ] レスポンシブ: SP/TB/PC のレイアウト切り替え
- [ ] OGP: メタタグが正しく設定される

---

## 運用

### 公開後
- トークンが漏洩した場合: 新トークン発行 → note記事内のURL更新
- 動画追加: videos.json に追記 → Google Driveにアップ → デプロイ
- アクセス状況: Cloudflare Analytics で確認

### 将来的な拡張（今回のスコープ外）
- Cloudflare R2 に動画を移行
- 個別トークン発行（購入者ごとにユニークURL）
- 視聴ログ / アナリティクス
- Cloudflare Stream への移行
