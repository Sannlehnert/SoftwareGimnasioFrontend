import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

interface Usuario {
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

interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: 'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA';
  password: string;
}

const Usuarios: React.FC = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<NuevoUsuario>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'ENTRENADOR',
    password: ''
  });

  // Mock query para obtener usuarios
  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      // Simular llamada a API
      return new Promise<Usuario[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              nombre: 'Juan',
              apellido: 'Pérez',
              email: 'juan.perez@gym.com',
              telefono: '+54911234567',
              rol: 'ADMIN',
              activo: true,
              fechaCreacion: '2023-01-15',
              ultimoAcceso: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              nombre: 'María',
              apellido: 'González',
              email: 'maria.gonzalez@gym.com',
              telefono: '+54911234568',
              rol: 'ENTRENADOR',
              activo: true,
              fechaCreacion: '2023-03-20',
              ultimoAcceso: '2024-01-14T15:45:00Z'
            },
            {
              id: 3,
              nombre: 'Carlos',
              apellido: 'Rodríguez',
              email: 'carlos.rodriguez@gym.com',
              rol: 'RECEPCIONISTA',
              activo: false,
              fechaCreacion: '2023-06-10',
              ultimoAcceso: '2023-12-20T09:15:00Z'
            }
          ]);
        }, 500);
      });
    }
  });

  // Mock mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: async (data: NuevoUsuario) => {
      return new Promise<Usuario>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            ...data,
            activo: true,
            fechaCreacion: new Date().toISOString().split('T')[0],
            ultimoAcceso: new Date().toISOString()
          });
        }, 1000);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Usuario creado',
        message: 'El usuario ha sido creado correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setShowModal(false);
      resetForm();
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al crear el usuario',
      });
    }
  });

  // Mock mutation para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Usuario> }) => {
      return new Promise<Usuario>((resolve) => {
        setTimeout(() => {
          resolve({
            ...data,
            id
          } as Usuario);
        }, 1000);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Usuario actualizado',
        message: 'El usuario ha sido actualizado correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setShowModal(false);
      setEditingUser(null);
      resetForm();
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar el usuario',
      });
    }
  });

  // Mock mutation para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Usuario eliminado',
        message: 'El usuario ha sido eliminado correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar el usuario',
      });
    }
  });

  // Mock mutation para cambiar estado activo
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, activo }: { id: number; activo: boolean }) => {
      return new Promise<Usuario>((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            activo
          } as Usuario);
        }, 500);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Estado actualizado',
        message: 'El estado del usuario ha sido actualizado correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar el estado del usuario',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      rol: 'ENTRENADOR',
      password: ''
    });
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (user: Usuario) => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono || '',
      rol: user.rol,
      password: ''
    });
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteMutation.mutate(id);
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ENTRENADOR':
        return 'bg-blue-100 text-blue-800';
      case 'RECEPCIONISTA':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'ENTRENADOR':
        return 'Entrenador';
      case 'RECEPCIONISTA':
        return 'Recepcionista';
      default:
        return rol;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">➕</span>
          Nuevo Usuario
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-lg">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-lg">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios?.filter(u => u.activo).length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-lg">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios?.filter(u => !u.activo).length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-lg">👑</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">{usuarios?.filter(u => u.rol === 'ADMIN').length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Usuarios del Sistema</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                        <div className="text-sm text-gray-500">Creado: {new Date(user.fechaCreacion).toLocaleDateString('es-AR')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.telefono && <div className="text-sm text-gray-500">{user.telefono}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRolColor(user.rol)}`}>
                      {getRolLabel(user.rol)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: user.id, activo: !user.activo })}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.ultimoAcceso ? (
                      <div className="flex items-center">
                        <span className="text-sm mr-1">📅</span>
                        {new Date(user.ultimoAcceso).toLocaleDateString('es-AR')}
                      </div>
                    ) : (
                      'Nunca'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
                  >
                    <option value="ENTRENADOR">Entrenador</option>
                    <option value="RECEPCIONISTA">Recepcionista</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      required={!editingUser}
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {createMutation.isLoading || updateMutation.isLoading
                      ? 'Guardando...'
                      : editingUser
                        ? 'Actualizar'
                        : 'Crear'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
