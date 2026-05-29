export interface Materia {
  id: number;
  nombre: string;
  profesor: string;
}

export class MateriaController {
  /** Obtiene todas las materias */
  static async getMaterias(): Promise<Materia[]> {
    const res = await fetch('/api/materias');
    if (!res.ok) throw new Error('Error al obtener las materias.');
    return res.json();
  }

  /** Obtiene una materia por id */
  static async getMateria(id: number): Promise<Materia> {
    const res = await fetch(`/api/materias/${id}`);
    if (!res.ok) throw new Error('No se pudo recuperar la materia.');
    return res.json();
  }

  /** Crea una nueva materia */
  static async createMateria(data: Omit<Materia, 'id'>): Promise<Materia> {
    const res = await fetch('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear la materia.');
    }
    return res.json();
  }

  /** Actualiza una materia existente */
  static async updateMateria(id: number, data: Partial<Materia>): Promise<Materia> {
    const res = await fetch(`/api/materias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar la materia.');
    }
    return res.json();
  }

  /** Elimina una materia */
  static async deleteMateria(id: number): Promise<void> {
    const res = await fetch(`/api/materias/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('No se pudo eliminar la materia.');
  }
}
