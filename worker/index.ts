import { handleArchiveRequest } from './auth'
import type { Env } from './types'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // /archive および /archive/* へのリクエストを認証処理
    // (run_worker_first のパターンマッチにより、このWorkerに到達するのは /archive* のみ)
    if (url.pathname === '/archive' || url.pathname.startsWith('/archive/')) {
      return handleArchiveRequest(request, env)
    }

    // フォールバック（通常到達しないが安全策）
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
