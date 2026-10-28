import { useRef } from 'react';

export default function MembershipCard({ children, featured = false, index = 0 }) {
  const card = useRef(null);

  function tilt(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = card.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.current.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    card.current.style.setProperty('--tilt-y', `${(x - 0.5) * 6}deg`);
    card.current.style.setProperty('--shine-x', `${x * 100}%`);
    card.current.style.setProperty('--shine-y', `${y * 100}%`);
  }

  function reset() {
    if (!card.current) return;
    card.current.style.setProperty('--tilt-x', '0deg');
    card.current.style.setProperty('--tilt-y', '0deg');
    card.current.style.setProperty('--shine-x', '50%');
    card.current.style.setProperty('--shine-y', '50%');
  }

  return <article
    ref={card}
    className={`plan-card editorial-plan${featured ? ' plan-featured' : ''}`}
    style={{ '--plan-index': index }}
    onPointerMove={tilt}
    onPointerLeave={reset}
    onBlur={reset}
  >
    {children}
  </article>;
}
