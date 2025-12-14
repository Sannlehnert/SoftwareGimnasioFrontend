import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const EditarAsistencia: React.FC = () => {
  const { asistenciaId } = useParams<{ asistenciaId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [asistio, setAsistio] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  // Mock query - replace with actual API service
  const { data: asistencia, isLoading } = useQuery({
    queryKey: ['asistencia', asistenciaId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data - replace with actual API call
      return {
        id: parseInt(asistenciaId || '1'),
        alumno: 'Juan Pérez',
        clase: 'Yoga',
        fecha: '2024-01-15',
        hora: '10:00',
        asistio: true,
        observaciones: 'Llegó puntual'
      };
    }
  });

  useEffect(() => {
    if (asistencia) {
      setAsistio(asistencia.asistio);
      setObservaciones(asistencia.observaciones || '');
    }
  }, [asistencia]);

  const updateAsistenciaMutation = useMutation({
    mutationFn: async (data: { asistio: boolean; observaciones: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock update - replace with actual API call
      return { ...asistencia, ...data };
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Asistencia actualizada',
        message: 'Los cambios han sido guardados correctamente'
      });
      queryClient.invalidateQueries({ queryKey: ['asistencia'] });
      navigate('/asistencia');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al actualizar la asistencia'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAsistenciaMutation.mutate({ asistio, observaciones });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!asistencia) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Registro de asistencia no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar Asistencia</h1>
        <Button variant="secondary" onClick={() => navigate('/asistencia')}>
          Cancelar
        </Button>
      </div>

      {/* Información del registro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Registro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alumno</label>
            <p className="mt-1 text-sm text-gray-900">{asistencia.alumno}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Clase</label>
            <p className="mt-1 text-sm text-gray-900">{asistencia.clase}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(asistencia.fecha).toLocaleDateString('es-AR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hora</label>
            <p className="mt-1 text-sm text-gray-900">{asistencia.hora}</p>
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Registro</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de Asistencia
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="asistencia"
                  checked={asistio}
                  onChange={() => setAsistio(true)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Presente</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="asistencia"
                  checked={!asistio}
                  onChange={() => setAsistio(false)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Ausente</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Agregar observaciones sobre la asistencia..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/asistencia')}
            disabled={updateAsistenciaMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={updateAsistenciaMutation.isPending}
          >
            {updateAsistenciaMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarAsistencia;
