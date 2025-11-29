import React, { useState } from 'react';
import Button from '../ui/Button';

interface NuevaClaseFormProps {
  onClose: () => void;
  onSubmit: (claseData: {
    nombre: string;
    descripcion: string;
    capacidad: number;
    duracion: number;
    instructores: string[];
    activo: boolean;
    color: string;
  }) => void;
  isLoading: boolean;
}

const NuevaClaseForm: React.FC<NuevaClaseFormProps> = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    duracion: '',
    instructores: [] as string[],
    activo: true,
    color: '', // Add color property
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.capacidad || !formData.duracion) {
      return;
    }

    onSubmit({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      capacidad: parseInt(formData.capacidad),
      duracion: parseInt(formData.duracion),
      instructores: formData.instructores,
      activo: formData.activo,
      color: formData.color,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleInstructoresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const instructores = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setFormData(prev => ({
      ...prev,
      instructores,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Clase *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ej: Yoga, Crossfit, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Descripción de la clase..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacidad Máxima *
          </label>
          <input
            type="number"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="20"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración (minutos) *
          </label>
          <input
            type="number"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="60"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructores
        </label>
        <input
          type="text"
          value={formData.instructores.join(', ')}
          onChange={handleInstructoresChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Instructor 1, Instructor 2, ..."
        />
        <p className="text-xs text-gray-500 mt-1">Separe los instructores con comas</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
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
          className="flex-1"
        >
          Crear Clase
        </Button>
      </div>
    </form>
  );
};

export default NuevaClaseForm;
