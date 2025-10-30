import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initAnimation = () => {
  const elements = document.querySelectorAll('.js-animation');
  
  elements.forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        element.classList.add('is-animated');
      }
    });
  });
};