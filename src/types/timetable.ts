export type TextContent = {
  type: 'text'
  time: string
  title: string
}

export type CardContent = {
  type: 'card'
  key: string
}

export type SpacerContent = {
  type: 'spacer'
}

export type TimetableContent = TextContent | CardContent | SpacerContent

export interface TimetableEntry {
  timeline: string | null
  timeline_position?: string
  content_main: TimetableContent[]
  content_sub: TimetableContent[]
}
