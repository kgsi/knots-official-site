import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function setupKvAnimation() {
  const kvWrapper = document.querySelector('[data-trigger="kv-wrapper"]');
  const kvContainer = document.querySelector('[data-trigger="kv-container"]');
  
  if (!kvWrapper || !kvContainer) return;
  
  gsap.to(kvContainer, {
    yPercent: -20,
    scrollTrigger: {
      trigger: kvContainer,
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: true,
      pin: true,
      pinSpacing: false
    }
  })
}