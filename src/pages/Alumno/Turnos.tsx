import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for student's shifts
const mockTurnos = [
  {
    id: 1,
    clase: 'Yoga',
    fecha: '2024-01-15',
    hora: '10:00',
    instructor: 'María López',
    estado: 'confirmado'
  },
  {
    id: 2,
    clase: 'Spinning',
    fecha: '2024-01-16',
    hora: '11:00',
    instructor: 'Carlos Rodríguez',
    estado: 'confirmado'
  },
  {
    id: 3,
    clase: 'Cross Funcional',
    fecha: '2024-01-17',
    hora: '12:00',
    instructor: 'Ana García',
    estado: 'pendiente'
  },
  {
    id: 4,
    clase: 'Yoga',
    fecha: '2024-01-18',
    hora: '10:00',
    instructor: 'María López',
    estado: 'confirmado'
  }
];

const Turnos: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('');

  // Mock query - replace with actual API service
  const { data: turnos, isLoading } = useQuery({
    queryKey: ['turnos-alumno'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTurnos;
    }
  });

  const filteredTurnos = turnos?.filter(turno =>
    !filtroEstado || turno.estado === filtroEstado
  ) || [];

  const handleReservarTurno = () => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'La reserva de turnos estará disponible próximamente',
    });
  };

  const handleCancelarTurno = (turnoId: number) => {
    addToast({
      type: 'success',
      title: 'Turno cancelado',
      message: 'El turno ha sido cancelado exitosamente',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Turnos</h1>
        <Button onClick={handleReservarTurno}>
          Reservar Nuevo Turno
        </Button>
      </div>

      {/* KPI Turnos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Turnos</p>
          <p className="text-2xl font-bold text-blue-600">
            {turnos?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Confirmados</p>
          <p className="text-2xl font-bold text-green-600">
            {turnos?.filter(t => t.estado === 'confirmado').length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {turnos?.filter(t => t.estado === 'pendiente').length || 0}
          </p>
        </div>
      </div>

      {/* Filtro */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de turnos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTurnos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No tienes turnos programados
                  </td>
                </tr>
              ) : (
                filteredTurnos.map((turno) => (
                  <tr key={turno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {turno.clase}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(turno.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turno.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        turno.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                        turno.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {turno.estado === 'confirmado' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCancelarTurno(turno.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                      {turno.estado === 'pendiente' && (
                        <span className="text-gray-500">Esperando confirmación</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Turnos;
