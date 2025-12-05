import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

interface Imagen {
  id: number;
  nombre: string;
  url: string;
  descripcion?: string;
  fechaSubida: string;
  tamano: number;
  tipo: string;
  usuarioNombre: string;
}

const Imagenes: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState('');

  // Mock data - en producción esto vendría de la API
  const { data: imagenes, isLoading } = useQuery(['imagenes'], async () => {
    // Simular llamada a API
    return {
      data: [
        {
          id: 1,
          nombre: 'logo-gym.png',
          url: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Logo+Gym',
          descripcion: 'Logo principal del gimnasio',
          fechaSubida: '2024-01-15T10:00:00Z',
          tamano: 245760,
          tipo: 'image/png',
          usuarioNombre: 'Admin',
        },
        {
          id: 2,
          nombre: 'banner-clases.jpg',
          url: 'https://via.placeholder.com/300x150/059669/FFFFFF?text=Banner+Clases',
          descripcion: 'Banner para promocionar clases',
          fechaSubida: '2024-01-10T14:30:00Z',
          tamano: 512000,
          tipo: 'image/jpeg',
          usuarioNombre: 'Admin',
        },
      ],
      total: 2,
    };
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; descripcion: string }) => {
      // Simular subida de imagen
      return new Promise<Imagen>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            nombre: data.file.name,
            url: URL.createObjectURL(data.file),
            descripcion: data.descripcion,
            fechaSubida: new Date().toISOString(),
            tamano: data.file.size,
            tipo: data.file.type,
            usuarioNombre: 'Admin',
          });
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagenes'] });
      setIsModalOpen(false);
      setSelectedFile(null);
      setDescripcion('');
      addToast({
        type: 'success',
        title: 'Imagen subida',
        message: 'La imagen se ha subido correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al subir la imagen',
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
      queryClient.invalidateQueries({ queryKey: ['imagenes'] });
      addToast({
        type: 'success',
        title: 'Imagen eliminada',
        message: 'La imagen se ha eliminado correctamente',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar la imagen',
      });
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadMutation.mutate({
      file: selectedFile,
      descripcion,
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      deleteMutation.mutate(id);
    }
  };

  const imagenesColumns = [
    {
      key: 'url',
      label: 'Preview',
      render: (value: string) => (
        <img
          src={value}
          alt="Preview"
          className="w-16 h-16 object-cover rounded-lg border"
        />
      ),
    },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'tamano',
      label: 'Tamaño',
      render: (value: number) => formatFileSize(value),
    },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'fechaSubida',
      label: 'Fecha Subida',
      render: (value: string) => new Date(value).toLocaleDateString('es-AR'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Imagen) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(row.url, '_blank')}
          >
            Ver
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Imágenes</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Subir Imagen
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <DataTable
          columns={imagenesColumns}
          data={imagenes?.data || []}
          totalItems={imagenes?.total || 0}
          serverSidePagination={false}
        />
      </div>

      {/* Modal Subir Imagen */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
          setDescripcion('');
        }}
        title="Subir Nueva Imagen"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Imagen *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Descripción de la imagen"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFile(null);
                setDescripcion('');
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              isLoading={uploadMutation.isPending}
              disabled={!selectedFile}
              className="flex-1"
            >
              Subir Imagen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Imagenes;
