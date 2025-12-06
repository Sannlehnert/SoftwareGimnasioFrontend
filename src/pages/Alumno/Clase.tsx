import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { turnosService } from '../../api/services/turnos';

const AlumnoClase: React.FC = () => {
  const { user } = useAuth();

  const { data: turnos, isLoading } = useQuery({
    queryKey: ['mis-turnos', user?.id],
    queryFn: turnosService.getMisTurnos,
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const clasesHoy = turnos?.filter((turno: any) => {
    const hoy = new Date().toDateString();
    const fechaTurno = new Date(turno.fecha).toDateString();
    return fechaTurno === hoy && turno.estadoInscripcion === 'CONFIRMADO';
  }) || [];

  const proximasClases = turnos?.filter((turno: any) => {
    const hoy = new Date();
    const fechaTurno = new Date(turno.fecha);
    return fechaTurno > hoy && turno.estadoInscripcion === 'CONFIRMADO';
  }).slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>
      </div>

      {/* Clases de Hoy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Clases de Hoy</h2>

        {clasesHoy.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <p className="text-gray-500">No tienes clases programadas para hoy</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clasesHoy.map((turno: any) => (
              <div key={turno.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-900">{turno.clase.nombre}</h3>
                    <p className="text-green-700">{turno.clase.descripcion}</p>
                    <div className="mt-2 text-sm text-green-600">
                      <span>🏋️ {turno.clase.profesor}</span>
                      <span className="mx-2">•</span>
                      <span>⏰ {turno.horaInicio} - {turno.horaFin}</span>
                      <span className="mx-2">•</span>
                      <span>📍 {turno.clase.sala}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Hoy
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas Clases */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Clases</h2>

        {proximasClases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <p className="text-gray-500">No tienes clases programadas próximamente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proximasClases.map((turno: any) => (
              <div key={turno.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900">{turno.clase.nombre}</h3>
                    <p className="text-blue-700">{turno.clase.descripcion}</p>
                    <div className="mt-2 text-sm text-blue-600">
                      <span>🏋️ {turno.clase.profesor}</span>
                      <span className="mx-2">•</span>
                      <span>📅 {new Date(turno.fecha).toLocaleDateString('es-AR')}</span>
                      <span className="mx-2">•</span>
                      <span>⏰ {turno.horaInicio} - {turno.horaFin}</span>
                      <span className="mx-2">•</span>
                      <span>📍 {turno.clase.sala}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Próxima
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {turnos?.filter((t: any) => t.estadoInscripcion === 'COMPLETADO').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Programadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {turnos?.filter((t: any) => t.estadoInscripcion === 'CONFIRMADO').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clases Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {turnos?.filter((t: any) => t.estadoInscripcion === 'PENDIENTE').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoClase;
