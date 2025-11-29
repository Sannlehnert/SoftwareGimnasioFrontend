import React, { useState } from 'react';
import Button from '../../components/ui/Button';

interface NuevaClaseFormProps {
  onClose: () => void;
  onSubmit: (claseData: any) => void;
  isLoading: boolean;
}

const NuevaClaseForm: React.FC<NuevaClaseFormProps> = ({ onClose, onSubmit, isLoading }) => {
  const [claseData, setClaseData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 20,
    duracion: 60,
    instructores: [''],
    activo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(claseData);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Clase *
        </label>
        <input
          type="text"
          value={claseData.nombre}
          onChange={(e) => setClaseData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ej: Cross Funcional"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={claseData.descripcion}
          onChange={(e) => setClaseData(prev => ({ ...prev, descripcion: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Descripción de la clase..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad *
          </label>
          <input
            type="number"
            min="1"
            value={claseData.capacidad}
            onChange={(e) => setClaseData(prev => ({ ...prev, capacidad: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración (minutos) *
          </label>
          <input
            type="number"
            min="15"
            step="15"
            value={claseData.duracion}
            onChange={(e) => setClaseData(prev => ({ ...prev, duracion: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructores *
        </label>
        {claseData.instructores.map((instructor, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={instructor}
              onChange={(e) => handleInstructorChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nombre del instructor"
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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addInstructor}
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
          Clase activa
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!claseData.nombre || claseData.instructores.some(i => !i.trim())}
          className="flex-1"
        >
          Crear Clase
        </Button>
      </div>
    </form>
  );
};

export default NuevaClaseForm;
