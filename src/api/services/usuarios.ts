import api from '../axios';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: 'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA';
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
  avatar?: string;
}

export interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: 'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA';
  password: string;
}

export interface UsuarioUpdate {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  rol?: 'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA';
  activo?: boolean;
}

export const usuariosService = {
  // Obtener todos los usuarios
  getUsuarios: async (): Promise<Usuario[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  getUsuarioById: async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  crearUsuario: async (data: NuevoUsuario): Promise<Usuario> => {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  // Actualizar usuario
  actualizarUsuario: async (id: number, data: UsuarioUpdate): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  // Eliminar usuario
  eliminarUsuario: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  // Cambiar estado activo/inactivo
  cambiarEstadoUsuario: async (id: number, activo: boolean): Promise<Usuario> => {
    const response = await api.patch(`/usuarios/${id}/estado`, { activo });
    return response.data;
  },

  // Cambiar contraseña
  cambiarPassword: async (id: number, password: string): Promise<void> => {
    await api.patch(`/usuarios/${id}/password`, { password });
  },

  // Obtener usuarios por rol
  getUsuariosPorRol: async (rol: string): Promise<Usuario[]> => {
    const response = await api.get(`/usuarios?rol=${rol}`);
    return response.data;
  },

  // Obtener estadísticas de usuarios
  getEstadisticasUsuarios: async () => {
    const response = await api.get('/usuarios/estadisticas');
    return response.data;
  }
};
