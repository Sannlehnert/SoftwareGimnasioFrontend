import api from '../axios';

export interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  duracion: number; // minutos
  color: string;
  activo: boolean;
  instructores: string[];
  precio?: number;
  dias?: string[];
  horario?: string;
  estado?: string;
  nivel?: string;
  requisitos?: string;
  equipo?: string[];
}

export interface ClaseTurno {
  id: number;
  claseId: number;
  claseNombre: string;
  fechaHora: string;
  sala: string;
  cupo: number;
  inscritos: number;
  instructor: string;
  estado: 'ACTIVO' | 'CANCELADO' | 'COMPLETO';
}

export interface Inscripcion {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  claseTurnoId: number;
  fechaInscripcion: string;
  estado: 'CONFIRMADO' | 'CANCELADO' | 'ASISTIO' | 'AUSENTE';
}

export const turnosService = {
  // Clases
  getClases: async (): Promise<Clase[]> => {
    const { data } = await api.get('/clases');
    return data;
  },

  createClase: async (claseData: Omit<Clase, 'id'>) => {
    const { data } = await api.post('/clases', claseData);
    return data;
  },

  updateClase: async (id: number, claseData: Partial<Clase>) => {
    const { data } = await api.put(`/clases/${id}`, claseData);
    return data;
  },

  // Turnos
  getTurnos: async (params?: {
    desde?: string;
    hasta?: string;
    claseId?: number;
  }) => {
    const { data } = await api.get('/turnos', { params });
    return data;
  },

  createTurno: async (turnoData: Omit<ClaseTurno, 'id' | 'inscritos'>) => {
    const { data } = await api.post('/turnos', turnoData);
    return data;
  },

  updateTurno: async (id: number, turnoData: Partial<ClaseTurno>) => {
    const { data } = await api.put(`/turnos/${id}`, turnoData);
    return data;
  },

  deleteTurno: async (id: number) => {
    const { data } = await api.delete(`/turnos/${id}`);
    return data;
  },

  // Inscripciones
  getInscripciones: async (turnoId: number) => {
    const { data } = await api.get(`/turnos/${turnoId}/inscripciones`);
    return data;
  },

  inscribirAlumno: async (turnoId: number, alumnoId: number) => {
    const { data } = await api.post(`/turnos/${turnoId}/inscribir`, { alumnoId });
    return data;
  },

  cancelarInscripcion: async (inscripcionId: number) => {
    const { data } = await api.delete(`/inscripciones/${inscripcionId}`);
    return data;
  },

  registrarAsistencia: async (inscripcionId: number, asistio: boolean) => {
    const { data } = await api.post(`/inscripciones/${inscripcionId}/asistencia`, { asistio });
    return data;
  },

  // Para alumnos
  getMisTurnos: async () => {
    const { data } = await api.get('/mis-turnos');
    return data;
  },

  getClasesDisponibles: async () => {
    const { data } = await api.get('/clases-disponibles');
    return data;
  },
};