import React, { useState, useEffect } from 'react';
import { X, UserPlus, FileEdit, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { User, UserRole, UserStatus } from '../Models/UserModel';
import { UserController } from '../Controllers/UserController';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  userToEdit?: User | null; // If provided, we are in Edit mode
}

const ROLES: UserRole[] = ['Administrador', 'Docente', 'Representante'];

export default function UserFormModal({ isOpen, onClose, onSubmitSuccess, userToEdit }: UserFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Docente');
  const [status, setStatus] = useState<UserStatus>('Activo');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName);
      setEmail(userToEdit.email);
      setPassword(''); // Keep blank unless updating
      setRole(userToEdit.role);
      setStatus(userToEdit.status);
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('Docente');
      setStatus('Activo');
    }
    setError(null);
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || ( !userToEdit && !password )) {
      setError('Por favor complete todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password || undefined, // Send if entered
      role,
      status
    };

    try {
      if (userToEdit) {
        await UserController.updateUser(userToEdit.id, payload);
      } else {
        await UserController.createUser(payload);
      }

      onSubmitSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error de conexión con la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="modal-container" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5 text-slate-900">
            {userToEdit ? (
              <>
                <FileEdit className="h-5 w-5 text-indigo-900" />
                <h3 className="text-lg font-bold">Modificar Usuario</h3>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-indigo-900" />
                <h3 className="text-lg font-bold">Crear Nuevo Usuario</h3>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-750 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 text-red-650 border border-red-200 text-xs font-semibold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan de la Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                required
                placeholder="ejemplo@noties.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Contraseña {userToEdit ? '' : '*'}
                </label>
                {userToEdit && (
                  <span className="text-[10px] text-slate-400 font-medium font-sans">Dejar vacío para mantener actual</span>
                )}
              </div>
              <input
                type="text"
                placeholder={userToEdit ? "•••••••• (Ingresar nueva si se desea cambiar)" : "Mínimo 4 caracteres"}
                required={userToEdit ? false : true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Rol Asignado
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Select/Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Estado
                </label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setStatus('Activo')}
                    className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                      status === 'Activo'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Activo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Inactivo')}
                    className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                      status === 'Inactivo'
                        ? 'bg-white text-red-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Inactivo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="submit-user-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-805 text-white px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-950/20 disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{userToEdit ? 'Guardar Cambios' : 'Registrar'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
