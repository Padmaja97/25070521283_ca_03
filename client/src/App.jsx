import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useGymInfo } from './context/GymInfoContext';
import flexSymbol from './assets/flex-symbol.svg';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import Contact from './pages/Contact';
import Home from './pages/Home';
import MemberDashboard from './pages/MemberDashboard';
import Memberships from './pages/Memberships';
import Trainers from './pages/Trainers';

function Footer() {
  const { settings } = useGymInfo();
  return <footer className="site-footer"><div className="footer-main">
    <a className="wordmark" href="/"><span className="logo-mark"><img src={flexSymbol} alt="" /></span><span>FLEX<span className="wordmark-light">GYM</span><i>.</i></span></a>
    <p>Show up for yourself.<br />The rest is built one day at a time.</p>
    <div><span className="footer-label">FIND US</span><span>{settings.location}</span><span>{settings.openingHours || 'Opening hours are not configured.'}</span>{settings.hoursAreSample && settings.openingHours && <span className="footer-sample">SAMPLE HOURS — PLEASE CONFIRM</span>}</div>
    <div><span className="footer-label">QUICK LINKS</span><a href="/memberships">Memberships</a><a href="/trainers">Trainers</a><a href="/contact">Contact</a></div>
  </div><div className="footer-bottom"><span>FLEX GYM · COLLEGE MINI PROJECT</span><span>Sample content and prices are for demonstration only.</span><span>© {new Date().getFullYear()} FLEX GYM</span></div></footer>;
}

export default function App() {
  return <><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/memberships" element={<Memberships />} />
    <Route path="/trainers" element={<Trainers />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/member" element={<ProtectedRoute role="member"><MemberDashboard /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><Footer /></>;
}
