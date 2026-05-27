import { User, AuthResponse, UserStatus } from '../Models/UserModel';

export class UserController {
  /**
   * Procesa la autenticación del usuario mediante correo y contraseña.
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  /**
   * Obtiene la nómina de usuarios registrados.
   */
  static async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Error al conectar con la base de datos de usuarios.');
    }
    return response.json();
  }

  /**
   * Obtiene el perfil de un usuario por su identificador.
   */
  static async getUser(userId: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('No se pudo recuperar el usuario del servidor.');
    }
    return response.json();
  }

  /**
   * Registra un nuevo usuario en la base de datos central.
   */
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al guardar el usuario.');
    }
    return response.json();
  }

  /**
   * Actualiza la información de un usuario existente.
   */
  static async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Error al actualizar el usuario.');
    }
    return response.json();
  }

  /**
   * Elimina un usuario por completo de la base de datos central.
   */
  static async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('No se pudo eliminar el usuario.');
    }
  }
}
