import api from '../axios';

export interface GeneralSettings {
  id?: number;
  nombreGimnasio: string;
  direccion: string;
  telefono: string;
  email: string;
  cuit: string;
  ivaResponsable: boolean;
  logoUrl?: string;
  sitioWeb?: string;
  redesSociales: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  horarioAtencion: {
    lunes: { apertura: string; cierre: string };
    martes: { apertura: string; cierre: string };
    miercoles: { apertura: string; cierre: string };
    jueves: { apertura: string; cierre: string };
    viernes: { apertura: string; cierre: string };
    sabado: { apertura: string; cierre: string };
    domingo: { apertura: string; cierre: string };
  };
  configuracionPago: {
    cuotaMensual: number;
    descuentoPagoAdelantado: number;
    diasGracia: number;
    penalizacionMora: number;
  };
}

export const generalesService = {
  getSettings: async (): Promise<GeneralSettings> => {
    const { data } = await api.get('/generales');
    return data;
  },

  updateSettings: async (settings: Partial<GeneralSettings>) => {
    const { data } = await api.put('/generales', settings);
    return data;
  },

  getSystemInfo: async () => {
    const { data } = await api.get('/generales/system-info');
    return data;
  },

  backupDatabase: async () => {
    const { data } = await api.post('/generales/backup');
    return data;
  },

  restoreDatabase: async (backupFile: File) => {
    const formData = new FormData();
    formData.append('backup', backupFile);
    const { data } = await api.post('/generales/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
