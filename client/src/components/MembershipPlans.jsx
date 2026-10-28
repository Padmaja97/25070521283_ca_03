import { ArrowUpRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import MembershipCard from './MembershipCard';

export default function MembershipPlans({ compact = false, onApplied }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState('');

  useEffect(() => {
    api.get('/plans')
      .then(({ data }) => setPlans(data.plans))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  async function apply(plan) {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/member' } } });
      return;
    }
    if (user.role !== 'member') {
      navigate('/admin');
      return;
    }
    setApplying(plan._id);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/memberships', { planId: plan._id });
      setMessage('Application sent. You can follow its status in your member dashboard.');
      onApplied?.(data.application);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setApplying('');
    }
  }

  return <div>
    {error && <div className="notice notice-error">{error}<button className="notice-action" onClick={() => window.location.reload()}>Retry</button></div>}
    {message && <div className="notice notice-success"><Check size={16} />{message}<Link to="/member">View status</Link></div>}
    {loading ? <div className="loading-state">Loading membership options…</div> : plans.length === 0 ? <div className="empty-panel">{error ? 'Membership plans are currently unavailable.' : 'Plans are not configured yet. Please check back soon.'}</div> :
      <div className={`plans-grid ${compact ? 'plans-compact' : ''}`}>{plans.map((plan, index) => <MembershipCard key={plan._id} featured={index === 1} index={index}>
        <div className="editorial-plan-top"><span className="plan-duration">{String(index + 1).padStart(2, '0')} / {plan.durationInDays} DAYS</span><ArrowUpRight size={16} /></div>
        <h3>{plan.name}</h3>
        <p className="plan-price"><span>₹</span>{Number(plan.price).toLocaleString('en-IN')}<small> / {plan.durationInDays} days</small></p>
        <div className="editorial-benefit-label">INCLUDED</div>
        <ul>{plan.benefits.map((benefit, i) => <li key={`${benefit}-${i}`}><Check size={15} />{benefit}</li>)}</ul>
        {plan.isSample && <p className="sample-note">Sample price — confirm with the gym</p>}
        <button className={`button ${index === 1 ? 'button-red' : 'button-outline-dark'} plan-apply`} onClick={() => apply(plan)} disabled={applying === plan._id}>{applying === plan._id ? 'Sending application…' : 'Apply for membership'} <ArrowUpRight size={15} /></button>
      </MembershipCard>)}</div>}
  </div>;
}
