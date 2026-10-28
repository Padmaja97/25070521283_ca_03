import { ArrowUpRight, Check, Clock3, Dumbbell, RefreshCw, ShieldCheck, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import EnquiryForm from '../components/EnquiryForm';
import MembershipPlans from '../components/MembershipPlans';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';

function dateLabel(date) {
  return date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date)) : '—';
}

export default function MemberDashboard() {
  const { user, setUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/memberships/my');
      setApplications(data.applications);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function saveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setError('');
    setProfileMessage('');
    try {
      const { data } = await api.patch('/auth/me', profile);
      setUser(data.user);
      setProfileMessage('Your profile has been updated.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingProfile(false);
    }
  }

  function addApplication(application) {
    setApplications((items) => [application, ...items]);
  }

  return <main className="dashboard-page page-width">
    <div className="dashboard-welcome"><div><p className="eyebrow dark-eyebrow"><span /> MEMBER SPACE</p><h1>Good to have<br /><em>you here, {user.name.split(' ')[0]}.</em></h1><p>Your next step starts with showing up. Here’s where your membership stands.</p></div><div className="member-mark"><Dumbbell size={27} /><span>FLEX<br />MEMBER</span></div></div>
    {error && <div className="notice notice-error">{error}<button className="notice-action" onClick={refresh}><RefreshCw size={14} /> Retry</button></div>}
    <section className="dashboard-section"><div className="dashboard-section-head"><div><p className="eyebrow dark-eyebrow"><span /> APPLICATION HISTORY</p><h2>Your membership</h2></div><span className="application-count">{applications.length} {applications.length === 1 ? 'application' : 'applications'}</span></div>
      {loading ? <div className="loading-state">Loading your membership details…</div> : !applications.length ? <div className="empty-panel"><ShieldCheck size={24} /><h3>Your next chapter starts here.</h3><p>You haven’t applied for a membership yet. Browse the available options below.</p></div> : <div className="application-list">{applications.map((application) => <article className="application-card" key={application._id}><div className="application-card-head"><div><span className="application-plan-label">MEMBERSHIP PLAN</span><h3>{application.planId?.name || 'Plan no longer available'}</h3></div><StatusBadge status={application.status} /></div><div className="application-meta"><span><Clock3 size={15} /> Applied {dateLabel(application.createdAt)}</span><span><Dumbbell size={15} /> {application.planId?.durationInDays || '—'} days</span>{application.status === 'Approved' && <><span><Check size={15} /> Starts {dateLabel(application.startDate)}</span><span><Check size={15} /> Ends {dateLabel(application.endDate)}</span></>}</div><p className="application-footnote">{application.status === 'Pending' ? 'Waiting for the gym to review your application. This is not an active paid membership.' : application.status === 'Approved' ? 'Your membership application has been approved by the gym.' : 'This application was not approved. Contact the gym if you have questions.'}</p></article>)}</div>}
    </section>
    <section className="dashboard-section"><div className="dashboard-section-head"><div><p className="eyebrow dark-eyebrow"><span /> TAKE YOUR NEXT STEP</p><h2>Membership options</h2></div></div><MembershipPlans compact onApplied={addApplication} /></section>
    <section className="member-bottom-grid"><article className="dashboard-section"><div className="dashboard-section-head"><div><p className="eyebrow dark-eyebrow"><span /> YOUR DETAILS</p><h2>Profile</h2></div><UserRound size={19} /></div><form className="form-stack" onSubmit={saveProfile}>{profileMessage && <div className="notice notice-success"><Check size={15} />{profileMessage}</div>}<div className="field"><label htmlFor="profile-name">Name</label><input id="profile-name" minLength="2" maxLength="80" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></div><div className="field"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={user.email} disabled /></div><div className="field"><label htmlFor="profile-phone">Phone</label><input id="profile-phone" type="tel" maxLength="20" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div><button className="button button-outline-dark form-submit" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save profile'} <ArrowUpRight size={15} /></button></form></article>
      <article className="dashboard-section member-enquiry"><div className="dashboard-section-head"><div><p className="eyebrow dark-eyebrow"><span /> NEED A HAND?</p><h2>Send a message</h2></div></div><p className="section-note">Questions or feedback? Send an enquiry directly to the gym.</p><EnquiryForm compact /></article></section>
  </main>;
}
