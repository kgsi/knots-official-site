// src/scripts/lenis.js
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const initLenis = () => {

  const lenis = new Lenis({
    duration: 1.0,
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  
  // ページ内リンク対応
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 0;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id) return;
      const target = document.querySelector(id) as HTMLElement;
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -headerHeight });
      }
    });
  });

  // 他のページから/#idで遷移してきた場合の処理
  if (window.location.hash) {
    const targetId = window.location.hash;
    const scrollToTarget = () => {
      const targetElement = document.querySelector(targetId) as HTMLElement;
      if (targetElement) {
        lenis.scrollTo(targetElement, { offset: -headerHeight, immediate: false });
      }
    };

    // Reactコンポーネントのレンダリング完了を待つ
    let attempts = 0;
    const maxAttempts = 20;
    const checkAndScroll = () => {
      const targetElement = document.querySelector(targetId) as HTMLElement;
      if (targetElement) {
        // 要素が見つかったら、さらにレイアウトが安定するまで待つ
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToTarget();
          }, 150);
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAndScroll, 50);
      }
    };

    // 初回チェック
    setTimeout(checkAndScroll, 100);

    // pickup-renderedイベントをリッスン
    document.addEventListener('pickup-rendered', () => {
      setTimeout(scrollToTarget, 100);
      ScrollTrigger.update();
    }, { once: true });
  }

  // メニューの開閉イベントをリッスン
  document.addEventListener('menu:toggle', (event) => {
    const customEvent = event as CustomEvent;
    if (lenis) {
      if (customEvent.detail.isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  });
  // モーダルの開閉イベントをリッスン
  document.addEventListener('modal:toggle', (event) => {
    const customEvent = event as CustomEvent;
    if (lenis) {
      if (customEvent.detail.isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  });
};
