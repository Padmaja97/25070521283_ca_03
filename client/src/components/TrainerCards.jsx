import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

export default function TrainerCards({ compact = false }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/trainers')
      .then(({ data }) => setTrainers(data.trainers))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Loading trainer profiles…</div>;
  if (error) return <div className="notice notice-error">{error}</div>;
  if (!trainers.length) return <div className="empty-panel">Trainer profiles will appear here when the gym adds them.</div>;
  return <div className={`trainer-grid ${compact ? 'trainer-compact' : ''}`}>{trainers.map((trainer, index) => <article className="trainer-card" key={trainer._id}>
    <div className="trainer-photo">{trainer.image ? <img src={trainer.image} alt={trainer.isSample ? `Sample portrait for ${trainer.name}` : trainer.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span>{trainer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>}<span className="trainer-number">0{index + 1}</span></div>
    <div className="trainer-info"><p className="trainer-specialty">{trainer.specialization}</p><h3>{trainer.name}{trainer.isSample && <span className="sample-label"> SAMPLE</span>}</h3><span className="trainer-exp">{trainer.experience}</span><p className="trainer-bio">{trainer.bio}</p><span className="trainer-more">TRAINING THAT MOVES YOU <ArrowUpRight size={13} /></span></div>
  </article>)}</div>;
}
