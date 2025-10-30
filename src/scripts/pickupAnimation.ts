import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function setupPickupAnimation() {
  const pickupSection = document.querySelector('.pickup');
  const wave = document.querySelector('[data-trigger="pickup-wave"]');
  if (!wave) return;
  const waveHeight = wave.clientHeight;
  const triggerStart = (waveHeight - window.innerHeight) / 2;

  gsap.set(wave, { opacity: 0 });

  const waveAnimation = gsap.timeline();
  waveAnimation.to(wave, {
    opacity: 1,
    duration: 3
  })
  .to(wave, {
    duration: 3
  }, '>')
  .to(wave, {
    opacity: 0,
    duration: 1
  }, '>');

  ScrollTrigger.create({
    trigger: pickupSection,
    start: `${triggerStart} top`,
    end: 'bottom bottom',
    scrub: true,
    pin: '[data-trigger="pickup-wave"]',
    pinSpacing: false,
    animation: waveAnimation
  });
}