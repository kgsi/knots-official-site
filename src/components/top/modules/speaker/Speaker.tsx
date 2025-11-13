import styles from './Speaker.module.css'
import type { FC } from 'react'

interface SpeakerProps {
  name: string
  affiliation: string
  img?: any
  modifier?: string
  sns?: string
}

export const Speaker: FC<SpeakerProps> = ({
  name,
  affiliation,
  img,
  modifier,
  sns
}) => {
  const WrapperTag = sns ? 'a' : 'div'
  const wrapperProps = sns ? { href: sns, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <div className={`${styles.speaker}${modifier ? ` ${styles[modifier]}` : ''}`}>
      <WrapperTag className={styles.avatar} {...wrapperProps}>
        {img && <img src={`/assets/top/speakers/${img}`} alt="" className="util-img-cover" />}
      </WrapperTag>
      <div className={styles.speakerDetail}>
        <p className={styles.name}>{name}</p>
        <p className={styles.affiliation}>{affiliation}</p>
      </div>
    </div>
  )
}


