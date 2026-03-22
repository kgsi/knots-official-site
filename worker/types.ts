export interface Env {
  /** Cloudflare静的アセットバインディング */
  ASSETS: Fetcher
  /** カンマ区切りの有効トークンリスト */
  KNOTS_AUTH_TOKENS: string
  /** HMAC署名用シークレット */
  COOKIE_SECRET: string
}
