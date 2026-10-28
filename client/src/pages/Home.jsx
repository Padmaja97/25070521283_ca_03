import { ArrowDown, ArrowRight, ArrowUpRight, Check, Dumbbell, Flame, MoveUpRight, Target, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import EnquiryForm from '../components/EnquiryForm';
import MembershipPlans from '../components/MembershipPlans';
import ScrollReveal from '../components/ScrollReveal';
import TrainerCards from '../components/TrainerCards';
import { useGymInfo } from '../context/GymInfoContext';

const programs = [
  { icon: Dumbbell, title: 'BUILD', note: 'STRENGTH & RESISTANCE TRAINING', number: '01', description: 'Build strength with purposeful resistance training. Start at your level and progress at your own pace.' },
  { icon: Flame, title: 'MOVE', note: 'CARDIO & CONDITIONING', number: '02', description: 'Make movement part of your practice. Explore cardio and conditioning as a way to find your rhythm.' },
  { icon: Target, title: 'EVOLVE', note: 'PROGRESS & CONSISTENCY', number: '03', description: 'Keep showing up. Small, consistent efforts help shape a routine you can make your own.' }
];
const journey = ['ARRIVE', 'TRAIN', 'PROGRESS', 'TRANSFORM'];

function scrollToSection(event, sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  event.preventDefault();
  const hash = `#${sectionId}`;
  if (window.location.hash !== hash) window.history.pushState(null, '', hash);
  section.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start'
  });
}

export default function Home() {
  const { settings } = useGymInfo();
  return <main className="home-editorial">
    <section className="hero hero-editorial">
      <div className="hero-coordinate-grid" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <AnimatedBackground />
      <div className="hero-inner page-width">
        <p className="eyebrow"><span /> FLEX GYM <i className="hero-location">/ GOREWADA ROAD, NAGPUR</i></p>
        <h1 className="hero-title">ENTER YOUR<br /><em>NEXT FORM.</em></h1>
        <p className="hero-copy">Strength isn't a destination. It's a practice.</p>
        <div className="hero-actions"><a className="button button-red hero-main-cta" href="#memberships" onClick={(event) => scrollToSection(event, 'memberships')}>Explore memberships <ArrowUpRight size={17} /></a><a className="button button-ghost" href="#training-worlds" onClick={(event) => scrollToSection(event, 'training-worlds')}>Start your journey <ArrowRight size={16} /></a></div>
        <div className="hero-proof"><span className="proof-bar" /><span>TRAIN WITH PURPOSE. BUILD STRENGTH. BECOME UNSTOPPABLE.</span></div>
      </div>
      <div className="hero-object-caption"><span>01 — SIGNATURE STUDY</span><span>FORM / 001</span></div>
      <a className="hero-scroll" href="#intro"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      <div className="hero-index"><span>01</span><i />04</div>
    </section>

    <ScrollReveal><section className="intro-section page-width" id="intro"><div className="section-index">01 <span>/ THE PRACTICE</span></div><div className="intro-copy"><p className="eyebrow dark-eyebrow"><span /> FORM FOLLOWS INTENTION</p><h2>Progress isn’t a finish line.<br /><em>It’s a way forward.</em></h2><p>Flex Gym is a place to build a routine that feels like yours. Start where you are, move with intention, and give yourself room to grow — one training day at a time.</p><Link className="line-link" to="/about">The Flex approach <ArrowUpRight size={15} /></Link></div><div className="intro-stamp"><span>SHOW<br />UP.</span><div>CONSISTENCY<br />OVER PERFECTION</div></div></section></ScrollReveal>

    <ScrollReveal><section className="program-section training-worlds" id="training-worlds"><div className="page-width"><div className="section-head"><div><p className="eyebrow"><span /> THREE WAYS INTO THE WORK</p><h2>Find your <em>form.</em></h2></div><p className="section-note">Training themes, not a list of confirmed facilities or services. Ask the gym what is currently available.</p></div><div className="program-grid">{programs.map((program) => <article className={`program-card world-card world-${program.title.toLowerCase()}`} key={program.number}><div className="world-art" aria-hidden="true"><span className="world-art-ring" /><span className="world-art-core"><program.icon size={25} /></span><span className="world-art-index">{program.number}</span></div><div className="program-top"><span>{program.number} / 03</span><program.icon size={20} /></div><div className="world-copy"><span className="program-note">{program.note}</span><h3>{program.title}</h3><p>{program.description}</p></div><MoveUpRight size={17} className="program-arrow" /></article>)}</div></div></section></ScrollReveal>

    <ScrollReveal><section className="journey-section"><div className="page-width"><div className="journey-heading"><p className="eyebrow"><span /> THE WORK IS THE WAY</p><p>NO SHORTCUTS. JUST YOUR NEXT STEP.</p></div><div className="journey-sequence">{journey.map((step, index) => <div className="journey-step" key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < journey.length - 1 && <i aria-hidden="true" />}</div>)}</div><div className="journey-bottom"><span>YOUR FORM CHANGES. YOUR PRACTICE CONTINUES.</span><Link className="line-link light-link" to="/about">Our approach <ArrowUpRight size={14} /></Link></div></div></section></ScrollReveal>

    <ScrollReveal><section className="plans-section page-width" id="memberships"><div className="section-head"><div><p className="eyebrow dark-eyebrow"><span /> COMMIT TO YOURSELF</p><h2>Your next step.<br /><em>Your terms.</em></h2></div><p className="section-note">Membership details are loaded from Flex Gym. Prices and benefits shown are sample content until confirmed by the gym.</p></div><MembershipPlans compact /><Link className="line-link all-plans" to="/memberships">See all membership details <ArrowUpRight size={15} /></Link></section></ScrollReveal>

    <ScrollReveal><section className="trainer-section"><div className="page-width"><div className="section-head"><div><p className="eyebrow"><span /> GUIDANCE FOR YOUR GOALS</p><h2>Meet your <em>motivators.</em></h2></div><Link className="line-link light-link" to="/trainers">Meet the trainers <ArrowUpRight size={15} /></Link></div><TrainerCards compact /></div></section></ScrollReveal>

    <ScrollReveal><section className="sample-quote"><div className="quote-mark">“</div><div><p className="eyebrow dark-eyebrow"><span /> COMMUNITY NOTES</p><blockquote>“Sample visitor quote — replace this text with an approved testimonial from a real gym member.”</blockquote><span className="sample-note">DEMONSTRATION CONTENT — NOT A REAL TESTIMONIAL</span></div></section></ScrollReveal>

    <ScrollReveal><section className="contact-cta"><div className="contact-cta-copy"><p className="eyebrow"><span /> HAVE A QUESTION?</p><h2>Let’s start a<br /><em>conversation.</em></h2><p>Ask us about memberships, training, or getting started.</p><Link className="button button-red" to="/contact">Contact Flex Gym <ArrowUpRight size={16} /></Link></div><div className="contact-cta-form"><EnquiryForm compact /></div></section></ScrollReveal>

    <section className="location-strip"><div><Timer size={19} /><span><b>Opening hours</b><small>{settings.openingHours || 'Current hours are not listed.'}</small>{settings.hoursAreSample && settings.openingHours && <small className="strip-sample">SAMPLE — PLEASE CONFIRM</small>}</span></div><div><Target size={19} /><span><b>Find Flex Gym</b><small>{settings.location}</small></span></div><a href="https://www.google.com/maps/search/?api=1&query=Gorewada+Road%2C+Nagpur%2C+Maharashtra" target="_blank" rel="noreferrer">OPEN MAP <ArrowUpRight size={14} /></a></section>
  </main>;
}
