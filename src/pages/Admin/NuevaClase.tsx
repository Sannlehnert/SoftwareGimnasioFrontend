import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';
import Button from '../../components/ui/Button';

const NuevaClase: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claseData, setClaseData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 20,
    duracion: 60,
    instructores: [''],
    activo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!claseData.nombre.trim()) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'El nombre de la clase es obligatorio'
      });
      return;
    }

    if (claseData.instructores.some(i => !i.trim())) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'Todos los instructores deben tener nombre'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API para crear la clase
      // await api.post('/clases', claseData);

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      addToast({
        type: 'success',
        title: 'Clase creada',
        message: 'Clase creada exitosamente'
      });
      navigate('/clases');
    } catch (error: any) {
      console.error('Error al crear clase:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al crear la clase'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorChange = (index: number, value: string) => {
    const newInstructores = [...claseData.instructores];
    newInstructores[index] = value;
    setClaseData(prev => ({ ...prev, instructores: newInstructores }));
  };

  const addInstructor = () => {
    setClaseData(prev => ({ ...prev, instructores: [...prev.instructores, ''] }));
  };

  const removeInstructor = (index: number) => {
    if (claseData.instructores.length > 1) {
      setClaseData(prev => ({
        ...prev,
        instructores: prev.instructores.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Clase</h1>
          <p className="text-gray-600">Crea una nueva clase para el gimnasio</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/clases')}
        >
          ← Volver a Clases
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Clase *
            </label>
            <input
              type="text"
              value={claseData.nombre}
              onChange={(e) => setClaseData(prev => ({ ...prev, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Cross Funcional, Yoga, Spinning..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={claseData.descripcion}
              onChange={(e) => setClaseData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe brevemente en qué consiste la clase..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad Máxima *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={claseData.capacidad}
                onChange={(e) => setClaseData(prev => ({ ...prev, capacidad: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Número máximo de alumnos por clase</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos) *
              </label>
              <input
                type="number"
                min="15"
                max="180"
                step="15"
                value={claseData.duracion}
                onChange={(e) => setClaseData(prev => ({ ...prev, duracion: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Duración en minutos (múltiplos de 15)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructores *
            </label>
            <div className="space-y-2">
              {claseData.instructores.map((instructor, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => handleInstructorChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={`Instructor ${index + 1}`}
                    required
                  />
                  {claseData.instructores.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeInstructor(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addInstructor}
              className="mt-2"
            >
              + Agregar Instructor
            </Button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={claseData.activo}
              onChange={(e) => setClaseData(prev => ({ ...prev, activo: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Clase activa (disponible para programar turnos)
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/clases')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!claseData.nombre.trim() || claseData.instructores.some(i => !i.trim())}
              className="flex-1"
            >
              Crear Clase
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaClase;
