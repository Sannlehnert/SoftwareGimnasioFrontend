import api from '../axios';

export interface Medida {
  id: number;
  alumnoId: number;
  fecha: string;
  peso: number;
  altura: number;
  imc: number;
  grasaCorporal: number;
  masaMuscular: number;
  observaciones: string;
}

export interface CreateMedidaData {
  alumnoId: number;
  fecha: string;
  peso: number;
  altura: number;
  grasaCorporal?: number;
  masaMuscular?: number;
  observaciones?: string;
}

export const medidasService = {
  getMedidas: async (params?: {
    page?: number;
    limit?: number;
    alumnoId?: number;
  }) => {
    const { data } = await api.get('/medidas', { params });
    return data;
  },

  getMedida: async (id: number) => {
    const { data } = await api.get(`/medidas/${id}`);
    return data;
  },

  createMedida: async (medidaData: CreateMedidaData) => {
    const { data } = await api.post('/medidas', medidaData);
    return data;
  },

  updateMedida: async (id: number, medidaData: Partial<CreateMedidaData>) => {
    const { data } = await api.put(`/medidas/${id}`, medidaData);
    return data;
  },

  deleteMedida: async (id: number) => {
    const { data } = await api.delete(`/medidas/${id}`);
    return data;
  },

  getMedidasAlumno: async (alumnoId: number) => {
    const { data } = await api.get(`/alumnos/${alumnoId}/medidas`);
    return data;
  },
};
