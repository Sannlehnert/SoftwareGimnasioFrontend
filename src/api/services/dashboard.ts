import api from '../axios';

export const dashboardService = {
  getKpis: async () => {
    const { data } = await api.get('/dashboard/kpis');
    return data;
  },
};