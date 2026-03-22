export type Track = 'wave' | 'cross'

export interface Video {
  id: string
  title: string
  speaker: string
  speakerAffiliation: string
  duration: string
  description: string
  driveFileId: string
  thumbnail: string
  track: Track
  published: boolean
}
