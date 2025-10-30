import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function headerAnimation() {
  const headerActiveTrigger = document.querySelector('[data-trigger="header-active"]');
  const header = document.querySelector('[data-trigger="header"]');
  
  if (headerActiveTrigger || header) {
    ScrollTrigger.create({
      trigger: headerActiveTrigger,
      start: 'bottom top',
      end: () => ScrollTrigger.maxScroll(window) + 1,
      toggleClass: { targets: header, className: 'is-active' }
    });
  }
}
export function toggleMenu() {
  const menuBtn = document.querySelector('[data-trigger="menu-btn"]');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isCurrentlyOpen = menuBtn.classList.contains('is-menuOpen');
      
      if (isCurrentlyOpen) {
        // メニューを閉じる
        menuBtn.classList.remove('is-menuOpen');
        // ScrollSmootherを再開
        document.dispatchEvent(new CustomEvent('menu:toggle', {
          detail: { isOpen: false }
        }));
      } else {
        // メニューを開く
        menuBtn.classList.add('is-menuOpen');
        // ScrollSmootherを一時停止
        document.dispatchEvent(new CustomEvent('menu:toggle', {
          detail: { isOpen: true }
        }));
      }
    });
    // ヘッダー内の nav のリンクをクリックしたらメニューを閉じる
    const header = document.querySelector('[data-trigger="header"]');
    if (header) {
      const navLinks = header.querySelectorAll<HTMLAnchorElement>('a');
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (menuBtn.classList.contains('is-menuOpen')) {
            menuBtn.classList.remove('is-menuOpen');
            document.dispatchEvent(new CustomEvent('menu:toggle', {
              detail: { isOpen: false }
            }));
          }
        });
      });
    }
  }
}
export function headerStateOnScroll() {
  const header = document.querySelector('[data-trigger="header"]');
  const headerStateChangeElement = document.querySelector('[data-trigger="header-state-change"]');
  if (header) {
    ScrollTrigger.create({
      trigger: headerStateChangeElement,
      start: 'top top',
      end: 'bottom top',
      toggleClass: { targets: header, className: 'is-inversion' },
    });
  }
}