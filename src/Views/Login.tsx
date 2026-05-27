import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../Models/UserModel';
import { UserController } from '../Controllers/UserController';

interface LoginProps {
  onLoginSuccess: (user: Omit<User, 'password'>) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await UserController.login(email, password);

      if (!data.success) {
        setError(data.message || 'Error al iniciar sesión.');
      } else if (data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(`Error al iniciar sesión: ${err.message || err}. Por favor verifique los detalles en la consola.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (mEmail: string, mPass: string) => {
    setEmail(mEmail);
    setPassword(mPass);
    setError(null);
  };

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
      >
        <div id="login-header" className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-indigo-900 rounded-xl flex items-center justify-center border-2 border-indigo-400 shadow-md shadow-indigo-900/20">
              <span className="text-white font-black text-2.5xl font-serif italic">N</span>
            </div>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Ingreso a <span className="text-indigo-950 font-serif italic">Noties</span>
          </h2>
          <p className="mt-1.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Escuela Intermedia • Módulo de Gestión
          </p>
        </div>

        <form id="login-form" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2.5 p-3.5 rounded-lg bg-red-50 text-red-600 border border-red-100 text-xs font-semibold"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium transition-colors"
                  placeholder="ejemplo@noties.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-900 hover:bg-indigo-800 px-4 py-3 text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 shadow-md shadow-indigo-950/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando Sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>

        <div id="demo-credentials" className="mt-6 border-t border-slate-100 pt-6">
          <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
            Credenciales de Prueba (Clic p/rellenar)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('admin@noties.com', 'admin')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/10 text-left transition-all cursor-pointer"
            >
              <span className="font-bold text-slate-800">Admin</span>
              <span className="text-slate-500 font-mono text-[10px] truncate w-full">admin@noties.com</span>
              <span className="text-slate-400 font-semibold text-[9px]">Clave: admin</span>
            </button>
            <button
              onClick={() => handleQuickLogin('sonia.rodriguez@noties.edu', 'sonia')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/10 text-left transition-all cursor-pointer"
            >
              <span className="font-bold text-slate-800">Docente</span>
              <span className="text-slate-500 font-mono text-[10px] truncate w-full">sonia.rodriguez@noties.edu</span>
              <span className="text-slate-400 font-semibold text-[9px]">Clave: sonia</span>
            </button>
            <button
              onClick={() => handleQuickLogin('carlos.gomez@noties.edu', 'carlos')}
              className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/10 text-left transition-all cursor-pointer"
            >
              <span className="font-bold text-slate-800">Representante</span>
              <span className="text-slate-500 font-mono text-[10px] truncate w-full">carlos.gomez@noties.edu</span>
              <span className="text-slate-400 font-semibold text-[9px]">Clave: carlos</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
