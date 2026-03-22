/**
 * cookie文字列をパースしてオブジェクトに変換
 */
export function parseCookie(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach((pair) => {
    const [key, ...rest] = pair.trim().split('=')
    if (key) {
      cookies[key.trim()] = rest.join('=').trim()
    }
  })
  return cookies
}

export function buildSetCookieHeader(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}

/**
 * HMAC-SHA256 で署名したセッションcookie値を生成
 * 形式: "authenticated.<timestamp>.<signature>"
 */
export async function createSessionCookie(secret: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const payload = `authenticated.${timestamp}`
  const signature = await hmacSign(payload, secret)
  return `${payload}.${signature}`
}

/**
 * セッションcookie値の署名を検証
 */
export async function verifySessionCookie(
  cookieValue: string,
  secret: string,
): Promise<boolean> {
  const parts = cookieValue.split('.')
  if (parts.length !== 3 || parts[0] !== 'authenticated') {
    return false
  }

  const payload = `${parts[0]}.${parts[1]}`
  const providedSignature = parts[2]
  const expectedSignature = await hmacSign(payload, secret)

  return timingSafeEqual(providedSignature, expectedSignature)
}

const keyCache = new Map<string, CryptoKey>()

async function getOrCreateKey(secret: string): Promise<CryptoKey> {
  const cached = keyCache.get(secret)
  if (cached) return cached
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  keyCache.set(secret, key)
  return key
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await getOrCreateKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  // URL-safe Base64
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
