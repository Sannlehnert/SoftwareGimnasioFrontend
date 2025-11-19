import api from '../axios';

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string;
  videoUrl?: string;
  categoria: string;
  musculos: string[];
}

export interface RutinaEjercicio {
  ejercicioId: number;
  ejercicio: Ejercicio;
  series: number;
  repeticiones: number;
  descanso: number; // segundos
  notas?: string;
}

export interface Rutina {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  ejercicios: RutinaEjercicio[];
  activa: boolean;
  creadaPor: string;
}

export interface CreateRutinaData {
  alumnoId: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  ejercicios: Omit<RutinaEjercicio, 'ejercicio'>[];
}

export const rutinasService = {
  getRutinas: async (params?: {
    page?: number;
    limit?: number;
    alumnoId?: number;
    activa?: boolean;
  }) => {
    const { data } = await api.get('/rutinas', { params });
    return data;
  },

  getRutina: async (id: number) => {
    const { data } = await api.get(`/rutinas/${id}`);
    return data;
  },

  createRutina: async (rutinaData: CreateRutinaData) => {
    const { data } = await api.post('/rutinas', rutinaData);
    return data;
  },

  updateRutina: async (id: number, rutinaData: Partial<CreateRutinaData>) => {
    const { data } = await api.put(`/rutinas/${id}`, rutinaData);
    return data;
  },

  deleteRutina: async (id: number) => {
    const { data } = await api.delete(`/rutinas/${id}`);
    return data;
  },

  exportRutinaToPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/rutinas/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getEjercicios: async (categoria?: string) => {
    const { data } = await api.get('/ejercicios', { params: { categoria } });
    return data;
  },
};