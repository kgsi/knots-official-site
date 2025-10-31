import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initAnimation = () => {
  const elements = document.querySelectorAll('[data-trigger="intersect-anim"]');
  
  elements.forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 50%',
      once: true,
      onEnter: () => {
        element.classList.add('is-animated');
      }
    });
  });
};