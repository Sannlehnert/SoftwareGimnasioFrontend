import api from '../axios';

export const informesService = {
  getInformeCobros: async (params: { desde: string; hasta: string }) => {
    const { data } = await api.get('/informes/cobros', { params });
    return data;
  },

  getInformeIngresos: async (params: { desde: string; hasta: string }) => {
    const { data } = await api.get('/informes/ingresos', { params });
    return data;
  },

  getMapaCalor: async (params: { desde: string; hasta: string }) => {
    const { data } = await api.get('/informes/mapa-calor', { params });
    return data;
  },

  getInformeVentas: async (params: { desde: string; hasta: string }) => {
    const { data } = await api.get('/informes/ventas', { params });
    return data;
  },

  generarReportePdf: async (data: { tipo: string; desde: string; hasta: string }) => {
    const response = await api.post('/informes/generar-pdf', data, {
      responseType: 'blob',
    });
    return response.data;
  },
};