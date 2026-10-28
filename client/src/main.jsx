import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GymInfoProvider } from './context/GymInfoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GymInfoProvider>
        <AuthProvider><App /></AuthProvider>
      </GymInfoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
