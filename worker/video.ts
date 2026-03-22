import { parseCookie, verifySessionCookie } from './cookie'
import { COOKIE_NAME } from './constants'
import type { Env } from './types'

export async function handleVideoRequest(
  request: Request,
  env: Env,
): Promise<Response> {
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

  const url = new URL(request.url)
  const key = url.pathname.replace(/^\/video\//, '')

  if (!key || !key.endsWith('.mp4')) {
    return new Response('Not Found', { status: 404 })
  }

  const rangeHeader = request.headers.get('Range')
  const rangeMatch = rangeHeader?.match(/bytes=(\d+)-(\d*)/)

  let r2Options: R2GetOptions = {}
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10)
    const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : undefined
    r2Options.range = end !== undefined
      ? { offset: start, length: end - start + 1 }
      : { offset: start }
  }

  const object = await env.VIDEOS.get(key, r2Options)

  if (!object) {
    return new Response('Not Found', { status: 404 })
  }

  const headers = new Headers()
  headers.set('Content-Type', 'video/mp4')
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=86400')

  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10)
    const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : object.size - 1
    const length = end - start + 1
    headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`)
    headers.set('Content-Length', length.toString())
    return new Response(object.body, { status: 206, headers })
  }

  headers.set('Content-Length', object.size.toString())
  return new Response(object.body, { status: 200, headers })
}
