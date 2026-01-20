import api from '../axios';

export interface PlanNutricional {
  id: number;
  nombre: string;
  descripcion: string;
  nutricionista: string;
  precio: number;
  duracion: string;
  objetivos: string[];
  estado: 'ACTIVO' | 'INACTIVO';
  alumnosInscritos: number;
}

export interface CreatePlanNutricionalData {
  nombre: string;
  descripcion: string;
  nutricionista: string;
  precio: number;
  duracion: string;
  objetivos: string[];
}

export const nutricionService = {
  getPlanesNutricion: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    estado?: string;
  }) => {
    const { data } = await api.get('/planes-nutricion', { params });
    return data;
  },

  getPlanNutricional: async (id: number) => {
    const { data } = await api.get(`/planes-nutricion/${id}`);
    return data;
  },

  createPlanNutricional: async (planData: CreatePlanNutricionalData) => {
    const { data } = await api.post('/planes-nutricion', planData);
    return data;
  },

  updatePlanNutricional: async (id: number, planData: Partial<CreatePlanNutricionalData>) => {
    const { data } = await api.put(`/planes-nutricion/${id}`, planData);
    return data;
  },

  deletePlanNutricional: async (id: number) => {
    const { data } = await api.delete(`/planes-nutricion/${id}`);
    return data;
  },

  getAlumnosInscritos: async (planId: number) => {
    const { data } = await api.get(`/planes-nutricion/${planId}/alumnos`);
    return data;
  },
};
