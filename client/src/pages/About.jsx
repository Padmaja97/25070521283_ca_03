import { ArrowUpRight, Compass, Heart, Mountain, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  { icon: Compass, number: '01', title: 'Start where you are', text: 'Every fitness journey has its own starting point. Build a plan around your goals, your pace, and your life.' },
  { icon: Heart, number: '02', title: 'Consistency over perfection', text: 'Small steps, repeated often, can take you further than chasing the perfect workout.' },
  { icon: Mountain, number: '03', title: 'Progress is personal', text: 'Train for what matters to you. Your measure of progress belongs to you.' }
];

export default function About() {
  return <main>
    <section className="page-hero page-width"><p className="eyebrow dark-eyebrow"><span /> OUR APPROACH</p><h1>Built on effort.<br /><em>Open to everyone.</em></h1><p>Flex Gym is about more than showing up. It is about creating a routine you can return to — with focus, patience, and a little more confidence each time.</p><span className="page-counter">01 / ABOUT FLEX GYM</span></section>
    <section className="about-image-band"><img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1800&q=85" alt="Athlete training with focus" loading="lazy" /><div className="image-band-overlay"><span>MOVE WITH PURPOSE</span><span>GOREWADA ROAD · NAGPUR</span></div></section>
    <section className="values-section page-width"><div className="section-head"><div><p className="eyebrow dark-eyebrow"><span /> WHAT WE BELIEVE</p><h2>Fitness with <em>intention.</em></h2></div><p className="section-note">A thoughtful approach to training can make it easier to keep moving, even when progress takes time.</p></div><div className="values-grid">{values.map(({ icon: Icon, number, title, text }) => <article className="value-card" key={number}><span className="value-number">{number} / 03</span><Icon size={24} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="about-note"><div className="page-width about-note-inner"><span className="eyebrow"><span /> A NOTE ON FACILITIES</span><h2>Come see what’s<br /><em>right for you.</em></h2><p>Equipment, amenities, and training sessions can change. Contact the gym or visit in person to confirm current facilities and availability before making a decision.</p><Link className="button button-red" to="/contact">Ask us a question <MoveRight size={16} /></Link><div className="about-watermark">FLEX</div></div></section>
    <section className="about-end page-width"><span>READY WHEN YOU ARE</span><Link className="line-link" to="/memberships">Explore memberships <ArrowUpRight size={15} /></Link></section>
  </main>;
}
