import api from '../axios';

export interface Pago {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  monto: number;
  metodo: 'EFECTIVO' | 'TRANSFERENCIA';
  fecha: string;
  concepto: string;
  reciboUrl?: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface CreatePagoData {
  alumnoId: number;
  monto: number;
  metodo: string;
  concepto: string;
  notas?: string;
}

export const pagosService = {
  getPagos: async (params?: {
    page?: number;
    limit?: number;
    desde?: string;
    hasta?: string;
    alumnoId?: number;
  }) => {
    const { data } = await api.get('/pagos', { params });
    return data;
  },

  createPago: async (pagoData: CreatePagoData) => {
    const { data } = await api.post('/pagos', pagoData);
    return data;
  },

  getRecibo: async (pagoId: number) => {
    const { data } = await api.get(`/pagos/${pagoId}/recibo`, {
      responseType: 'blob',
    });
    return data;
  },

  anularPago: async (pagoId: number, motivo: string) => {
    const { data } = await api.post(`/pagos/${pagoId}/anular`, { motivo });
    return data;
  },
};