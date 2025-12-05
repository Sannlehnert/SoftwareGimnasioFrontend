import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

interface Beneficio {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  usuarioNombre: string;
}

const Beneficios: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Mock data - en producción esto vendría de la API
  const { data: beneficios, isLoading } = useQuery(['beneficios'], async () => {
    // Simular llamada a API
    return {
      data: [
        {
          id: 1,
          titulo: 'Membresía de Gimnasio',
          descripcion: 'Acceso ilimitado a todas las instalaciones del gimnasio',
          fechaCreacion: '2024-01-15T10:00:00Z',
          usuarioNombre: 'Admin',
        },
        {
          id: 2,
          titulo: 'Entrenamiento Personal',
          descripcion: 'Sesiones personalizadas con entrenador certificado',
          fechaCreacion: '2024-01-10T14:30:00Z',
          usuarioNombre: 'Admin',
        },
      ],
      total: 2,
    };
  });

  const createMutation = useMutation({
    mutationFn: async (data: { titulo: string; descripcion: string }) => {
      // Simular creación
      return new Promise<Beneficio>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            titulo: data.titulo,
            descripcion: data.descripcion,
            fechaCreacion: new Date().toISOString(),
            usuarioNombre: 'Admin',
          });
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      setIsModalOpen(false);
      setTitulo('');
      setDescripcion('');
      addToast({
        type: 'success',
        title: 'Beneficio creado',
        message: 'El beneficio se ha creado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al crear el beneficio',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simular eliminación
      return new Promise<number>((resolve) => {
        setTimeout(() => resolve(id), 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficios'] });
      addToast({
        type: 'success',
        title: 'Beneficio eliminado',
        message: 'El beneficio se ha eliminado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar el beneficio',
      });
    },
  });

  const handleCreate = () => {
    if (!titulo.trim()) return;

    createMutation.mutate({
      titulo,
      descripcion,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este beneficio?')) {
      deleteMutation.mutate(id);
    }
  };

  const beneficiosColumns = [
    { key: 'titulo', label: 'Título' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'fechaCreacion',
      label: 'Fecha Creación',
      render: (value: string) => new Date(value).toLocaleDateString('es-AR'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Beneficio) => (
        <div className="flex gap-2">
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Beneficios</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Crear Beneficio
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={beneficiosColumns}
          data={beneficios?.data || []}
          totalItems={beneficios?.total || 0}
          serverSidePagination={false}
        />
      </div>

      {/* Modal Crear Beneficio */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTitulo('');
          setDescripcion('');
        }}
        title="Crear Nuevo Beneficio"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Título del beneficio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Descripción del beneficio"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setTitulo('');
                setDescripcion('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              isLoading={createMutation.isPending}
              disabled={!titulo.trim()}
              className="flex-1"
            >
              Crear Beneficio
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Beneficios;
