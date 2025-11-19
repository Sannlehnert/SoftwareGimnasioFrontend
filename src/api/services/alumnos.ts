import api from '../axios';

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  planId: number;
  plan: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO';
  notas: string;
}

export interface CreateAlumnoData {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  planId: number;
  fechaIngreso: string;
  notas?: string;
}

export const alumnosService = {
  getAlumnos: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    estado?: string;
    plan?: string;
  }) => {
    const { data } = await api.get('/alumnos', { params });
    return data;
  },

  getAlumno: async (id: number) => {
    const { data } = await api.get(`/alumnos/${id}`);
    return data;
  },

  createAlumno: async (alumnoData: CreateAlumnoData) => {
    const { data } = await api.post('/alumnos', alumnoData);
    return data;
  },

  updateAlumno: async (id: number, alumnoData: Partial<CreateAlumnoData>) => {
    const { data } = await api.put(`/alumnos/${id}`, alumnoData);
    return data;
  },

  deleteAlumno: async (id: number) => {
    const { data } = await api.delete(`/alumnos/${id}`);
    return data;
  },

  getCuentaCorriente: async (alumnoId: number) => {
    const { data } = await api.get(`/alumnos/${alumnoId}/cuenta-corriente`);
    return data;
  },

  getAsistencias: async (alumnoId: number, params?: { desde?: string; hasta?: string }) => {
    const { data } = await api.get(`/alumnos/${alumnoId}/asistencias`, { params });
    return data;
  },

  getRutinas: async (alumnoId: number) => {
    const { data } = await api.get(`/alumnos/${alumnoId}/rutinas`);
    return data;
  },
};