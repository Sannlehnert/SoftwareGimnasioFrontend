import api from '../axios';

export interface EstadoCaja {
  abierta: boolean;
  montoInicial?: number;
  totalIngresos: number;
  totalEgresos: number;
  totalCaja: number;
  totalEfectivo: number;
  totalTarjetas: number;
  totalTransferencias: number;
  fechaApertura?: string;
  usuarioApertura?: string;
}

export interface MovimientoCaja {
  id: number;
  tipo: 'INGRESO' | 'EGRESO';
  monto: number;
  descripcion: string;
  fecha: string;
  usuarioNombre: string;
  metodoPago?: string;
}

export const cajaService = {
  getEstadoCaja: async (): Promise<EstadoCaja> => {
    const { data } = await api.get('/caja/estado');
    return data;
  },

  getMovimientos: async (params?: { fecha?: string }) => {
    const { data } = await api.get('/caja/movimientos', { params });
    return data;
  },

  abrirCaja: async (data: { montoInicial: number; notas?: string }) => {
    const response = await api.post('/caja/abrir', data);
    return response.data;
  },

  cerrarCaja: async () => {
    const { data } = await api.post('/caja/cerrar');
    return data;
  },

  registrarMovimiento: async (data: {
    tipo: 'INGRESO' | 'EGRESO';
    monto: number;
    descripcion: string;
    metodoPago?: string;
  }) => {
    const response = await api.post('/caja/movimientos', data);
    return response.data;
  },
};