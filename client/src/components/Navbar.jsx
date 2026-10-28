import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import flexSymbol from '../assets/flex-symbol.svg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dashboard = user?.role === 'admin' ? '/admin' : '/member';
  const close = () => setOpen(false);

  function signOut() {
    logout();
    close();
    navigate('/');
  }

  return <header className="site-header">
    <div className="nav-wrap">
      <Link to="/" className="wordmark" onClick={close}><span className="logo-mark"><img src={flexSymbol} alt="" /></span><span>FLEX<span className="wordmark-light">GYM</span><i>.</i></span></Link>
      <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav className={`main-nav ${open ? 'nav-open' : ''}`}>
        <NavLink to="/about" onClick={close}>About</NavLink>
        <NavLink to="/memberships" onClick={close}>Memberships</NavLink>
        <NavLink to="/trainers" onClick={close}>Trainers</NavLink>
        <NavLink to="/contact" onClick={close}>Contact</NavLink>
        {user ? <>
          <Link className="nav-dashboard" to={dashboard} onClick={close}>{user.role === 'admin' ? 'Admin' : 'My account'} <ArrowUpRight size={14} /></Link>
          <button className="nav-login" onClick={signOut}>Log out</button>
        </> : <>
          <Link className="nav-login" to="/login" onClick={close}>Log in</Link>
          <Link className="button button-red nav-join" to="/register" onClick={close}>Join now <ArrowUpRight size={15} /></Link>
        </>}
      </nav>
    </div>
  </header>;
}
