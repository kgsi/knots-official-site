import { useState, useEffect, type FC } from 'react';
import { SessionItem } from '@/components/top/modules/sessionItem/SessionItem.tsx';
import { Speaker } from '@/components/top/modules/speaker/Speaker.tsx';
import sessionList from '@/data/sessionList.json';
import speakers from '@/data/speakers.json';

interface SessionData {
  id: string
  title: string
  description: string
  speakers: string[]
  time: string
  category?: string
}

// ランダムに指定した数の要素を抽出する関数
const getRandomItems = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const PickupSessionList = () => {
  const [pickedSessions, setPickedSessions] = useState<SessionData[]>([])

  useEffect(() => {
    // URLクエリパラメータを確認
    const params = new URLSearchParams(window.location.search)
    const showAll = params.get('pickup') === 'all'
    
    // pickup=allの場合は全件、それ以外はランダムに3件ピックアップ
    if (showAll) {
      setPickedSessions(sessionList)
    } else {
      setPickedSessions(getRandomItems(sessionList, 3))
    }
  }, [sessionList])

  return (
    <ul className="list" style={{ borderTop: '1px solid var(--color_grey)'}}>
      {pickedSessions.map((content) => (
        <li key={content.id} className="item" style={{ borderBottom: '1px solid var(--color_grey)'}}>
          <SessionItem title={content.title} description={content.description}>
            {content.speakers.map((speakerId) => {
              const speakerData = speakers.find((s) => s.id === speakerId)
              return speakerData ? (
                <Speaker
                  key={speakerId}
                  name={speakerData.name}
                  affiliation={speakerData.affiliation}
                  img={speakerData.image}
                  sns={speakerData.sns}
                />
              ) : null
            })}
          </SessionItem>
        </li>
      ))}
    </ul>
  )
}
