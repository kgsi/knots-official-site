import { useState, useEffect, type FC } from 'react';
import { SessionItem } from '@/components/top/modules/sessionItem/SessionItem.tsx';
import { Speaker } from '@/components/top/modules/speaker/Speaker.tsx';
import sessionList from '@/data/sessionList.json';
import speakers from '@/data/speakers.json';

interface SessionData {
  pickup?: boolean
  column?: string
  type?: string
  id?: string
  tag?: string
  time?: string
  duration?: string
  title?: string
  speakers?: string[]
  description?: string
}

// ランダムに指定した数の要素を抽出する関数
const getRandomItems = (array: SessionData[], count: number): SessionData[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const PickupSessionList = () => {
  const [pickedSessions, setPickedSessions] = useState<SessionData[]>([])

  useEffect(() => {
    // URLクエリパラメータを確認
    const params = new URLSearchParams(window.location.search)
    const showAll = params.get('pickup') === 'all'
    const pickupList = sessionList.filter(session => session.pickup)
    
    // pickup=allの場合は全件、それ以外はランダムに3件ピックアップ
    if (showAll) {
      setPickedSessions(pickupList)
    } else {
      setPickedSessions(getRandomItems(pickupList, 3))
    }
  }, [])

  // レンダリング完了を通知
  useEffect(() => {
    if (pickedSessions.length > 0) {
      // レンダリングが完了したことを通知
      requestAnimationFrame(() => {
        const event = new CustomEvent('pickup-rendered');
        document.dispatchEvent(event);
      });
    }
  }, [pickedSessions])

  return (
    <ul className="list" style={{ borderTop: '1px solid var(--color_grey)'}}>
      {pickedSessions.map((content) => (
        <li key={content.id} className="item" style={{ borderBottom: '1px solid var(--color_grey)'}}>
          <SessionItem
            sessionTag={content.tag}
            title={content.title}
            description={content.description}
          >
            {content.speakers?.map((speakerId) => {
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
