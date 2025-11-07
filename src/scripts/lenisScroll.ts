// src/scripts/lenis.js
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export const initLenis = () => {

  const lenis = new Lenis({
    duration: 1.0,
    smoothWheel: true,
    wrapper: '#root'
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
