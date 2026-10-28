import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('flexgym_token');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('flexgym_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('flexgym_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const { data } = await api.post(`/auth/${endpoint}`, credentials);
    localStorage.setItem('flexgym_token', data.token);
    setUser(data.user);
    return data.user;
  }, []);
  const login = useCallback((credentials) => authenticate('login', credentials), [authenticate]);
  const register = useCallback((credentials) => authenticate('register', credentials), [authenticate]);
  const value = useMemo(() => ({ user, setUser, loading, login, register, logout }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
