import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function setupPickupAnimation() {
  const pickupSection = document.querySelector('[data-trigger="pickup"]');
  const wave = document.querySelector('[data-trigger="pickup-wave"]');
  if (!wave) return;

  gsap.fromTo(wave, {
    opacity: 0,
    duration: 0.8,
  },
  {
    opacity: 1,
    duration: 0.8,
    scrollTrigger: {
      trigger: pickupSection,
      start: `top top`,
      end: `bottom 60%`,
      toggleActions: 'play reverse play reverse'
    }
  });
}