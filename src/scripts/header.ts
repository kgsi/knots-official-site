import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function headerAnimation() {
  const pageWrapper = document.querySelector('[data-trigger="page-wrapper"]');
  const header = document.querySelector('[data-trigger="header"]');
  const wave = document.querySelector('[data-trigger="header-wave"]');
  
  if (pageWrapper || header || wave) {
    const headerAnimation = gsap.timeline();
    headerAnimation.to(wave, {
      translateY: '-100%',
      ease: 'none',
    })
    .to(header, {
      translateY: 0,
      opacity: 1,
      ease: 'none',
      onComplete: () => {
        ScrollTrigger.refresh();
      }
    });
    
    ScrollTrigger.create({
      trigger: pageWrapper,
      start: 'top top',
      end: '+=400',
      pin: true,
      animation: headerAnimation,
      scrub: true,
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