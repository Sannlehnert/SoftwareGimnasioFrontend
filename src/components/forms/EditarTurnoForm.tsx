import React, { useState, useEffect } from 'react';
import { turnosService, Clase } from '../../api/services/turnos';
import Button from '../ui/Button';

interface EditarTurnoFormProps {
  turno: any;
  onClose: () => void;
  onSubmit: (turnoData: Partial<any>) => void;
  isLoading: boolean;
}

const EditarTurnoForm: React.FC<EditarTurnoFormProps> = ({ turno, onClose, onSubmit, isLoading }) => {
  const [clases, setClases] = useState<Clase[]>([]);
  const [formData, setFormData] = useState({
    claseId: turno?.claseId?.toString() || '',
    fechaHora: turno?.fechaHora || '',
    sala: turno?.sala || '',
    instructor: turno?.instructor || '',
    cupo: turno?.cupo?.toString() || '',
    estado: turno?.estado || 'ACTIVO',
  });

  useEffect(() => {
    loadClases();
  }, []);

  useEffect(() => {
    if (turno) {
      setFormData({
        claseId: turno.claseId?.toString() || '',
        fechaHora: turno.fechaHora || '',
        sala: turno.sala || '',
        instructor: turno.instructor || '',
        cupo: turno.cupo?.toString() || '',
        estado: turno.estado || 'ACTIVO',
      });
    }
  }, [turno]);

  const loadClases = async () => {
    try {
      const clasesData = await turnosService.getClases();
      setClases(clasesData.filter(c => c.activo));
    } catch (error) {
      console.error('Error loading clases:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.claseId || !formData.fechaHora || !formData.sala || !formData.instructor || !formData.cupo) {
      return;
    }

    onSubmit({
      claseId: parseInt(formData.claseId),
      fechaHora: formData.fechaHora,
      sala: formData.sala,
      instructor: formData.instructor,
      cupo: parseInt(formData.cupo),
      estado: formData.estado,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-fill instructor and cupo when clase is selected
    if (name === 'claseId') {
      const selectedClase = clases.find(c => c.id === parseInt(value));
      if (selectedClase) {
        setFormData(prev => ({
          ...prev,
          instructor: selectedClase.instructores[0] || '',
          cupo: selectedClase.capacidad.toString(),
        }));
      }
    }
  };

  const selectedClase = clases.find(c => c.id === parseInt(formData.claseId));

  if (!turno) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clase *
        </label>
        <select
          name="claseId"
          value={formData.claseId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="">Seleccionar clase...</option>
          {clases.map((clase) => (
            <option key={clase.id} value={clase.id}>
              {clase.nombre} - {clase.duracion}min
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha y Hora *
        </label>
        <input
          type="datetime-local"
          name="fechaHora"
          value={formData.fechaHora}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sala *
          </label>
          <input
            type="text"
            name="sala"
            value={formData.sala}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Sala A, Sala B"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cupo *
          </label>
          <input
            type="number"
            name="cupo"
            value={formData.cupo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={selectedClase?.capacidad.toString() || "20"}
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructor *
        </label>
        {selectedClase && selectedClase.instructores.length > 1 ? (
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Seleccionar instructor...</option>
            {selectedClase.instructores.map((instructor) => (
              <option key={instructor} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nombre del instructor"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado *
        </label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="ACTIVO">Activo</option>
          <option value="CANCELADO">Cancelado</option>
          <option value="COMPLETO">Completo</option>
        </select>
      </div>

      {selectedClase && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Información de la clase:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Descripción:</strong> {selectedClase.descripcion}</p>
            <p><strong>Capacidad máxima:</strong> {selectedClase.capacidad} personas</p>
            <p><strong>Duración:</strong> {selectedClase.duracion} minutos</p>
            <p><strong>Instructores disponibles:</strong> {selectedClase.instructores.join(', ')}</p>
          </div>
        </div>
      )}

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
          Actualizar Turno
        </Button>
      </div>
    </form>
  );
};

export default EditarTurnoForm;
