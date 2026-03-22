import { parseCookie, verifySessionCookie } from './cookie'
import type { Env } from './types'

const COOKIE_NAME = 'knots_session'

export async function handleVideoRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  // cookie認証チェック
  const cookieHeader = request.headers.get('Cookie') || ''
  const cookies = parseCookie(cookieHeader)
  const sessionValue = cookies[COOKIE_NAME]

  if (!sessionValue) {
    return new Response('Unauthorized', { status: 403 })
  }

  const isValid = await verifySessionCookie(sessionValue, env.COOKIE_SECRET)
  if (!isValid) {
    return new Response('Unauthorized', { status: 403 })
  }

  // /video/cross/talk-01.mp4 → cross/talk-01.mp4
  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/video\//, '')

  if (!key || !key.endsWith('.mp4')) {
    return new Response('Not Found', { status: 404 })
  }

  // Rangeリクエストの解析
  const rangeHeader = request.headers.get('Range')
  let r2Options: R2GetOptions = {}

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d+)-(\d*)/)
    if (match) {
      const start = parseInt(match[1], 10)
      const end = match[2] ? parseInt(match[2], 10) : undefined
      r2Options.range = end !== undefined
        ? { offset: start, length: end - start + 1 }
        : { offset: start }
    }
  }

  const object = await env.VIDEOS.get(key, r2Options)

  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers()
  headers.set('Content-Type', 'video/mp4')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=86400')

  // Rangeレスポンス
  if (rangeHeader && object.range) {
    const range = object.range as { offset: number; length: number }
    headers.set(
      'Content-Range',
      `bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`,
    )
    headers.set('Content-Length', range.length.toString())
    return new Response(object.body, { status: 206, headers })
  }

  // 通常レスポンス
  headers.set('Content-Length', object.size.toString())
  return new Response(object.body, { status: 200, headers })
}
