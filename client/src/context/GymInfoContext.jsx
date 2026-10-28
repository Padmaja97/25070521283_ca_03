import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const GymInfoContext = createContext(null);

export function GymInfoProvider({ children }) {
  const [settings, setSettings] = useState({ location: 'Gorewada Road, Nagpur, Maharashtra', openingHours: '', hoursAreSample: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refreshSettings = useCallback(async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data.settings);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Gym information is not available right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshSettings(); }, [refreshSettings]);
  const value = useMemo(() => ({ settings, setSettings, loading, error, refreshSettings }), [settings, loading, error, refreshSettings]);
  return <GymInfoContext.Provider value={value}>{children}</GymInfoContext.Provider>;
}

export function useGymInfo() {
  const context = useContext(GymInfoContext);
  if (!context) throw new Error('useGymInfo must be used inside GymInfoProvider.');
  return context;
}
