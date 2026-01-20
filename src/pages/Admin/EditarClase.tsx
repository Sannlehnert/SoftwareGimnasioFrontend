import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { turnosService } from '../../api/services/turnos';



const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const EditarClase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    instructores: [] as string[],
    capacidad: '',
    precio: '',
    dias: [] as string[],
    horario: '',
    estado: 'ACTIVA',
    duracion: '',
    nivel: 'Principiante',
    requisitos: '',
    equipo: [] as string[]
  });

  const [nuevoEquipo, setNuevoEquipo] = useState('');

  const { data: clase, isLoading } = useQuery({
    queryKey: ['clase', id],
    queryFn: async () => {
      const clases = await turnosService.getClases();
      const clase = clases.find((c: any) => c.id === parseInt(id || '0'));
      if (!clase) throw new Error('Clase no encontrada');
      return clase;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (clase) {
      setFormData({
        nombre: clase.nombre,
        descripcion: clase.descripcion,
        instructores: clase.instructores || [],
        capacidad: clase.capacidad.toString(),
        precio: clase.precio?.toString() || '',
        dias: clase.dias || [],
        horario: clase.horario || '',
        estado: clase.estado || 'ACTIVA',
        duracion: clase.duracion.toString(),
        nivel: clase.nivel || 'Principiante',
        requisitos: clase.requisitos || '',
        equipo: clase.equipo || []
      });
    }
  }, [clase]);

  const updateClaseMutation = useMutation({
    mutationFn: (data: any) => turnosService.updateClase(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      addToast({
        type: 'success',
        title: 'Clase actualizada',
        message: 'Los cambios se han guardado correctamente',
      });
      navigate('/clases');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar la clase',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.instructores[0] || !formData.capacidad) {
      addToast({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor completa todos los campos obligatorios',
      });
      return;
    }

    updateClaseMutation.mutate({
      ...formData,
      capacidad: Number(formData.capacidad),
      precio: Number(formData.precio),
      duracion: Number(formData.duracion),
    });
  };

  const handleDiaChange = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia]
    }));
  };

  const handleAddEquipo = () => {
    if (nuevoEquipo.trim() && !formData.equipo.includes(nuevoEquipo.trim())) {
      setFormData(prev => ({
        ...prev,
        equipo: [...prev.equipo, nuevoEquipo.trim()]
      }));
      setNuevoEquipo('');
    }
  };

  const handleRemoveEquipo = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipo: prev.equipo.filter(e => e !== item)
    }));
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
          Editar Clase: {clase?.nombre}
        </h1>
        <Button variant="secondary" onClick={() => navigate('/clases')}>
          ← Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Información General</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Clase *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <input
                type="text"
                value={formData.instructores[0] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, instructores: [e.target.value] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad *
              </label>
              <input
                type="number"
                value={formData.capacidad}
                onChange={(e) => setFormData(prev => ({ ...prev, capacidad: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ($)
              </label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData(prev => ({ ...prev, duracion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData(prev => ({ ...prev, nivel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Todos los niveles">Todos los niveles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="ACTIVA">Activa</option>
                <option value="INACTIVA">Inactiva</option>
                <option value="SUSPENDIDA">Suspendida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario
              </label>
              <input
                type="text"
                value={formData.horario}
                onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                placeholder="Ej: 19:00 - 20:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requisitos
            </label>
            <input
              type="text"
              value={formData.requisitos}
              onChange={(e) => setFormData(prev => ({ ...prev, requisitos: e.target.value }))}
              placeholder="Ej: Buena condición física general"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Días de la Semana</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {diasSemana.map((dia) => (
              <label key={dia} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dias.includes(dia)}
                  onChange={() => handleDiaChange(dia)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{dia}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Equipo Necesario</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={nuevoEquipo}
              onChange={(e) => setNuevoEquipo(e.target.value)}
              placeholder="Agregar equipo..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEquipo())}
            />
            <Button type="button" onClick={handleAddEquipo} size="sm">
              Agregar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {formData.equipo.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEquipo(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            isLoading={updateClaseMutation.isPending}
            className="flex-1"
          >
            Guardar Cambios
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/clases')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarClase;
