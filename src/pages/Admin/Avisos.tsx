import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

interface Aviso {
  id: number;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
  fechaExpiracion?: string;
  activo: boolean;
  usuarioNombre: string;
}

const Avisos: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAviso, setEditingAviso] = useState<Aviso | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    fechaExpiracion: '',
    activo: true,
  });

  // Mock data - en producción esto vendría de la API
  const { data: avisos, isLoading } = useQuery(['avisos'], async () => {
    // Simular llamada a API
    return {
      data: [
        {
          id: 1,
          titulo: 'Mantenimiento del gimnasio',
          contenido: 'El gimnasio estará cerrado el próximo lunes por mantenimiento.',
          fechaCreacion: '2024-01-15T10:00:00Z',
          fechaExpiracion: '2024-01-22T23:59:59Z',
          activo: true,
          usuarioNombre: 'Admin',
        },
        {
          id: 2,
          titulo: 'Nueva clase de yoga',
          contenido: '¡Ya están abiertas las inscripciones para la nueva clase de yoga los martes a las 19:00!',
          fechaCreacion: '2024-01-10T14:30:00Z',
          activo: true,
          usuarioNombre: 'Admin',
        },
      ],
      total: 2,
    };
  });

  const createAvisoMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simular llamada a API
      return { ...data, id: Date.now(), fechaCreacion: new Date().toISOString(), usuarioNombre: 'Admin' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
      setIsModalOpen(false);
      resetForm();
      addToast({
        type: 'success',
        title: 'Aviso creado',
        message: 'El aviso se ha creado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al crear el aviso',
      });
    },
  });

  const updateAvisoMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simular llamada a API
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
      setIsModalOpen(false);
      setEditingAviso(null);
      resetForm();
      addToast({
        type: 'success',
        title: 'Aviso actualizado',
        message: 'El aviso se ha actualizado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar el aviso',
      });
    },
  });

  const deleteAvisoMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simular llamada a API
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avisos'] });
      addToast({
        type: 'success',
        title: 'Aviso eliminado',
        message: 'El aviso se ha eliminado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar el aviso',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      contenido: '',
      fechaExpiracion: '',
      activo: true,
    });
  };

  const handleSubmit = () => {
    if (!formData.titulo || !formData.contenido) return;

    const data = {
      ...formData,
      fechaExpiracion: formData.fechaExpiracion || null,
    };

    if (editingAviso) {
      updateAvisoMutation.mutate({ ...data, id: editingAviso.id });
    } else {
      createAvisoMutation.mutate(data);
    }
  };

  const handleEdit = (aviso: Aviso) => {
    setEditingAviso(aviso);
    setFormData({
      titulo: aviso.titulo,
      contenido: aviso.contenido,
      fechaExpiracion: aviso.fechaExpiracion ? aviso.fechaExpiracion.split('T')[0] : '',
      activo: aviso.activo,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este aviso?')) {
      deleteAvisoMutation.mutate(id);
    }
  };

  const avisosColumns = [
    { key: 'titulo', label: 'Título' },
    {
      key: 'contenido',
      label: 'Contenido',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'fechaCreacion',
      label: 'Fecha Creación',
      render: (value: string) => new Date(value).toLocaleDateString('es-AR'),
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value: boolean) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Aviso) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Avisos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Nuevo Aviso
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={avisosColumns}
          data={avisos?.data || []}
          totalItems={avisos?.total || 0}
          serverSidePagination={false}
        />
      </div>

      {/* Modal Crear/Editar Aviso */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAviso(null);
          resetForm();
        }}
        title={editingAviso ? 'Editar Aviso' : 'Nuevo Aviso'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Título del aviso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido *
            </label>
            <textarea
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Contenido del aviso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Expiración (opcional)
            </label>
            <input
              type="date"
              value={formData.fechaExpiracion}
              onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Aviso activo
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingAviso(null);
                resetForm();
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={createAvisoMutation.isPending || updateAvisoMutation.isPending}
              disabled={!formData.titulo || !formData.contenido}
              className="flex-1"
            >
              {editingAviso ? 'Actualizar' : 'Crear'} Aviso
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Avisos;
