export interface Materia {
	id: number; // Identificador único de la materia
	nombre: string; // Nombre de la materia
	profesor: string; // Profesor asignado
}

export interface MateriaCreateInput {
	nombre: string;
	profesor: string;
}

export interface MateriaUpdateInput {
	nombre?: string;
	profesor?: string;
}

export interface MateriaResponse {
	success: boolean;
	message: string;
	materia?: Materia;
	materias?: Materia[];
}

export interface MateriaState {
	materias: Materia[];
	selectedMateria: Materia | null;
	loading: boolean;
	error: string | null;
}
