import { ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';
import { useGymInfo } from '../context/GymInfoContext';

export default function Contact() {
  const { settings } = useGymInfo();
  return <main>
    <section className="page-hero page-width"><p className="eyebrow dark-eyebrow"><span /> CONTACT FLEX GYM</p><h1>Questions are<br /><em>a good place to start.</em></h1><p>Want to learn more about membership, training, or a visit? Send an enquiry and the team can follow up.</p><span className="page-counter">04 / WE’RE LISTENING</span></section>
    <section className="contact-page-section"><div className="page-width contact-layout"><div className="contact-info"><p className="eyebrow"><span /> GET IN TOUCH</p><h2>Let’s talk<br /><em>about your goals.</em></h2><p>Share a little about what you are looking for. Please avoid sending sensitive personal or medical information through this form.</p><div className="contact-detail"><MapPin size={19} /><div><span>LOCATION</span><strong>{settings.location}</strong><small>General area only; exact street address not provided.</small></div></div><div className="contact-detail"><Clock3 size={19} /><div><span>OPENING HOURS</span><strong>{settings.openingHours || 'Current timings not listed'}</strong><small>{settings.hoursAreSample && settings.openingHours ? 'Sample hours — please confirm directly with the gym.' : 'Please confirm current availability directly with the gym.'}</small></div></div><a className="line-link" href="https://www.google.com/maps/search/?api=1&query=Gorewada+Road%2C+Nagpur%2C+Maharashtra" target="_blank" rel="noreferrer">Open area in maps <ArrowUpRight size={15} /></a></div><div className="contact-form-panel"><p className="eyebrow dark-eyebrow"><span /> SEND AN ENQUIRY</p><h2>We’ll get back to you.</h2><EnquiryForm /></div></div></section>
  </main>;
}
