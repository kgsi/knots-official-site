import { buildSetCookieHeader, createSessionCookie, parseCookie, verifySessionCookie } from './cookie'
import { COOKIE_MAX_AGE, COOKIE_NAME, UNAUTHORIZED_REDIRECT } from './constants'
import type { Env } from './types'

export async function handleArchiveRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url)

  const token = url.searchParams.get('token')
  if (token) {
    return handleTokenAuth(url, token, env)
  }

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

  const cleanUrl = new URL(url.pathname, url.origin)
  const sessionValue = await createSessionCookie(env.COOKIE_SECRET)

  return new Response(null, {
    status: 302,
    headers: {
      Location: cleanUrl.toString(),
      'Set-Cookie': buildSetCookieHeader(COOKIE_NAME, sessionValue, COOKIE_MAX_AGE),
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
    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(UNAUTHORIZED_REDIRECT, url.origin).toString(),
        'Set-Cookie': buildSetCookieHeader(COOKIE_NAME, '', 0),
      },
    })
  }

  return env.ASSETS.fetch(request)
}
