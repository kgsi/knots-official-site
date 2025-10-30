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
  const resizeObserver = new ResizeObserver(() => {
    ScrollTrigger.refresh()
  })
  document.querySelectorAll('body, main, header, footer').forEach(el => {
    resizeObserver.observe(el)
  })
}