import TrainerCards from '../components/TrainerCards';

export default function Trainers() {
  return <main>
    <section className="page-hero page-width"><p className="eyebrow dark-eyebrow"><span /> TRAIN WITH PURPOSE</p><h1>People who help<br /><em>you move forward.</em></h1><p>Meet the trainers currently listed by Flex Gym. Ask about their availability and approach before choosing a training plan.</p><span className="page-counter">03 / FLEX GYM</span></section>
    <section className="trainers-page-section"><div className="page-width"><div className="trainer-sample-banner">Sample trainer names, biographies, and portraits are for demonstration only. Replace them with confirmed profiles.</div><TrainerCards /></div></section>
  </main>;
}
