import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosService } from '../../api/services/turnos';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const AlumnoTurnos: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'mis-turnos' | 'disponibles'>('mis-turnos');

  const { data: misTurnos, isLoading: loadingMisTurnos } = useQuery({
    queryKey: ['mis-turnos', user?.id],
    queryFn: () => turnosService.getMisTurnos(),
    enabled: !!user?.id
  });

  const { data: turnosDisponibles, isLoading: loadingTurnosDisponibles } = useQuery({
    queryKey: ['turnos-disponibles'],
    queryFn: () => turnosService.getTurnos(),
    enabled: activeTab === 'disponibles'
  });

  const cancelarInscripcionMutation = useMutation({
    mutationFn: (inscripcionId: number) => turnosService.cancelarInscripcion(inscripcionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
      queryClient.invalidateQueries({ queryKey: ['turnos-disponibles'] });
      addToast({
        type: 'success',
        title: 'Inscripción cancelada',
        message: 'Has cancelado tu inscripción al turno',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al cancelar la inscripción',
      });
    },
  });

  const inscribirMutation = useMutation({
    mutationFn: (turnoId: number) => turnosService.inscribirAlumno(turnoId, user?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mis-turnos'] });
      queryClient.invalidateQueries({ queryKey: ['turnos-disponibles'] });
      addToast({
        type: 'success',
        title: 'Inscripción exitosa',
        message: 'Te has inscrito al turno correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al inscribirte al turno',
      });
    },
  });

  const misTurnosColumns = [
    { key: 'claseNombre', label: 'Clase' },
    { key: 'fechaHora', label: 'Fecha y Hora', render: (value: string) => new Date(value).toLocaleString('es-AR') },
    { key: 'sala', label: 'Sala' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'estadoInscripcion', label: 'Estado', render: (value: string) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value === 'CONFIRMADO' ? 'bg-success/10 text-success' :
        value === 'CANCELADO' ? 'bg-error/10 text-error' :
        value === 'ASISTIO' ? 'bg-blue-100 text-blue-800' :
        'bg-warning/10 text-warning'
      }`}>
        {value === 'CONFIRMADO' ? 'Confirmado' :
         value === 'CANCELADO' ? 'Cancelado' :
         value === 'ASISTIO' ? 'Asistió' : value}
      </span>
    )},
  ];

  const turnosDisponiblesColumns = [
    { key: 'claseNombre', label: 'Clase' },
    { key: 'fechaHora', label: 'Fecha y Hora', render: (value: string) => new Date(value).toLocaleString('es-AR') },
    { key: 'sala', label: 'Sala' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'cupo', label: 'Cupo', render: (value: number, row: any) => `${row.inscritos}/${value}` },
    { key: 'estado', label: 'Estado', render: (value: string) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value === 'ACTIVO' ? 'bg-success/10 text-success' :
        value === 'COMPLETO' ? 'bg-warning/10 text-warning' :
        'bg-error/10 text-error'
      }`}>
        {value === 'ACTIVO' ? 'Disponible' :
         value === 'COMPLETO' ? 'Completo' : value}
      </span>
    )},
  ];

  const handleCancelarInscripcion = (inscripcionId: number) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar tu inscripción a este turno?')) {
      cancelarInscripcionMutation.mutate(inscripcionId);
    }
  };

  const handleInscribir = (turnoId: number) => {
    if (window.confirm('¿Estás seguro de que quieres reservar este turno?')) {
      inscribirMutation.mutate(turnoId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Turnos</h1>
      </div>

      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mis-turnos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mis-turnos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mis Turnos Reservados
          </button>
          <button
            onClick={() => setActiveTab('disponibles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'disponibles'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Turnos Disponibles
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'mis-turnos' && (
        <div className="space-y-6">
          <DataTable
            columns={misTurnosColumns}
            data={misTurnos || []}
            loading={loadingMisTurnos}
            searchable={true}
            actions={(row) => (
              <div className="flex gap-2">
                {row.estadoInscripcion === 'CONFIRMADO' ? (
                  <button
                    className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    onClick={() => handleCancelarInscripcion(row.inscripcionId)}
                  >
                    Cancelar
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    {row.estadoInscripcion === 'CANCELADO' ? 'Cancelado' :
                     row.estadoInscripcion === 'ASISTIO' ? 'Asistió' :
                     'Pendiente'}
                  </span>
                )}
              </div>
            )}
          />

          {(!misTurnos || misTurnos.length === 0) && !loadingMisTurnos && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes turnos reservados</h3>
              <p className="text-gray-500">Cuando reserves un turno, aparecerá aquí.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'disponibles' && (
        <div className="space-y-6">
          <DataTable
            columns={turnosDisponiblesColumns}
            data={turnosDisponibles || []}
            loading={loadingTurnosDisponibles}
            searchable={true}
            actions={(row) => (
              <div className="flex gap-2">
                {row.estado === 'ACTIVO' ? (
                  <button
                    className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    onClick={() => handleInscribir(row.id)}
                  >
                    Reservar
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Completo</span>
                )}
              </div>
            )}
          />

          {(!turnosDisponibles || turnosDisponibles.length === 0) && !loadingTurnosDisponibles && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay turnos disponibles</h3>
              <p className="text-gray-500">No hay turnos disponibles para reservar en este momento.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlumnoTurnos;
