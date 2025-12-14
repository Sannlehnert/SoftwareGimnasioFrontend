import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for students and their turns
const mockTurnosPorAlumno = [
  {
    alumnoId: 1,
    alumno: 'Juan Pérez',
    dni: '12345678',
    turnos: [
      {
        id: 1,
        clase: 'Yoga',
        horario: '10:00',
        instructor: 'María López',
        fecha: '2024-01-15',
        estado: 'confirmado'
      },
      {
        id: 2,
        clase: 'Spinning',
        horario: '11:00',
        instructor: 'Carlos García',
        fecha: '2024-01-16',
        estado: 'confirmado'
      }
    ]
  },
  {
    alumnoId: 2,
    alumno: 'María García',
    dni: '87654321',
    turnos: [
      {
        id: 3,
        clase: 'Cross Funcional',
        horario: '12:00',
        instructor: 'Ana Rodríguez',
        fecha: '2024-01-15',
        estado: 'confirmado'
      },
      {
        id: 4,
        clase: 'Pilates',
        horario: '16:00',
        instructor: 'Pedro Sánchez',
        fecha: '2024-01-17',
        estado: 'pendiente'
      }
    ]
  },
  {
    alumnoId: 3,
    alumno: 'Carlos Rodríguez',
    dni: '11223344',
    turnos: [
      {
        id: 5,
        clase: 'Yoga',
        horario: '10:00',
        instructor: 'María López',
        fecha: '2024-01-15',
        estado: 'confirmado'
      }
    ]
  },
  {
    alumnoId: 4,
    alumno: 'Ana López',
    dni: '44332211',
    turnos: [
      {
        id: 6,
        clase: 'Zumba',
        horario: '17:00',
        instructor: 'Laura Martínez',
        fecha: '2024-01-18',
        estado: 'confirmado'
      },
      {
        id: 7,
        clase: 'Yoga',
        horario: '10:00',
        instructor: 'María López',
        fecha: '2024-01-19',
        estado: 'pendiente'
      }
    ]
  }
];

const TurnosAlumno: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumno, setSelectedAlumno] = useState<number | null>(null);

  // Mock query - replace with actual API service
  const { data: turnosPorAlumno, isLoading } = useQuery({
    queryKey: ['turnos-alumno'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTurnosPorAlumno;
    }
  });

  const filteredAlumnos = turnosPorAlumno?.filter(alumno =>
    alumno.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.dni.includes(searchTerm)
  ) || [];

  const handleVerTurnos = (alumnoId: number) => {
    setSelectedAlumno(selectedAlumno === alumnoId ? null : alumnoId);
  };

  const handleEditarTurno = (turnoId: number) => {
    navigate(`/turnos-alumno/${turnoId}/editar`);
  };

  const handleCancelarTurno = (turnoId: number) => {
    addToast({
      type: 'warning',
      title: 'Funcionalidad pendiente',
      message: 'La cancelación de turnos estará disponible próximamente',
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Turnos por Alumno</h1>
      </div>

      {/* KPI Turnos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
          <p className="text-2xl font-bold text-blue-600">
            {turnosPorAlumno?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Turnos</p>
          <p className="text-2xl font-bold text-green-600">
            {turnosPorAlumno?.reduce((total, alumno) => total + alumno.turnos.length, 0) || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Turnos Confirmados</p>
          <p className="text-2xl font-bold text-purple-600">
            {turnosPorAlumno?.reduce((total, alumno) =>
              total + alumno.turnos.filter(turno => turno.estado === 'confirmado').length, 0) || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Turnos Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {turnosPorAlumno?.reduce((total, alumno) =>
              total + alumno.turnos.filter(turno => turno.estado === 'pendiente').length, 0) || 0}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar alumno por nombre o DNI
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del alumno o DNI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de alumnos */}
      <div className="space-y-4">
        {filteredAlumnos.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No se encontraron alumnos con turnos</p>
          </div>
        ) : (
          filteredAlumnos.map((alumno) => (
            <div key={alumno.alumnoId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header del alumno */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleVerTurnos(alumno.alumnoId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{alumno.alumno}</h3>
                    <p className="text-sm text-gray-500">DNI: {alumno.dni}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {alumno.turnos.length} turno{alumno.turnos.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {alumno.turnos.filter(t => t.estado === 'confirmado').length} confirmado(s)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerTurnos(alumno.alumnoId);
                      }}
                    >
                      {selectedAlumno === alumno.alumnoId ? 'Ocultar' : 'Ver Turnos'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Detalle de turnos */}
              {selectedAlumno === alumno.alumnoId && (
                <div className="border-t border-gray-200">
                  <div className="p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Turnos de {alumno.alumno}</h4>
                    <div className="space-y-3">
                      {alumno.turnos.map((turno) => (
                        <div key={turno.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{turno.clase}</p>
                                  <p className="text-xs text-gray-500">{turno.instructor}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    {new Date(turno.fecha).toLocaleDateString('es-AR')}
                                  </p>
                                  <p className="text-xs text-gray-500">{turno.horario}</p>
                                </div>
                                <div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(turno.estado)}`}>
                                    {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleEditarTurno(turno.id)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleCancelarTurno(turno.id)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TurnosAlumno;
