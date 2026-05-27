export type UserRole = 'Administrador' | 'Docente' | 'Representante';
export type UserStatus = 'Activo' | 'Inactivo';

export interface User {
  id: string; // Unique identifier (UUID or similar generated string)
  fullName: string; // Nombre completo
  email: string; // Correo electrónico
  password?: string; // Contraseña (optional state in frontend for security, but present)
  role: UserRole; // Rol asignado
  status: UserStatus; // Estado (Activo o inactivo)
  createdAt: string; // Fecha de creación
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
}
