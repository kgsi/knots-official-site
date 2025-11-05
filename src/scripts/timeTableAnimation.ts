import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initTimeTableAnimation() {
  const timeTableSection = document.querySelector('[data-trigger="timetable"]');
  const circlePc = document.querySelector('[data-trigger="timetable-circle-pc"]');
  const circleSp = document.querySelector('[data-trigger="timetable-circle-sp"]');
  const timeTableBody = document.querySelector('[data-trigger="timetable-body"]');

  if (!timeTableSection || !circlePc || !circleSp || !timeTableBody) return
  
  gsap.to(circlePc, {
    scale: 0.35,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: circlePc,
      start: 'center 40%',
      endTrigger: timeTableBody,
      end: 'top 40%',
      pin: true,
      scrub: true
    }
  })

  const circleAnimation = gsap.timeline();
  circleAnimation.to(circlePc, {
    scale: 0.35,
    ease: 'power2.inOut',
    duration: 10,
  })
  .to(circlePc, {
    scale: 0,
    ease: 'power2.inOut',
    duration: 1,
  });

  ScrollTrigger.create({
    trigger: timeTableBody,
    start: 'top 40%',
    endTrigger: timeTableSection,
    end: 'bottom 40%',
    pin: circlePc,
    pinSpacing: false,
    animation: circleAnimation,
    scrub: true,
    invalidateOnRefresh: true
  })
}