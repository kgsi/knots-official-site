
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initTimeTableAnimation() {
  const timeTableSection = document.querySelector('[data-trigger="timetable"]');
  const circlePc = document.querySelector('[data-trigger="timetable-circle-pc"]');
  const circleSp = document.querySelector('[data-trigger="timetable-circle-sp"]');
  const timeTableBody = document.querySelector('[data-trigger="timetable-body"]');
  const timeTableWrap = document.querySelector('[data-trigger="timetable-wrap"]');

  if (!timeTableSection || !circlePc || !circleSp || !timeTableBody || !timeTableWrap) return
  
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

  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  ScrollTrigger.create({
    trigger: timeTableWrap,
    start: 'top 30%',
    end: 'bottom 55%',
    pin: circleSp,
    pinType: isSafari ? 'fixed' : 'transform',
    onLeave: () => {
      gsap.to(circleSp, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    },
    onEnterBack: () => {
      gsap.to(circleSp, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    },
  });
}

export function timeTableSwitch() {
  const switchInput = document.querySelector('input[data-switch]') as HTMLInputElement | null;
  const switchTriggers = document.querySelectorAll('[data-switch-trigger]');
  if (!switchInput || switchTriggers.length === 0) return;

  switchTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const stage = trigger.getAttribute('data-switch-trigger');
      if (!stage) return;
      if (stage === 'cross') {
        switchInput.checked = false;
      } else if (stage === 'wave') {
        switchInput.checked = true;
      }
    });
  });
}