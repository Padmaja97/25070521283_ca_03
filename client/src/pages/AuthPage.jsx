import { ArrowLeft, ArrowRight, Dumbbell } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/member'} replace />;
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const signedIn = await (isRegister ? register(values) : login({ email: values.email, password: values.password }));
      navigate(location.state?.from?.pathname || (signedIn.role === 'admin' ? '/admin' : '/member'), { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }
  return <main className="auth-page"><section className="auth-box"><Link className="auth-back" to="/"><ArrowLeft size={15} /> BACK TO FLEX GYM</Link><span className="auth-icon"><Dumbbell size={22} /></span><p className="eyebrow dark-eyebrow"><span /> YOUR FLEX ACCOUNT</p><h1>{isRegister ? <>Start strong.<br /><em>Stay consistent.</em></> : <>Good to see<br /><em>you again.</em></>}</h1><p className="auth-intro">{isRegister ? 'Create your member account to apply for a membership and follow its status.' : 'Log in to manage your profile and keep up with your membership application.'}</p>
    <form className="form-stack" onSubmit={submit}>
      {error && <div className="notice notice-error" role="alert">{error}</div>}
      {isRegister && <><div className="field"><label htmlFor="register-name">Full name</label><input id="register-name" autoComplete="name" minLength="2" maxLength="80" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} required /></div><div className="field"><label htmlFor="register-phone">Phone <span>(optional)</span></label><input id="register-phone" type="tel" autoComplete="tel" maxLength="20" value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} /></div></>}
      <div className="field"><label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} required /></div>
      <div className="field"><label htmlFor="auth-password">Password</label><input id="auth-password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} maxLength="72" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} required /></div>
      <button className="button button-red auth-submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create member account' : 'Log in'} <ArrowRight size={16} /></button>
    </form>
    <p className="auth-switch">{isRegister ? 'Already a member?' : 'New to Flex Gym?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p>
    <span className="auth-footnote">MEMBER SIGN-UP ONLY · ADMIN ACCOUNTS ARE CREATED SECURELY BY THE OWNER</span></section><aside className="auth-visual"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85" alt="Gym training area" /><div><span>YOUR NEXT REP</span><h2>Starts<br /><em>here.</em></h2></div></aside></main>;
}
