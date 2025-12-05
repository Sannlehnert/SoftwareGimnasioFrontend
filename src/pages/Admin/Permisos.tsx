import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
  modulo: string;
}

interface RolPermiso {
  rol: 'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA';
  permisos: number[];
}

const Permisos: React.FC = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRol, setSelectedRol] = useState<'ADMIN' | 'ENTRENADOR' | 'RECEPCIONISTA'>('ADMIN');

  // Mock query para obtener permisos
  const { data: permisos, isLoading: loadingPermisos } = useQuery({
    queryKey: ['permisos'],
    queryFn: async () => {
      return new Promise<Permiso[]>((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, nombre: 'Ver Alumnos', descripcion: 'Puede ver la lista de alumnos', modulo: 'Alumnos' },
            { id: 2, nombre: 'Crear Alumno', descripcion: 'Puede crear nuevos alumnos', modulo: 'Alumnos' },
            { id: 3, nombre: 'Editar Alumno', descripcion: 'Puede editar información de alumnos', modulo: 'Alumnos' },
            { id: 4, nombre: 'Eliminar Alumno', descripcion: 'Puede eliminar alumnos', modulo: 'Alumnos' },
            { id: 5, nombre: 'Ver Pagos', descripcion: 'Puede ver pagos realizados', modulo: 'Pagos' },
            { id: 6, nombre: 'Crear Pago', descripcion: 'Puede registrar nuevos pagos', modulo: 'Pagos' },
            { id: 7, nombre: 'Ver Rutinas', descripcion: 'Puede ver rutinas de ejercicios', modulo: 'Rutinas' },
            { id: 8, nombre: 'Crear Rutina', descripcion: 'Puede crear nuevas rutinas', modulo: 'Rutinas' },
            { id: 9, nombre: 'Editar Rutina', descripcion: 'Puede modificar rutinas existentes', modulo: 'Rutinas' },
            { id: 10, nombre: 'Ver Turnos', descripcion: 'Puede ver turnos programados', modulo: 'Turnos' },
            { id: 11, nombre: 'Crear Turno', descripcion: 'Puede crear nuevos turnos', modulo: 'Turnos' },
            { id: 12, nombre: 'Editar Turno', descripcion: 'Puede modificar turnos existentes', modulo: 'Turnos' },
            { id: 13, nombre: 'Ver Caja', descripcion: 'Puede ver movimientos de caja', modulo: 'Caja' },
            { id: 14, nombre: 'Abrir Caja', descripcion: 'Puede abrir la caja diaria', modulo: 'Caja' },
            { id: 15, nombre: 'Cerrar Caja', descripcion: 'Puede cerrar la caja diaria', modulo: 'Caja' },
            { id: 16, nombre: 'Ver Informes', descripcion: 'Puede ver informes del sistema', modulo: 'Informes' },
            { id: 17, nombre: 'Ver Usuarios', descripcion: 'Puede ver lista de usuarios', modulo: 'Usuarios' },
            { id: 18, nombre: 'Crear Usuario', descripcion: 'Puede crear nuevos usuarios', modulo: 'Usuarios' },
            { id: 19, nombre: 'Editar Usuario', descripcion: 'Puede editar usuarios existentes', modulo: 'Usuarios' },
            { id: 20, nombre: 'Eliminar Usuario', descripcion: 'Puede eliminar usuarios', modulo: 'Usuarios' },
          ]);
        }, 500);
      });
    }
  });

  // Mock query para obtener permisos por rol
  const { data: rolPermisos, isLoading: loadingRolPermisos } = useQuery({
    queryKey: ['rol-permisos', selectedRol],
    queryFn: async () => {
      return new Promise<RolPermiso>((resolve) => {
        setTimeout(() => {
          const permisosPorRol = {
            ADMIN: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            ENTRENADOR: [1, 3, 7, 8, 9, 10, 11, 12],
            RECEPCIONISTA: [1, 2, 5, 6, 10, 11, 12, 13, 14, 15]
          };
          resolve({
            rol: selectedRol,
            permisos: permisosPorRol[selectedRol] || []
          });
        }, 300);
      });
    }
  });

  // Mock mutation para actualizar permisos
  const updatePermisosMutation = useMutation({
    mutationFn: async ({ rol, permisos }: { rol: string; permisos: number[] }) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Permisos actualizados',
        message: 'Los permisos han sido actualizados correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['rol-permisos'] });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar los permisos',
      });
    }
  });

  const handlePermisoChange = (permisoId: number, checked: boolean) => {
    if (!rolPermisos) return;

    const nuevosPermisos = checked
      ? [...rolPermisos.permisos, permisoId]
      : rolPermisos.permisos.filter(id => id !== permisoId);

    updatePermisosMutation.mutate({
      rol: selectedRol,
      permisos: nuevosPermisos
    });
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

  const getModuloColor = (modulo: string) => {
    const colores = {
      'Alumnos': 'bg-blue-100 text-blue-800',
      'Pagos': 'bg-green-100 text-green-800',
      'Rutinas': 'bg-purple-100 text-purple-800',
      'Turnos': 'bg-orange-100 text-orange-800',
      'Caja': 'bg-yellow-100 text-yellow-800',
      'Informes': 'bg-indigo-100 text-indigo-800',
      'Usuarios': 'bg-red-100 text-red-800'
    };
    return colores[modulo as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  if (loadingPermisos || loadingRolPermisos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const permisosAgrupados = permisos?.reduce((acc, permiso) => {
    if (!acc[permiso.modulo]) {
      acc[permiso.modulo] = [];
    }
    acc[permiso.modulo].push(permiso);
    return acc;
  }, {} as Record<string, Permiso[]>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Permisos</h1>
      </div>

      {/* Selector de rol */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Rol</h2>
        <div className="flex gap-4">
          {(['ADMIN', 'ENTRENADOR', 'RECEPCIONISTA'] as const).map((rol) => (
            <button
              key={rol}
              onClick={() => setSelectedRol(rol)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRol === rol
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getRolLabel(rol)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de permisos por módulo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Permisos para {getRolLabel(selectedRol)}
          </h2>
        </div>
        <div className="p-6">
          {permisosAgrupados && Object.entries(permisosAgrupados).map(([modulo, moduloPermisos]) => (
            <div key={modulo} className="mb-6 last:mb-0">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getModuloColor(modulo)}`}>
                  {modulo}
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduloPermisos.map((permiso) => (
                  <div key={permiso.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id={`permiso-${permiso.id}`}
                      checked={rolPermisos?.permisos.includes(permiso.id) || false}
                      onChange={(e) => handlePermisoChange(permiso.id, e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`permiso-${permiso.id}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {permiso.nombre}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{permiso.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-lg">🔐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permisos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{permisos?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-lg">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permisos Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{rolPermisos?.permisos.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-lg">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permisos No Asignados</p>
              <p className="text-2xl font-bold text-gray-900">
                {(permisos?.length || 0) - (rolPermisos?.permisos.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permisos;
