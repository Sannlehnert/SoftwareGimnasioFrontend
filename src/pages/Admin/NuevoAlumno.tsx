import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const NuevoAlumno: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: '',
    planId: 1,
    fechaIngreso: new Date().toISOString().split('T')[0],
    notas: '',
  });

  const createAlumnoMutation = useMutation({
    mutationFn: alumnosService.createAlumno,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
      addToast({
        type: 'success',
        title: 'Alumno creado',
        message: 'El alumno se ha creado correctamente',
      });
      navigate(`/alumnos/${data.id}`);
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear el alumno',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email) {
      addToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Por favor complete todos los campos obligatorios',
      });
      return;
    }

    createAlumnoMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Alumno</h1>
        <Button variant="secondary" onClick={() => navigate('/alumnos')}>
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos Personales */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI *
            </label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Plan y Fechas */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Plan y Fechas</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              name="planId"
              value={formData.planId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={1}>Full Mensual</option>
              <option value={2}>Semestral</option>
              <option value={3}>Drop-in</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Ingreso
            </label>
            <input
              type="date"
              name="fechaIngreso"
              value={formData.fechaIngreso}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            isLoading={createAlumnoMutation.isPending}
            className="flex-1"
          >
            Crear Alumno
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevoAlumno;
