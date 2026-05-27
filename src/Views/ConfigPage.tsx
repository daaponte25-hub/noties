import React, { useState } from 'react';
import { SlidersHorizontal, Settings2, ShieldCheck, Database, CalendarDays, Key, Server } from 'lucide-react';
import { User } from '../Models/UserModel';

interface ConfigPageProps {
  currentUser: Omit<User, 'password'>;
}

export default function ConfigPage({ currentUser }: ConfigPageProps) {
  const [academicTerm, setAcademicTerm] = useState('Trimestre 1');
  const [allowPublicRegistrations, setAllowPublicRegistrations] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      {/* Page Header */}
      <header className="h-20 bg-white border-b border-slate-205/70 px-10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configuración del Sistema</h2>
          <p className="text-slate-500 text-xs font-semibold italic">San José Intermediate School • Variables Escolares y Servidores</p>
        </div>
        <div id="config-badge" className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-750 border border-indigo-150">
          <Settings2 className="h-4 w-4 text-indigo-550" />
          Ajustes Escolares
        </div>
      </header>

      {/* Pages Workspace Content */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-slate-50/50">
        <div className="grid grid-cols-12 gap-8">
          {/* Left panel: Institution Settings & Profile */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {/* Institution Stats Cards */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Settings2 className="h-4.5 w-4.5 text-indigo-550" />
                Ajustes de Institución
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">Nombre del Centro Escolar</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="Noties" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 outline-none font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">Año Académico en Curso</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="2025 - 2026" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-705 outline-none font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">Período Académico Vigente</label>
                  <select
                    value={academicTerm}
                    onChange={(e) => setAcademicTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-750 outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Trimestre 1">Trimestre 1 (Actual)</option>
                    <option value="Trimestre 2">Trimestre 2</option>
                    <option value="Trimestre 3">Trimestre 3</option>
                    <option value="Evaluaciones Finales">Evaluaciones Finales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1.5">Soporte Técnico de Noties</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="soporte@noties.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-500 outline-none font-mono" 
                  />
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-550" />
                Mi Cuenta & Perfil
              </h3>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 bg-indigo-600 rounded-full text-white font-extrabold text-lg flex items-center justify-center border border-indigo-455">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{currentUser.fullName}</h4>
                  <p className="text-[11px] text-indigo-650 font-bold uppercase tracking-wider">{currentUser.role}</p>
                  <p className="text-[11px] text-slate-500 font-medium font-mono">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">ID Único de Perfil</label>
                  <p className="p-2.5 bg-slate-100 rounded-lg text-slate-500 font-mono text-[11px] truncate">{currentUser.id}</p>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-1">Privilegios y Permisos</label>
                  <p className="p-2.5 bg-slate-100 rounded-lg text-slate-700 font-medium truncate">
                    {currentUser.role === 'Administrador' ? 'Lectura, Escritura y Gestión Completa' : 'Visualización Limitada Académica'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Database Stats, Toggle Settings */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-indigo-550" />
                Variables de Base de Datos
              </h3>

              <div className="flex flex-col gap-3 font-semibold text-xs text-slate-700">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Motor de Base de Datos</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold">Flat-file JSON Database</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Ruta de Base de Datos</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold">data/users.json</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Puerto Activo</span>
                  <span className="font-mono text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">Port 3000</span>
                </div>
              </div>
            </div>

            {/* General Toggles */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Server className="h-4.5 w-4.5 text-indigo-550" />
                Políticas de Seguridad & Red
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-slate-900 font-bold">Permitir Registro de Profesores</p>
                    <p className="text-slate-450 text-[10px] font-medium">Docentes pueden auto-crearse perfil en el login</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowPublicRegistrations}
                    onChange={(e) => setAllowPublicRegistrations(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-slate-900 font-bold">Modo de Mantenimiento</p>
                    <p className="text-slate-450 text-[10px] font-medium">Bloquear accesos no administrativos temporalmente</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informational credit */}
        <div className="text-center text-slate-450 font-semibold text-[10px] uppercase tracking-widest leading-none pt-4">
          Noties Educational Cloud Platform © 2026 • Todos los Derechos Reservados
        </div>
      </div>
    </div>
  );
}
