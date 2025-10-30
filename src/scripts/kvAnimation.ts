import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function setupKvAnimation() {
  const kvWrapper = document.querySelector('[data-trigger="kv-wrapper"]');
  const kvContainer = document.querySelector('[data-trigger="kv-container"]');
  
  if (!kvWrapper || !kvContainer) return;
  
  ScrollTrigger.create({
    trigger: kvContainer,
    start: 'bottom 80%',
    end: 'bottom top',
    scrub: true,
    pin: true,
    pinSpacing: false
  });
}