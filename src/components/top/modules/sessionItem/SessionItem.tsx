import type { FC, ReactNode } from 'react'
import styles from './SessionItem.module.css'

interface SessionItemProps {
  title: string | undefined
  description: string | undefined
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
        <p className={styles.description} dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }} />
      </div>
      <div className={styles.column}>
        <div className={styles.speakers}>{children}</div>
      </div>
    </div>
  )
}
