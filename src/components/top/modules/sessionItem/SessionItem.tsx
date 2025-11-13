import type { FC, ReactNode } from 'react'
import styles from './SessionItem.module.css'

interface SessionItemProps {
  title: string
  description: string
  children: ReactNode
}

export const SessionItem: FC<SessionItemProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className={styles.sessionItem}>
      <div className={styles.column}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.column}>
        <div className={styles.speakers}>{children}</div>
      </div>
    </div>
  )
}
