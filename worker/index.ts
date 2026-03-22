import { handleArchiveRequest } from './auth'
import { handleVideoRequest } from './video'
import type { Env } from './types'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // 動画配信（R2から）
    if (url.pathname.startsWith('/video/')) {
      return handleVideoRequest(request, env)
    }

    // アーカイブページの認証
    if (url.pathname === '/archive' || url.pathname.startsWith('/archive/')) {
      return handleArchiveRequest(request, env)
    }

    // フォールバック
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
