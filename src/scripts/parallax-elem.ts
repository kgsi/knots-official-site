import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger);

export function parallaxElem() {
  const parallaxElems= Array.from(document.querySelectorAll('[data-parallax]') as NodeListOf<Element>);
  if (parallaxElems.length === 0) return;

  console.log(parallaxElems);

  parallaxElems.forEach((elem) => {
    const speed = Number((elem as HTMLElement).dataset.parallax) || 0;
    gsap.fromTo(
      elem,
      { y: speed * -0.5 },
      {
        y: speed * 0.5,
        scrollTrigger: {
          trigger: elem,
          scrub: 1.2,
        },
      }
    );
  });
};

