import api from '../axios';

export interface AsistenciaRecord {
  id: number;
  alumnoId: number;
  alumno: string;
  clase: string;
  fecha: string;
  hora: string;
  asistio: boolean;
  observaciones: string;
  claseTurnoId: number;
  inscripcionId: number;
}

export interface AsistenciaStats {
  totalRegistros: number;
  presentesHoy: number;
  ausentesHoy: number;
  porcentajeAsistencia: number;
}

export const asistenciaService = {
  // Obtener registros de asistencia
  getAsistencias: async (params?: {
    desde?: string;
    hasta?: string;
    alumnoId?: number;
    claseId?: number;
  }): Promise<AsistenciaRecord[]> => {
    const { data } = await api.get('/asistencias', { params });
    return data;
  },

  // Obtener asistencia de un alumno específico
  getAsistenciaAlumno: async (alumnoId: number, params?: {
    desde?: string;
    hasta?: string;
  }): Promise<AsistenciaRecord[]> => {
    const { data } = await api.get(`/alumnos/${alumnoId}/asistencias`, { params });
    return data;
  },

  // Registrar asistencia individual
  registrarAsistencia: async (inscripcionId: number, asistio: boolean, observaciones?: string) => {
    const { data } = await api.post(`/inscripciones/${inscripcionId}/asistencia`, {
      asistio,
      observaciones
    });
    return data;
  },

  // Registrar asistencia masiva para una clase
  registrarAsistenciaMasiva: async (claseTurnoId: number, registros: {
    inscripcionId: number;
    asistio: boolean;
    observaciones?: string;
  }[]) => {
    const { data } = await api.post(`/turnos/${claseTurnoId}/asistencia-masiva`, { registros });
    return data;
  },

  // Actualizar registro de asistencia
  actualizarAsistencia: async (asistenciaId: number, data: {
    asistio?: boolean;
    observaciones?: string;
  }) => {
    const response = await api.put(`/asistencias/${asistenciaId}`, data);
    return response.data;
  },

  // Obtener estadísticas de asistencia
  getEstadisticas: async (params?: {
    desde?: string;
    hasta?: string;
    claseId?: number;
  }): Promise<AsistenciaStats> => {
    const { data } = await api.get('/asistencias/estadisticas', { params });
    return data;
  },

  // Obtener historial de asistencia de un alumno
  getHistorialAsistencia: async (alumnoId: number): Promise<AsistenciaRecord[]> => {
    const { data } = await api.get(`/alumnos/${alumnoId}/historial-asistencia`);
    return data;
  },

  // Marcar asistencia para una clase completa
  marcarAsistenciaClase: async (claseTurnoId: number, registros: {
    alumnoId: number;
    asistio: boolean;
    observaciones?: string;
  }[]) => {
    const { data } = await api.post(`/turnos/${claseTurnoId}/marcar-asistencia`, { registros });
    return data;
  },
};
