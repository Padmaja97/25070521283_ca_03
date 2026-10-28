import { ArrowDownToLine, ArrowUpRight, Check, ClipboardList, Dumbbell, Mail, RefreshCw, Search, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useGymInfo } from '../context/GymInfoContext';
import api, { getErrorMessage } from '../services/api';

const tabs = [
  { id: 'overview', label: 'Overview', icon: ClipboardList },
  { id: 'applications', label: 'Applications', icon: Check },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'plans', label: 'Plans', icon: ArrowUpRight },
  { id: 'trainers', label: 'Trainers', icon: Dumbbell },
  { id: 'enquiries', label: 'Enquiries', icon: Mail },
  { id: 'gym-info', label: 'Gym info', icon: Dumbbell }
];
const freshPlan = () => ({ name: '', durationInDays: 30, price: 0, benefits: [], benefitsText: '', isActive: true });
const freshTrainer = () => ({ name: '', specialization: '', experience: '', bio: '', image: '', isActive: true });

function dateLabel(date) {
  return date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date)) : '—';
}

export default function AdminDashboard() {
  const { settings, setSettings } = useGymInfo();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [planForm, setPlanForm] = useState(freshPlan());
  const [trainerForm, setTrainerForm] = useState(freshTrainer());
  const [editPlan, setEditPlan] = useState('');
  const [editTrainer, setEditTrainer] = useState('');
  const [workingId, setWorkingId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboard, applicationsResponse, membersResponse, plansResponse, trainersResponse, enquiriesResponse, settingsResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/memberships'),
        api.get('/admin/members', { params: search ? { search } : {} }),
        api.get('/plans'),
        api.get('/trainers'),
        api.get('/enquiries'),
        api.get('/admin/settings')
      ]);
      setStats(dashboard.data.stats);
      setActivity(dashboard.data.recentActivity);
      setApplications(applicationsResponse.data.applications);
      setMembers(membersResponse.data.users);
      setPlans(plansResponse.data.plans);
      setTrainers(trainersResponse.data.trainers);
      setEnquiries(enquiriesResponse.data.enquiries);
      setSettings(settingsResponse.data.settings);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  async function updateApplication(application, status) {
    setWorkingId(application._id);
    setError('');
    try {
      const startDate = status === 'Approved' ? window.prompt('Membership start date (YYYY-MM-DD). Leave blank to start today:', '') : '';
      if (status === 'Approved' && startDate === null) return;
      const { data } = await api.patch(`/memberships/${application._id}/status`, { status, ...(startDate ? { startDate } : {}) });
      setApplications((items) => items.map((item) => item._id === application._id ? data.application : item));
      setNotice(`Application ${status.toLowerCase()}.`);
      await refreshStats();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setWorkingId('');
    }
  }

  async function refreshStats() {
    const { data } = await api.get('/admin/dashboard');
    setStats(data.stats);
    setActivity(data.recentActivity);
  }

  async function savePlan(event) {
    event.preventDefault();
    setError('');
    setWorkingId('plan');
    const payload = { ...planForm, benefits: planForm.benefitsText.split('\n').map((item) => item.trim()).filter(Boolean) };
    delete payload.benefitsText;
    try {
      await (editPlan ? api.put(`/plans/${editPlan}`, payload) : api.post('/plans', payload));
      setPlanForm(freshPlan());
      setEditPlan('');
      setNotice('Membership plan saved.');
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setWorkingId('');
    }
  }

  function beginEditPlan(plan) {
    setEditPlan(plan._id);
    setPlanForm({ ...plan, benefitsText: plan.benefits.join('\n') });
    document.getElementById('plan-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function removePlan(plan) {
    if (!window.confirm(`Delete ${plan.name}? Plans with applications must be deactivated instead.`)) return;
    try {
      await api.delete(`/plans/${plan._id}`);
      setNotice('Plan deleted.');
      await load();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  async function saveTrainer(event) {
    event.preventDefault();
    setError('');
    setWorkingId('trainer');
    try {
      await (editTrainer ? api.put(`/trainers/${editTrainer}`, trainerForm) : api.post('/trainers', trainerForm));
      setTrainerForm(freshTrainer());
      setEditTrainer('');
      setNotice('Trainer profile saved.');
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setWorkingId('');
    }
  }

  function beginEditTrainer(trainer) {
    setEditTrainer(trainer._id);
    setTrainerForm({ ...trainer });
    document.getElementById('trainer-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function removeTrainer(trainer) {
    if (!window.confirm(`Remove ${trainer.name} from the trainer list?`)) return;
    try {
      await api.delete(`/trainers/${trainer._id}`);
      setNotice('Trainer removed.');
      await load();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  async function markEnquiry(enquiry) {
    setWorkingId(enquiry._id);
    try {
      const { data } = await api.patch(`/enquiries/${enquiry._id}/status`, { status: enquiry.status === 'New' ? 'Handled' : 'New' });
      setEnquiries((items) => items.map((item) => item._id === enquiry._id ? data.enquiry : item));
      await refreshStats();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setWorkingId(''); }
  }

  async function saveGymInfo(event) {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api.put('/admin/settings', { location: settings.location, openingHours: settings.openingHours });
      setSettings(data.settings);
      setNotice('Gym information updated.');
    } catch (requestError) { setError(getErrorMessage(requestError)); }
  }

  return <main className="admin-page page-width">
    <div className="admin-welcome"><div><p className="eyebrow dark-eyebrow"><span /> FLEX GYM MANAGEMENT</p><h1>Good morning.<br /><em>Here’s your gym at a glance.</em></h1><p>Manage members, applications, plans, trainers, and enquiries in one place.</p></div><button className="button button-outline-dark" onClick={load} disabled={loading}><RefreshCw size={15} /> Refresh data</button></div>
    {error && <div className="notice notice-error" role="alert">{error}<button className="notice-action" onClick={load}>Try again</button></div>}
    {notice && <div className="notice notice-success"><Check size={15} />{notice}<button className="notice-dismiss" onClick={() => setNotice('')}>Dismiss</button></div>}
    <nav className="admin-tabs" aria-label="Admin sections">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setNotice(''); }}><Icon size={15} />{label}</button>)}</nav>
    {loading && !stats ? <div className="loading-state">Loading management data…</div> : <>
      {tab === 'overview' && <section>
        <div className="admin-stat-grid">{[
          ['Registered members', stats?.totalUsers, Users, 'var(--accent)'],
          ['Membership applications', stats?.totalApplications, ClipboardList, '#d6a64c'],
          ['Pending applications', stats?.pendingApplications, ArrowDownToLine, '#d9794a'],
          ['Approved applications', stats?.approvedApplications, Check, '#61a883'],
          ['Total enquiries', stats?.totalEnquiries, Mail, '#8a74cf'],
          ['New enquiries', stats?.newEnquiries, Mail, '#d9794a']
        ].map(([label, value, Icon, color]) => <article className="admin-stat" key={label}><Icon size={19} style={{ color }} /><span>{label}</span><strong>{value ?? '—'}</strong></article>)}</div>
        <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> WHAT’S HAPPENING</p><h2>Recent activity</h2></div></div>{activity.length ? <div className="activity-list">{activity.map((item, index) => <div className="activity-row" key={`${item.type}-${item.createdAt}-${index}`}><span className={`activity-icon ${item.type}`}><>{item.type === 'application' ? <ClipboardList size={15} /> : <Mail size={15} />}</></span><span><b>{item.label}</b><small>{dateLabel(item.createdAt)}</small></span><StatusBadge status={item.status} /></div>)}</div> : <div className="empty-panel">No activity yet. New applications and enquiries will appear here.</div>}</section>
      </section>}
      {tab === 'applications' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> MEMBER REQUESTS</p><h2>Membership applications</h2></div><span className="application-count">{applications.length} total</span></div>{applications.length ? <div className="management-list">{applications.map((application) => <article className="management-card" key={application._id}><div className="management-main"><div><span className="application-plan-label">{application.planId?.name} · {application.planId?.durationInDays} DAYS</span><h3>{application.userId?.name || 'Deleted member'}</h3><p>{application.userId?.email} {application.userId?.phone && `· ${application.userId.phone}`}</p></div><StatusBadge status={application.status} /></div><div className="management-meta"><span>Applied {dateLabel(application.createdAt)}</span><span>{application.startDate ? `Start ${dateLabel(application.startDate)} · End ${dateLabel(application.endDate)}` : 'No membership dates assigned'}</span></div>{application.status === 'Pending' && <div className="management-actions"><button className="button button-red" disabled={workingId === application._id} onClick={() => updateApplication(application, 'Approved')}>{workingId === application._id ? 'Saving…' : 'Approve & set dates'}</button><button className="button button-outline-dark" disabled={workingId === application._id} onClick={() => updateApplication(application, 'Rejected')}>Reject application</button></div>}</article>)}</div> : <div className="empty-panel">Membership applications will appear here.</div>}</section>}
      {tab === 'members' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> MEMBER DIRECTORY</p><h2>Registered members</h2></div><label className="admin-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" /></label></div>{members.length ? <div className="management-list">{members.map((member) => <article className="member-row" key={member._id}><span className="member-avatar">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><b>{member.name}</b><small>{member.email}{member.phone ? ` · ${member.phone}` : ''}</small></span><span className="member-created">Joined {dateLabel(member.createdAt)}</span></article>)}</div> : <div className="empty-panel">No members found.</div>}</section>}
      {tab === 'plans' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> CONFIGURE MEMBERSHIPS</p><h2>Plans & pricing</h2></div></div><form id="plan-editor" className="admin-editor" onSubmit={savePlan}><h3>{editPlan ? 'Edit membership plan' : 'Add a plan'}</h3><div className="admin-editor-grid"><div className="field"><label>Plan name</label><input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} minLength="2" maxLength="80" required /></div><div className="field"><label>Duration (days)</label><input type="number" min="1" max="3650" value={planForm.durationInDays} onChange={(e) => setPlanForm({ ...planForm, durationInDays: Number(e.target.value) })} required /></div><div className="field"><label>Price (INR)</label><input type="number" min="0" max="10000000" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })} required /></div><div className="field"><label>Availability</label><select value={String(planForm.isActive)} onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.value === 'true' })}><option value="true">Active</option><option value="false">Inactive</option></select></div><div className="field editor-wide"><label>Benefits (one per line)</label><textarea rows="3" value={planForm.benefitsText} onChange={(e) => setPlanForm({ ...planForm, benefitsText: e.target.value })} placeholder="Gym access&#10;Progress check-in" /></div></div><div className="management-actions"><button className="button button-red" disabled={workingId === 'plan'}>{workingId === 'plan' ? 'Saving…' : editPlan ? 'Save changes' : 'Add plan'}</button>{editPlan && <button type="button" className="button button-outline-dark" onClick={() => { setEditPlan(''); setPlanForm(freshPlan()); }}>Cancel edit</button>}</div></form><div className="management-list">{plans.map((plan) => <article className="management-card" key={plan._id}><div className="management-main"><div><span className="application-plan-label">{plan.durationInDays} DAYS · ₹{Number(plan.price).toLocaleString('en-IN')}{plan.isSample ? ' · SAMPLE' : ''}</span><h3>{plan.name}</h3><p>{plan.benefits.join(' · ') || 'No listed benefits'}</p></div><StatusBadge status={plan.isActive ? 'Active' : 'Inactive'} /></div><div className="management-actions"><button className="button button-outline-dark" onClick={() => beginEditPlan(plan)}>Edit</button>{plan.isActive && <button className="button button-outline-dark" onClick={() => api.put(`/plans/${plan._id}`, { name: plan.name, durationInDays: plan.durationInDays, price: plan.price, benefits: plan.benefits, isActive: false }).then(load).catch((requestError) => setError(getErrorMessage(requestError)))}>Deactivate</button>}<button className="button button-outline-dark" onClick={() => removePlan(plan)}>Delete</button></div></article>)}</div></section>}
      {tab === 'trainers' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> COACH DIRECTORY</p><h2>Trainer profiles</h2></div></div><form id="trainer-editor" className="admin-editor" onSubmit={saveTrainer}><h3>{editTrainer ? 'Edit trainer profile' : 'Add a trainer'}</h3><div className="admin-editor-grid"><div className="field"><label>Name</label><input value={trainerForm.name} onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })} minLength="2" maxLength="80" required /></div><div className="field"><label>Specialization</label><input value={trainerForm.specialization} onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })} maxLength="100" required /></div><div className="field"><label>Experience</label><input value={trainerForm.experience} onChange={(e) => setTrainerForm({ ...trainerForm, experience: e.target.value })} maxLength="80" placeholder="e.g. 5 years" required /></div><div className="field"><label>Image URL (HTTPS)</label><input type="url" value={trainerForm.image} onChange={(e) => setTrainerForm({ ...trainerForm, image: e.target.value })} /></div><div className="field editor-wide"><label>Biography</label><textarea rows="3" minLength="10" maxLength="500" value={trainerForm.bio} onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })} required /></div><label className="active-check"><input type="checkbox" checked={trainerForm.isActive} onChange={(e) => setTrainerForm({ ...trainerForm, isActive: e.target.checked })} /> Visible on public trainer page</label></div><div className="management-actions"><button className="button button-red" disabled={workingId === 'trainer'}>{workingId === 'trainer' ? 'Saving…' : editTrainer ? 'Save changes' : 'Add trainer'}</button>{editTrainer && <button type="button" className="button button-outline-dark" onClick={() => { setEditTrainer(''); setTrainerForm(freshTrainer()); }}>Cancel edit</button>}</div></form><div className="management-list">{trainers.map((trainer) => <article className="management-card" key={trainer._id}><div className="management-main"><div><span className="application-plan-label">{trainer.specialization}{trainer.isSample ? ' · SAMPLE PROFILE' : ''}</span><h3>{trainer.name}</h3><p>{trainer.experience} · {trainer.bio}</p></div><StatusBadge status={trainer.isActive ? 'Active' : 'Inactive'} /></div><div className="management-actions"><button className="button button-outline-dark" onClick={() => beginEditTrainer(trainer)}>Edit</button><button className="button button-outline-dark" onClick={() => removeTrainer(trainer)}>Remove</button></div></article>)}</div></section>}
      {tab === 'gym-info' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> PUBLIC GYM DETAILS</p><h2>Location & opening hours</h2></div></div><p className="section-note">This information appears on the public website. Use confirmed details only; sample hours will no longer be marked sample after you save.</p><form className="admin-editor" onSubmit={saveGymInfo}><div className="admin-editor-grid"><div className="field editor-wide"><label>Location</label><input value={settings.location || ''} onChange={(e) => setSettings({ ...settings, location: e.target.value })} minLength="5" maxLength="160" required /></div><div className="field editor-wide"><label>Opening hours / contact note</label><textarea rows="4" value={settings.openingHours || ''} onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })} maxLength="500" placeholder="Add confirmed days and hours, or a note to contact the gym." required /></div></div>{settings.hoursAreSample && <div className="notice notice-error">The current opening hours are sample values. Replace them with confirmed hours before presenting them as actual.</div>}<div className="management-actions"><button className="button button-red">Save gym information</button></div></form></section>}
      {tab === 'enquiries' && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow dark-eyebrow"><span /> INBOX</p><h2>Contact enquiries</h2></div><span className="application-count">{enquiries.length} total</span></div>{enquiries.length ? <div className="management-list">{enquiries.map((enquiry) => <article className="management-card" key={enquiry._id}><div className="management-main"><div><span className="application-plan-label">{enquiry.email}{enquiry.phone ? ` · ${enquiry.phone}` : ''}</span><h3>{enquiry.name}</h3><p className="enquiry-message">{enquiry.message}</p><small>{dateLabel(enquiry.createdAt)}</small></div><StatusBadge status={enquiry.status} /></div><div className="management-actions"><button className="button button-outline-dark" disabled={workingId === enquiry._id} onClick={() => markEnquiry(enquiry)}>{enquiry.status === 'New' ? 'Mark handled' : 'Reopen enquiry'}</button></div></article>)}</div> : <div className="empty-panel">Contact form submissions will appear here.</div>}</section>}
    </>}
  </main>;
}
