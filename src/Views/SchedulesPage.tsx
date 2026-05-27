import React from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import { User } from '../Models/UserModel';

interface SchedulesPageProps {
  currentUser: Omit<User, 'password'>;
}

export default function SchedulesPage({ currentUser }: SchedulesPageProps) {
  // Weekly scheduler mock-up
  const weeklyClasses = [
    { id: 1, hour: '08:00 AM - 09:30 AM', subject: 'Matemáticas Avanzadas', teacher: 'Sonia Rodríguez', room: 'Aula B-102', day: 'Lunes' },
    { id: 2, hour: '09:45 AM - 11:15 AM', subject: 'Ciencias Naturales', teacher: 'Pedro Almonte', room: 'Laboratorio de Química', day: 'Lunes' },
    { id: 3, hour: '11:30 AM - 01:00 PM', subject: 'Historia de América', teacher: 'Carlos Gómez', room: 'Aula C-201', day: 'Lunes' },
    { id: 4, hour: '08:00 AM - 09:30 AM', subject: 'Lengua Española', teacher: 'Ana Martínez', room: 'Aula A-104', day: 'Martes' },
    { id: 5, hour: '09:45 AM - 11:15 AM', subject: 'Cultura del Dibujo', teacher: 'Sonia Rodríguez', room: 'Taller de Arte', day: 'Martes' },
  ];

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      {/* Page Header */}
      <header className="h-20 bg-white border-b border-slate-205/70 px-10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Horarios Escolares</h2>
          <p className="text-slate-500 text-xs font-semibold italic">San José Intermediate School • Cronograma y Distribución de Clases</p>
        </div>
        <div id="schedule-badge" className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-750 border border-indigo-150">
          <Calendar className="h-4 w-4 text-indigo-550" />
          Calendario Vigente
        </div>
      </header>

      {/* Pages Workspace Content */}
      <div className="flex-grow p-8 overflow-y-auto space-y-8 bg-slate-50/50">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Período de Clases</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">Lunes a Viernes</h4>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold">Horario institucional regular</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="h-5.5 w-5.5" />
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Horas Cátedra Semanales</p>
              <h4 className="text-2xl font-black text-slate-900 mt-3">35 Horas</h4>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">100% de cobertura asignada</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="h-5.5 w-5.5" />
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Espacios Físicos Activos</p>
              <h4 className="text-2xl font-black text-slate-900 mt-3">12 Aulas / Labs</h4>
              <p className="text-[11px] text-blue-600 mt-1 font-semibold">Optimización de aforo escolar</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="h-5.5 w-5.5" />
            </span>
          </div>
        </div>

        {/* Weekly classes listing */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 text-left">Distribución del Calendario de Clases Semanales</h3>
              <p className="text-slate-450 text-[11px] font-medium leading-none mt-1">Horarios asignados a docentes y locales físicos</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Día</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Bloque de Horas</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Asignatura / Cátedra</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Docente Ponente</th>
                  <th scope="col" className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Físico o Aula</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {weeklyClasses.map((cl) => (
                  <tr key={cl.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-750">{cl.day}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-600">{cl.hour}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{cl.subject}</td>
                    <td className="px-6 py-4">{cl.teacher}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded font-bold text-[11px] text-slate-700">
                        <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                        {cl.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phase warning info */}
        <div className="p-6 bg-slate-100/50 border border-slate-200 text-left rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nota Administrativa</p>
          <p className="text-xs text-slate-650 leading-relaxed font-semibold">
            Estimado docente/representante, la asignación de horarios escolares de Noties para períodos bimestrales especiales o exámenes se halla en fase de planificación del Departamento de Coordinación de Estudios. De requerir cambios de aula, comuníquese con secretaría docente.
          </p>
        </div>
      </div>
    </div>
  );
}
