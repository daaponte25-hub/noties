import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './Models/UserModel';
import Login from './Views/Login';
import Dashboard from './Views/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for active administration session on page mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('noties_session_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to parse persistent user session:', err);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (user: Omit<User, 'password'>) => {
    setCurrentUser(user);
    localStorage.setItem('noties_session_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('noties_session_user');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
            Iniciando Noties...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div id="noties-app-root" className="font-sans antialiased bg-zinc-50 min-h-screen selection:bg-orange-55/70 selection:text-orange-950">
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div
            key="login-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Login onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Dashboard currentUser={currentUser} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
