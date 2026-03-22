import { createSessionCookie, parseCookie, verifySessionCookie } from './cookie'
import type { Env } from './types'

const COOKIE_NAME = 'knots_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30日（秒）
const UNAUTHORIZED_REDIRECT = '/'

export async function handleArchiveRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url)

  // Step 1: URLにトークンが含まれているか確認
  const token = url.searchParams.get('token')
  if (token) {
    return handleTokenAuth(url, token, env)
  }

  // Step 2: cookieによる認証
  return handleCookieAuth(request, url, env)
}

async function handleTokenAuth(
  url: URL,
  token: string,
  env: Env,
): Promise<Response> {
  const validTokens = env.KNOTS_AUTH_TOKENS.split(',').map((t) => t.trim())

  if (!validTokens.includes(token)) {
    return Response.redirect(
      new URL(UNAUTHORIZED_REDIRECT, url.origin).toString(),
      302,
    )
  }

  // トークンが有効 → URLからtokenを除去してリダイレクト + cookie発行
  const cleanUrl = new URL(url.pathname, url.origin)
  const sessionValue = await createSessionCookie(env.COOKIE_SECRET)

  return new Response(null, {
    status: 302,
    headers: {
      Location: cleanUrl.toString(),
      'Set-Cookie': `${COOKIE_NAME}=${sessionValue}; Path=/archive; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
    },
  })
}

async function handleCookieAuth(
  request: Request,
  url: URL,
  env: Env,
): Promise<Response> {
  const cookieHeader = request.headers.get('Cookie') || ''
  const cookies = parseCookie(cookieHeader)
  const sessionValue = cookies[COOKIE_NAME]

  if (!sessionValue) {
    return Response.redirect(
      new URL(UNAUTHORIZED_REDIRECT, url.origin).toString(),
      302,
    )
  }

  const isValid = await verifySessionCookie(sessionValue, env.COOKIE_SECRET)

  if (!isValid) {
    // 不正なcookie → 削除してリダイレクト
    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(UNAUTHORIZED_REDIRECT, url.origin).toString(),
        'Set-Cookie': `${COOKIE_NAME}=; Path=/archive; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      },
    })
  }

  // 認証成功 → 静的HTMLを返す
  return env.ASSETS.fetch(request)
}
