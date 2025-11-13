import styles from './Speaker.module.css'
import type { FC } from 'react'

interface SpeakerProps {
  name: string
  affiliation: string
  img?: any
  modifier?: string
}

export const Speaker: FC<SpeakerProps> = ({
  name,
  affiliation,
  img,
  modifier,
}) => {
  return (
    <div className={`${styles.speaker}${modifier ? ` ${styles[modifier]}` : ''}`}>
      <div className={styles.avatar}>
        {img && <img src={`/assets/top/speakers/${img}`} alt="" className="util-img-cover" />}
      </div>
      <div className={styles.speakerDetail}>
        <p className={styles.name}>{name}</p>
        <p className={styles.affiliation}>{affiliation}</p>
      </div>
    </div>
  )
}


