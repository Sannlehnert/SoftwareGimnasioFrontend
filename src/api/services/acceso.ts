import api from '../axios';

export interface AccesoResponse {
  success: boolean;
  tipo?: 'ENTRADA' | 'SALIDA';
  mensaje: string;
  alumno?: {
    id: number;
    nombre: string;
    apellido: string;
    plan: string;
    vencimiento: string;
  };
  codigo?: 'CUOTA_VENCIDA' | 'SUSPENDIDO' | 'NO_REGISTRADO' | 'ACCESO_BLOQUEADO';
}

export interface Asistencia {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  fechaHora: string;
  tipo: 'ENTRADA' | 'SALIDA';
  origen: 'WEB' | 'APP' | 'TECLADO';
  deviceInfo?: string;
}

export const accesoService = {
  registrarAcceso: async (dni: string, deviceId?: string): Promise<AccesoResponse> => {
    const { data } = await api.post('/acceso', { dni, deviceId });
    return data;
  },

  getAsistenciasHoy: async (): Promise<Asistencia[]> => {
    const { data } = await api.get('/acceso/hoy');
    return data;
  },

  getAsistencias: async (params?: {
    desde?: string;
    hasta?: string;
    alumnoId?: number;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get('/acceso/asistencias', { params });
    return data;
  },

  getEstadisticasAcceso: async (params?: { desde?: string; hasta?: string }) => {
    const { data } = await api.get('/acceso/estadisticas', { params });
    return data;
  },

  getAccesosRecientes: async (limit: number = 10) => {
    const { data } = await api.get('/acceso/recientes', { params: { limit } });
    return data;
  },
};