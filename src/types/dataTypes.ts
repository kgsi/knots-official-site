export interface Session {
  pickup?: boolean
  id: string
  tag: string
  title?: string
  speakers?: string[]
  description?: string
}

export interface TimetableContent {
  start: string
  duration: number
  type: 'spacer' | 'shrink' | 'text' | 'session'
  content?: string
}

