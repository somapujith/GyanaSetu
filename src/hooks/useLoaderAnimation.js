import { useEffect } from 'react';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('hop', '0.9, 0, 0.1, 1');
CustomEase.create('smooth', '0.25, 0.1, 0.25, 1');

export const useLoaderAnimation = () => {
  useEffect(() => {
    const storageKey = 'gyanasetu_loader_seen';
    const hasSeenLoader = window.localStorage.getItem(storageKey) === 'true';

    if (hasSeenLoader) {
      document.body.classList.add('skip-loader');
      const loader = document.querySelector('.loader');
      if (loader) loader.style.display = 'none';
      return;
    }

    // Initialize elements
    gsap.set('.container', { opacity: 0, visibility: 'hidden' });
    gsap.set('.hero-bg', { scale: 1.2 });
    gsap.set('.spinner-container', { opacity: 1 });

    const tl = gsap.timeline({
      delay: 0.2,
      defaults: {
        ease: 'hop',
      },
    });

    const counts = document.querySelectorAll('.count');

    // Counter animation - faster
    counts.forEach((count, index) => {
      const digits = count.querySelectorAll('.digit h1');

      tl.to(
        digits,
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.06,
        },
        index * 0.8
      );

      if (index < counts.length) {
        tl.to(
          digits,
          {
            y: '-100%',
            duration: 0.8,
            stagger: 0.06,
          },
          index * 0.8 + 0.6
        );
      }
    });

    // Fade out spinner
    tl.to('.spinner-container', {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.out',
    }, '-=0.5');

    // Reveal logo words - dramatic entrance
    tl.to(
      '#word-1 h1',
      {
        y: '0%',
        duration: 0.9,
        ease: 'hop',
      },
      '<+0.1'
    );

    tl.to(
      '#word-2 h1',
      {
        y: '0%',
        duration: 0.9,
        ease: 'hop',
      },
      '<+0.1'
    );

    // Show divider
    tl.to('.divider', {
      scaleY: 1,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4');

    // Hold for a moment
    tl.to({}, { duration: 0.4 });

    // Words exit - word1 goes down, word2 goes up
    tl.to('#word-1 h1', {
      y: '110%',
      duration: 0.7,
      ease: 'hop',
    });

    tl.to(
      '#word-2 h1',
      {
        y: '-110%',
        duration: 0.7,
        ease: 'hop',
      },
      '<'
    );

    // Fade divider
    tl.to('.divider', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, '<');

    // SWIPE REVEAL - The magic happens here
    tl.to(
      '.block',
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.inOut',
      },
      '<+0.2'
    );

    // Simultaneously animate content in
    tl.to('.container', {
      opacity: 1,
      visibility: 'visible',
      duration: 0.01,
    }, '<');

    tl.to(
      '.hero-bg',
      {
        scale: 1,
        duration: 1.8,
        ease: 'smooth',
      },
      '<'
    );

    // Stagger in all the hero elements
    tl.to(
      '.nav',
      {
        y: '0%',
        opacity: 1,
        duration: 1,
        ease: 'smooth',
      },
      '<+0.3'
    );

    tl.to(
      '.pill',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'smooth',
      },
      '<+0.15'
    );

    tl.to(
      '.line h1, .line.subtitle',
      {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'smooth',
      },
      '<+0.1'
    );

    tl.to(
      '.cta',
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'back.out(1.7)',
      },
      '<+0.2'
    );

    tl.to(
      '.stats',
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'smooth',
      },
      '<+0.15'
    );

    // Cleanup
    tl.set('.loader', { display: 'none' });
    tl.call(() => {
      window.localStorage.setItem(storageKey, 'true');
    });
  }, []);
};
