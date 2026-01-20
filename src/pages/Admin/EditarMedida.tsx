import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { medidasService } from '../../api/services/medidas';

const EditarMedida: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fecha: '',
    peso: '',
    altura: '',
    grasaCorporal: '',
    masaMuscular: '',
    observaciones: ''
  });

  const { data: medida, isLoading } = useQuery({
    queryKey: ['medida', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: parseInt(id || '0'),
        alumnoId: 1,
        alumnoNombre: 'Mock Alumno',
        fecha: new Date().toISOString().split('T')[0],
        peso: 70,
        altura: 170,
        imc: 24.2,
        grasaCorporal: 15,
        masaMuscular: 60,
        aguaCorporal: 55,
        observaciones: 'Medidas iniciales'
      };
    },
    enabled: !!id
  });

  useEffect(() => {
    if (medida) {
      setFormData({
        fecha: medida.fecha,
        peso: medida.peso.toString(),
        altura: medida.altura.toString(),
        grasaCorporal: medida.grasaCorporal.toString(),
        masaMuscular: medida.masaMuscular.toString(),
        observaciones: medida.observaciones
      });
    }
  }, [medida]);

  const updateMedidaMutation = useMutation({
    mutationFn: (data: any) => medidasService.updateMedida(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidas'] });
      addToast({
        type: 'success',
        title: 'Medida actualizada',
        message: 'Los cambios se han guardado correctamente',
      });
      navigate('/medidas');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar la medida',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fecha || !formData.peso || !formData.altura) {
      addToast({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor completa todos los campos obligatorios',
      });
      return;
    }

    updateMedidaMutation.mutate({
      ...formData,
      peso: Number(formData.peso),
      altura: Number(formData.altura),
      grasaCorporal: Number(formData.grasaCorporal),
      masaMuscular: Number(formData.masaMuscular),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Medida
        </h1>
        <Button variant="secondary" onClick={() => navigate('/medidas')}>
          ← Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Información de la Medida</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData(prev => ({ ...prev, peso: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (cm) *
              </label>
              <input
                type="number"
                value={formData.altura}
                onChange={(e) => setFormData(prev => ({ ...prev, altura: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grasa Corporal (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.grasaCorporal}
                onChange={(e) => setFormData(prev => ({ ...prev, grasaCorporal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Masa Muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.masaMuscular}
                onChange={(e) => setFormData(prev => ({ ...prev, masaMuscular: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={updateMedidaMutation.isPending}
            className="flex-1"
          >
            Guardar Cambios
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/medidas')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarMedida;
