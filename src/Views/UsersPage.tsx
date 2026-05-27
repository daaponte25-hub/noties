import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserCheck,
  BookOpen,
  AlertCircle,
  SlidersHorizontal,
  RefreshCw,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole, UserStatus } from '../Models/UserModel';
import { UserController } from '../Controllers/UserController';
import UserFormModal from './UserFormModal';

interface UsersPageProps {
  currentUser: Omit<User, 'password'>;
}

export default function UsersPage({ currentUser }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Delete Inline Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserController.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'No se pudieron recuperar los usuarios del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateNewClick = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (user: User) => {
    try {
      const fullUser = await UserController.getUser(user.id);
      setUserToEdit(fullUser);
      setIsModalOpen(true);
    } catch (err) {
      setUserToEdit(user);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRequest = (userId: string) => {
    setDeletingId(userId);
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await UserController.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleStatus = async (user: User) => {
    const updatedStatus: UserStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await UserController.updateUser(user.id, { status: updatedStatus });
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, status: updatedStatus } : u))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'Todos' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'Todos' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Derived Statistics
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Activo').length;
  const inactiveCount = users.filter(u => u.status === 'Inactivo').length;

  const roleStats = {
    Administrador: users.filter(u => u.role === 'Administrador').length,
    Docente: users.filter(u => u.role === 'Docente').length,
    Representante: users.filter(u => u.role === 'Representante').length,
  };

  // Visual badges for Role types
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Administrador':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-150">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Admin
          </span>
        );
      case 'Docente':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-150">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            Docente
          </span>
        );
      case 'Representante':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700 border border-pink-150">
            <Users className="h-3.5 w-3.5 shrink-0" />
            Representante
          </span>
        );
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="h-20 bg-white border-b border-slate-205/70 px-10 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gestión de Usuarios</h2>
          <p className="text-slate-500 text-xs font-semibold italic">Noties • Módulo Administrativo</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              id="header-search-bar"
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pl-9 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-slate-800 font-medium transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>

          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Sincronizar base de datos"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            id="register-user-btn"
            onClick={handleCreateNewClick}
            className="bg-indigo-650 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            + Nuevo Usuario
          </button>
        </div>
      </header>

      {/* Inner Content Scroller */}
      <div className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-50/50">
        {/* Global Statistics Cards */}
        <section id="stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Main Count */}
          <div className="flex items-center justify-between p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Usuarios Totales</p>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{totalUsers}</h4>
              <p className="text-[11px] text-slate-500 mt-1 font-medium font-semibold italic">Matrícula y personal escolar</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="h-5.5 w-5.5" />
            </span>
          </div>

          {/* Card 2: Status breakdown */}
          <div className="flex items-center justify-between p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estados Operativos</p>
              <div className="mt-2 flex items-center gap-4">
                <div>
                  <span className="text-lg font-extrabold text-emerald-600 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    {activeCount}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Activos</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-lg font-extrabold text-slate-500 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    {inactiveCount}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Inactivos</span>
                </div>
              </div>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50/50 text-emerald-600">
              <UserCheck className="h-5.5 w-5.5" />
            </span>
          </div>

          {/* Card 3: Role list quick indicators */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Desglose por Roles</p>
            <div className="grid grid-cols-1 gap-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-700 border-b border-dashed border-slate-100 pb-0.5">
                <span className="font-semibold text-slate-500">Administradores</span>
                <span className="font-bold text-slate-900 font-mono">{roleStats.Administrador}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 border-b border-dashed border-slate-100 pb-0.5">
                <span className="font-semibold text-slate-500">Docentes</span>
                <span className="font-bold text-slate-900 font-mono">{roleStats.Docente}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 border-b border-dashed border-slate-100 pb-0.5">
                <span className="font-semibold text-slate-500">Representantes</span>
                <span className="font-bold text-slate-900 font-mono">{roleStats.Representante}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Panel */}
        <div className="grid grid-cols-12 gap-8">
          {/* Table Directory */}
          <section className="col-span-12 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Filters inside Directory */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">
                Filtros de Perfiles
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-400 uppercase tracking-wider text-[9px]">
                  <span>Rol:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-white border border-slate-200 py-1 px-2.5 rounded text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-550 cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Docente">Docente</option>
                    <option value="Representante">Representante</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-400 uppercase tracking-wider text-[9px]">
                  <span>Estado:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-white border border-slate-200 py-1 px-2.5 rounded text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-550 cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Table container */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col justify-center items-center gap-3">
                  <svg className="animate-spin h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-[11px] uppercase font-bold text-slate-450 tracking-widest animate-pulse">Cargando base de datos escolar...</p>
                </div>
              ) : error ? (
                <div className="p-16 flex flex-col items-center justify-center text-center text-red-500 gap-2">
                  <AlertCircle className="h-9 w-9 text-red-500 animate-bounce" />
                  <p className="text-sm font-bold">Error de sincronización</p>
                  <p className="text-xs text-slate-500 max-w-sm font-medium">{error}</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400 gap-2">
                  <AlertCircle className="h-9 w-9 text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No se encontraron registros activos</p>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">Intente suavizar los filtros de búsqueda o registre un nuevo perfil administrativo o docente en el centro.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-150 text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Usuario</th>
                      <th scope="col" className="px-6 py-4">Rol en Centro</th>
                      <th scope="col" className="px-6 py-4">Fecha de Registro</th>
                      <th scope="col" className="px-6 py-4">Estado</th>
                      <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-220">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-slate-900 font-bold">{user.fullName}</p>
                              <p className="text-[11px] text-slate-450 font-medium font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 font-mono text-[11px]">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '—'}
                        </td>
                        <td className="px-6 py-3.5">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={user.id === currentUser.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                              user.id === currentUser.id 
                                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                                : user.status === 'Activo'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150 hover:bg-emerald-100/75'
                                : 'bg-rose-50 text-rose-700 border-rose-150 hover:bg-rose-100/75'
                            }`}
                            title={user.id === currentUser.id ? 'No puede desactivarse a sí mismo' : `Cambiar estado a ${user.status === 'Activo' ? 'Inactivo' : 'Activo'}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {user.status}
                          </button>
                        </td>
                        <td className="px-6 py-3.5 text-right font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/50 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Editar
                            </button>

                            {deletingId === user.id ? (
                              <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 p-1 rounded">
                                <span className="text-[10px] text-red-700 font-bold px-1 animate-pulse">¿Seguro?</span>
                                <button
                                  onClick={() => handleConfirmDelete(user.id)}
                                  className="bg-red-650 hover:bg-red-700 text-white px-2 py-1 rounded text-[10px] font-extrabold transition-colors cursor-pointer animate-none"
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="bg-slate-200 hover:bg-slate-350 text-slate-700 px-2 py-1 rounded text-[10px] font-extrabold transition-colors cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteRequest(user.id)}
                                disabled={user.id === currentUser.id}
                                className={`px-2.5 py-1.5 rounded text-[11px] font-bold transition-all border ${
                                  user.id === currentUser.id 
                                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
                                    : 'bg-red-50 text-red-655 hover:bg-red-100/80 border-red-100 cursor-pointer'
                                }`}
                                title={user.id === currentUser.id ? 'No puede eliminarse a sí mismo' : 'Eliminar de base de datos escolar'}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Form Dialog Modal Overlay */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        onSubmitSuccess={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
          fetchUsers();
        }}
        userToEdit={userToEdit}
      />
    </>
  );
}
