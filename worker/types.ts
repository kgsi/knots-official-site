export interface Env {
  /** Cloudflare静的アセットバインディング */
  ASSETS: Fetcher
  /** R2動画ストレージ */
  VIDEOS: R2Bucket
  /** カンマ区切りの有効トークンリスト */
  KNOTS_AUTH_TOKENS: string
  /** HMAC署名用シークレット */
  COOKIE_SECRET: string
}
