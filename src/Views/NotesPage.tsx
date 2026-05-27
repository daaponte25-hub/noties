import React from 'react';
import { BookOpen, Award, FileSpreadsheet, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../Models/UserModel';

interface NotesPageProps {
  currentUser: Omit<User, 'password'>;
}

export default function NotesPage({ currentUser }: NotesPageProps) {
  // Mock data for beautiful display
  const coursePerformance = [
    { id: 1, course: 'Matemáticas Avanzadas', docent: 'Sonia Rodríguez', average: 8.7, studentsCount: 24, status: 'Completo' },
    { id: 2, course: 'Ciencias Naturales', docent: 'Pedro Almonte', average: 9.1, studentsCount: 22, status: 'Completo' },
    { id: 3, course: 'Lengua Española', docent: 'Ana Martínez', average: 8.4, studentsCount: 25, status: 'Pendiente' },
    { id: 4, course: 'Historia Universal', docent: 'Juan Carlos', average: 8.9, studentsCount: 20, status: 'Completo' }
  ];

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      {/* Page Header */}
      <header className="h-20 bg-white border-b border-slate-205/70 px-10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notas y Calificaciones</h2>
          <p className="text-slate-500 text-xs font-semibold italic">San José Intermediate School • Panel de Rendimiento Escolar</p>
        </div>
        <div id="notes-badge" className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-750 border border-indigo-150">
          <BookOpen className="h-4 w-4 text-indigo-550" />
          Módulo de Calificaciones
        </div>
      </header>

      {/* Pages Workspace Content */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-slate-50/50">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Promedio Escolar</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">8.8 / 10</h4>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +0.2 este trimestre
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="h-5.5 w-5.5" />
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Boletines Emitidos</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">112</h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium font-semibold">94% de la matrícula total</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileSpreadsheet className="h-5.5 w-5.5" />
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Carga Activa</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">18 Cursos</h4>
              <p className="text-[11px] text-indigo-650 mt-1 font-semibold">Planificación Curricular vigente</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650">
              <BookOpen className="h-5.5 w-5.5" />
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Evaluaciones Pendientes</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">2</h4>
              <p className="text-[11px] text-amber-650 mt-1 font-semibold">Pendiente para cierre docente</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="h-5.5 w-5.5 animate-pulse" />
            </span>
          </div>
        </div>

        {/* Informative Grid Table Mock-up */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 text-left">Resumen General por Cátedras Escolares</h3>
              <p className="text-slate-450 text-[11px] font-medium leading-none mt-1">Comparativo de promedios trimestrales y estado de actas académicas</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Asignatura</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Docente Asignado</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Promedio Grupal</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumnos Matriculados</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de Actas</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {coursePerformance.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.course}</td>
                    <td className="px-6 py-4">{item.docent}</td>
                    <td className="px-6 py-4 font-bold font-mono">{item.average} / 10</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{item.studentsCount} estudiantes</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Completo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${item.status === 'Completo' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phase Warning Info */}
        <div className="p-6 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-amber-900">Módulo Académico en Fase de Desarrollo Futuro</h4>
            <p className="text-xs text-amber-700 leading-relaxed mt-1">
              ¡Hola, <span className="font-bold">{currentUser.fullName}</span>! Te informamos que las funcionalidades de edición, inserción y exportación de calificaciones en PDF están programadas para los siguientes módulos del sistema académico de Noties. Mantén tu sesión iniciada para recibir avisos automáticos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
