import api from '../axios';

export interface PersonalizacionConfig {
  id?: number;
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  tipografia: {
    fuentePrincipal: string;
    fuenteSecundaria: string;
    tamanoBase: number;
  };
  layout: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'auto';
    borderRadius: number;
    spacing: number;
  };
  componentes: {
    mostrarLogos: boolean;
    mostrarIconos: boolean;
    animaciones: boolean;
    transiciones: boolean;
  };
}

export const personalizacionService = {
  // Obtener configuración de personalización
  getConfiguracionPersonalizacion: async (): Promise<PersonalizacionConfig> => {
    const response = await api.get('/personalizacion/config');
    return response.data;
  },

  // Actualizar configuración de personalización
  actualizarConfiguracionPersonalizacion: async (data: PersonalizacionConfig): Promise<PersonalizacionConfig> => {
    const response = await api.put('/personalizacion/config', data);
    return response.data;
  },

  // Restaurar configuración predeterminada
  restaurarConfiguracionPredeterminada: async (): Promise<PersonalizacionConfig> => {
    const response = await api.post('/personalizacion/config/reset');
    return response.data;
  },

  // Obtener configuración por defecto
  getConfiguracionPredeterminada: async (): Promise<PersonalizacionConfig> => {
    const response = await api.get('/personalizacion/config/default');
    return response.data;
  }
};
