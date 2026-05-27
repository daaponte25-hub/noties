import React from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { User } from '../Models/UserModel';

interface LayoutProps {
  currentUser: Omit<User, 'password'>;
  activeSection: 'usuarios' | 'notas' | 'horarios' | 'config';
  onSectionChange: (section: 'usuarios' | 'notas' | 'horarios' | 'config') => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({
  currentUser,
  activeSection,
  onSectionChange,
  onLogout,
  children
}: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-850 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-indigo-900 flex flex-col shrink-0 shadow-lg justify-between select-none">
        <div className="flex flex-col flex-1">
          {/* Logo Brand */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center border-2 border-indigo-300 shadow-sm">
              <span className="text-white font-bold text-xl font-serif italic">N</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-extrabold tracking-tight">Noties</h1>
              <p className="text-[9px] text-indigo-300 uppercase tracking-widest font-bold leading-none">Edu-Gestor</p>
            </div>
          </div>

          <nav className="mt-4 flex-1 space-y-1">
            <div className="px-6 mb-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              Menú Principal
            </div>

            {/* Active Link - Visible only to Administrators */}
            {currentUser.role === 'Administrador' && (
              <a
                href="#usuarios"
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange('usuarios');
                }}
                className={`flex items-center gap-4 px-8 py-3.5 border-l-4 transition-all ${
                  activeSection === 'usuarios'
                    ? 'bg-indigo-800/50 text-white border-indigo-400 font-semibold shadow-inner'
                    : 'text-indigo-200 hover:bg-indigo-800/30 border-transparent'
                }`}
              >
                <Users className="h-4.5 w-4.5 shrink-0 text-indigo-300" />
                <span className="text-sm font-semibold">Gestión de Usuarios</span>
              </a>
            )}

            <a
              href="#notas"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('notas');
              }}
              className={`flex items-center gap-4 px-8 py-3.5 border-l-4 transition-all ${
                activeSection === 'notas'
                  ? 'bg-indigo-800/50 text-white border-indigo-400 font-semibold shadow-inner'
                  : 'text-indigo-200 hover:bg-indigo-800/30 border-transparent'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5 shrink-0 opacity-60 text-indigo-300" />
              <span className="text-sm">Notas y Calificaciones</span>
            </a>

            <a
              href="#horarios"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('horarios');
              }}
              className={`flex items-center gap-4 px-8 py-3.5 border-l-4 transition-all ${
                activeSection === 'horarios'
                  ? 'bg-indigo-800/50 text-white border-indigo-400 font-semibold shadow-inner'
                  : 'text-indigo-200 hover:bg-indigo-800/30 border-transparent'
              }`}
            >
              <Calendar className="h-4.5 w-4.5 shrink-0 opacity-60 text-indigo-300" />
              <span className="text-sm">Horarios Escolares</span>
            </a>

            <a
              href="#config"
              onClick={(e) => {
                e.preventDefault();
                onSectionChange('config');
              }}
              className={`flex items-center gap-4 px-8 py-3.5 border-l-4 transition-all ${
                activeSection === 'config'
                  ? 'bg-indigo-800/50 text-white border-indigo-400 font-semibold shadow-inner'
                  : 'text-indigo-200 hover:bg-indigo-800/30 border-transparent'
              }`}
            >
              <SlidersHorizontal className="h-4.5 w-4.5 shrink-0 opacity-60 text-indigo-300" />
              <span className="text-sm">Configuración</span>
            </a>
          </nav>
        </div>

        {/* User slot info + Logout */}
        <div className="p-6 bg-indigo-950/20 border-t border-indigo-850/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-indigo-700 border border-indigo-500/80 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="text-white text-xs font-bold truncate leading-tight">{currentUser.fullName}</p>
                <p className="text-indigo-400 text-[10px] font-semibold truncate uppercase tracking-wide">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-indigo-200 hover:bg-indigo-850/80 hover:text-white transition-all cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
