import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import api, { getErrorMessage } from '../services/api';

export default function EnquiryForm({ compact = false }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await api.post('/enquiries', form);
      setSuccess(data.message);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return <form className={`form-stack ${compact ? 'compact-form' : ''}`} onSubmit={submit}>
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    {success && <div className="notice notice-success"><CheckCircle2 size={17} />{success}</div>}
    <div className="field"><label htmlFor={`enquiry-name-${compact}`}>Name</label><input id={`enquiry-name-${compact}`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} minLength="2" maxLength="80" autoComplete="name" required /></div>
    <div className="field-grid">
      <div className="field"><label htmlFor={`enquiry-email-${compact}`}>Email</label><input id={`enquiry-email-${compact}`} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
      <div className="field"><label htmlFor={`enquiry-phone-${compact}`}>Phone <span>(optional)</span></label><input id={`enquiry-phone-${compact}`} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength="20" /></div>
    </div>
    <div className="field"><label htmlFor={`enquiry-message-${compact}`}>How can we help?</label><textarea id={`enquiry-message-${compact}`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} minLength="10" maxLength="2000" rows={compact ? 3 : 5} placeholder="Tell us what you’d like to know." required /></div>
    <button className="button button-red form-submit" disabled={saving}>{saving ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={16} /></button>
  </form>;
}
