import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const EditarTurno: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [clase, setClase] = useState('');
  const [fecha, setFecha] = useState('');
  const [horario, setHorario] = useState('');
  const [instructor, setInstructor] = useState('');
  const [estado, setEstado] = useState('confirmado');

  // Mock query - replace with actual API service
  const { data: turno, isLoading } = useQuery({
    queryKey: ['turno', turnoId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data - replace with actual API call
      return {
        id: parseInt(turnoId || '1'),
        clase: 'Yoga',
        fecha: '2024-01-15',
        horario: '10:00',
        instructor: 'María López',
        estado: 'confirmado',
        alumno: 'Juan Pérez'
      };
    }
  });

  useEffect(() => {
    if (turno) {
      setClase(turno.clase);
      setFecha(turno.fecha);
      setHorario(turno.horario);
      setInstructor(turno.instructor);
      setEstado(turno.estado);
    }
  }, [turno]);

  const updateTurnoMutation = useMutation({
    mutationFn: async (data: { clase: string; fecha: string; horario: string; instructor: string; estado: string }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock update - replace with actual API call
      return { ...turno, ...data };
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Turno actualizado',
        message: 'Los cambios han sido guardados correctamente'
      });
      queryClient.invalidateQueries({ queryKey: ['turnos-alumno'] });
      navigate('/turnos-alumno');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al actualizar el turno'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTurnoMutation.mutate({ clase, fecha, horario, instructor, estado });
  };

  // Mock data for classes and instructors
  const clasesDisponibles = ['Yoga', 'Spinning', 'Cross Funcional', 'Pilates', 'Zumba'];
  const instructoresDisponibles = ['María López', 'Carlos García', 'Ana Rodríguez', 'Pedro Sánchez', 'Laura Martínez'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!turno) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500">Turno no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar Turno</h1>
        <Button variant="secondary" onClick={() => navigate('/turnos-alumno')}>
          Cancelar
        </Button>
      </div>

      {/* Información del turno */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Turno</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Alumno</label>
            <p className="mt-1 text-sm text-gray-900">{turno.alumno}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID del Turno</label>
            <p className="mt-1 text-sm text-gray-900">#{turno.id}</p>
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Turno</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clase
            </label>
            <select
              value={clase}
              onChange={(e) => setClase(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {clasesDisponibles.map((claseOption) => (
                <option key={claseOption} value={claseOption}>
                  {claseOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor
            </label>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {instructoresDisponibles.map((instructorOption) => (
                <option key={instructorOption} value={instructorOption}>
                  {instructorOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario
            </label>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="confirmado">Confirmado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/turnos-alumno')}
            disabled={updateTurnoMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={updateTurnoMutation.isPending}
          >
            {updateTurnoMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarTurno;
