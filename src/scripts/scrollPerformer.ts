import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger,ScrollSmoother,ScrollToPlugin)

let smoother: ScrollSmoother | null = null;

export function initScrollSmoother() {
  smoother = ScrollSmoother.create({
    smooth: 1.2,
    effects: true,
    normalizeScroll: true
  });

  // 初期ロード中はスクロールを停止（is-loading クラスが付いている間）
  if (document.body.classList.contains('is-loading')) {
    smoother.paused(true)
    const resume = () => {
      smoother?.paused(false)
      ScrollTrigger.refresh()
    }
    document.addEventListener('page:loaded', resume, { once: true })
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // メニューの開閉イベントをリッスン
  document.addEventListener('menu:toggle', (event) => {
    const customEvent = event as CustomEvent;
    if (smoother) {
      if (customEvent.detail.isOpen) {
        smoother.paused(true);
      } else {
        smoother.paused(false);
      }
    }
  });
  // モーダルの開閉イベントをリッスン
  document.addEventListener('modal:toggle', (event) => {
    const customEvent = event as CustomEvent;
    if (smoother) {
      if (customEvent.detail.isOpen) {
        smoother.paused(true);
      } else {
        smoother.paused(false);
      }
    }
  });

  return smoother;
}

export function getScrollSmoother() {
  return smoother;
}

export function initSmoothAnchorLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href && href !== '#') {
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          gsap.to(window, {
            duration: 0.8,
            scrollTo: {
              y: target,
              offsetY: document.getElementById('header')?.offsetHeight
            },
            ease: "power2.out"
          });
        }
      }
    });
  });
}

export function refreshScrollTrigger() {
  const resizeObserver = new ResizeObserver((entries) => {
    ScrollTrigger.refresh();
  });
  resizeObserver.observe(document.body);
}