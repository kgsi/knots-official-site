import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

export function parallaxElem() {
  const parallaxElements= Array.from(document.querySelectorAll('[data-parallax]') as NodeListOf<Element>);
  if (parallaxElements.length === 0) return;

  parallaxElements.forEach((elem) => {
    const speed = Number((elem as HTMLElement).dataset.parallax) || 0;
    gsap.fromTo(elem, {
      y: speed * -0.5
    },{
      y: speed * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: elem,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      }
    })
  });
};

