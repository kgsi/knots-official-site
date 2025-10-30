// src/scripts/lenis.js
import Lenis from '@studio-freight/lenis';

export const initLenis = () => {
  const lenis = new Lenis({
    duration: 1.0,
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // ページ内リンク対応
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    });
  });
};
