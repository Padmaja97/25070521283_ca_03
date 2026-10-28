import { ArrowDown, ShieldCheck } from 'lucide-react';
import MembershipPlans from '../components/MembershipPlans';

export default function Memberships() {
  return <main>
    <section className="page-hero page-width"><p className="eyebrow dark-eyebrow"><span /> MEMBERSHIPS</p><h1>Choose your<br /><em>kind of commitment.</em></h1><p>Start with a duration that suits you. Membership applications are reviewed by the gym; applying does not activate a paid membership.</p><a className="line-link" href="#plans">See membership options <ArrowDown size={14} /></a><span className="page-counter">02 / FLEX GYM</span></section>
    <section className="membership-list-section" id="plans"><div className="page-width"><div className="membership-callout"><ShieldCheck size={19} /><span>Transparent applications, confirmed by the gym</span><small>Prices below are editable demo values, not confirmed gym rates.</small></div><MembershipPlans /></div></section>
    <section className="membership-faq page-width"><div><p className="eyebrow dark-eyebrow"><span /> GOOD TO KNOW</p><h2>Before you<br /><em>get started.</em></h2></div><article><h3>What happens after I apply?</h3><p>Your application is saved and marked pending. The gym reviews it and updates the status. Your membership only becomes approved after the gym confirms it.</p><h3>When does the membership period begin?</h3><p>The gym sets the start date when approving the application. The end date is calculated from the selected plan duration.</p><h3>Are the listed prices final?</h3><p>No. These are sample prices for the academic demo. Confirm actual prices and benefits directly with Flex Gym before applying.</p></article></section>
  </main>;
}
