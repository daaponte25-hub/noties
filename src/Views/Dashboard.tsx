import React, { useState } from 'react';
import { Shield, BookOpen, Users, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../Models/UserModel';
import Layout from '../Components/Layout';
import UsersPage from './UsersPage';
import NotesPage from './NotesPage';
import SchedulesPage from './SchedulesPage';
import ConfigPage from './ConfigPage';

interface DashboardProps {
  currentUser: Omit<User, 'password'>;
  onLogout: () => void;
}

type SectionType = 'usuarios' | 'notas' | 'horarios' | 'config';

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  // Determine default section based on role
  const [activeSection, setActiveSection] = useState<SectionType>(() => {
    return currentUser.role === 'Administrador' ? 'usuarios' : 'notas';
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        if (currentUser.role !== 'Administrador') {
          return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-center select-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-655 rounded-2xl flex items-center justify-center border-2 border-red-200 shadow-md shadow-red-900/10 mb-6">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Acceso No Disponible</h2>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">Módulo de Usuarios</p>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Lo sentimos, <span className="font-bold text-slate-800">{currentUser.fullName}</span>. Esta opción no se encuentra disponible para su rol ({currentUser.role}). La Gestión de Usuarios y Roles es de acceso exclusivo para Administradores.
                </p>

                <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 flex flex-col gap-1.5 justify-center items-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Su Rol Actual</p>
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-750 border border-indigo-150">
                    {currentUser.role === 'Docente' ? <BookOpen className="h-3.5 w-3.5 text-indigo-700" /> : <Users className="h-3.5 w-3.5 text-indigo-700" />}
                    {currentUser.role}
                  </div>
                  <p className="text-[10px] text-slate-450 font-medium italic mt-1 font-semibold">Nivel escolar sin privilegios administrativos</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={onLogout}
                    className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-950/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión Activa
                  </button>
                </div>
              </motion.div>
            </div>
          );
        }
        return <UsersPage currentUser={currentUser} />;
      
      case 'notas':
        return <NotesPage currentUser={currentUser} />;
      
      case 'horarios':
        return <SchedulesPage currentUser={currentUser} />;
      
      case 'config':
        return <ConfigPage currentUser={currentUser} />;
      
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-semibold">
            Ruta no identificada
          </div>
        );
    }
  };

  return (
    <Layout
      currentUser={currentUser}
      activeSection={activeSection}
      onSectionChange={(sec) => setActiveSection(sec)}
      onLogout={onLogout}
    >
      {renderContent()}
    </Layout>
  );
}
