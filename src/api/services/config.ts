import api from '../axios';

export const configService = {
  getConfig: async () => {
    const { data } = await api.get('/config');
    return data;
  },

  updateConfig: async (configData: any) => {
    const { data } = await api.put('/config', configData);
    return data;
  },

  getUsuarios: async () => {
    const { data } = await api.get('/usuarios');
    return data;
  },

  createUsuario: async (usuarioData: any) => {
    const { data } = await api.post('/usuarios', usuarioData);
    return data;
  },

  updateUsuario: async (id: number, usuarioData: any) => {
    const { data } = await api.put(`/usuarios/${id}`, usuarioData);
    return data;
  },
};