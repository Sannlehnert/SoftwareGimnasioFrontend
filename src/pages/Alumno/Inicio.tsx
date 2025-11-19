import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { useAuth } from '../../hooks/useAuth';

const AlumnoInicio: React.FC = () => {
  const { user } = useAuth();
  const { data: alumno, isLoading } = useQuery({
    queryKey: ['alumno-data', user?.id],
    queryFn: () => alumnosService.getAlumno(user?.id || 0),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mi Espacio</h1>
        <div className="text-sm text-gray-500">
          Bienvenido a MC GYM
        </div>
      </div>

      {/* Estado Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-success/10">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estado</p>
              <p className="text-lg font-semibold text-success">
                {alumno?.estadoPago === 'AL_DIA' ? 'Al día' : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencimiento</p>
              <p className="text-lg font-semibold">
                {alumno ? new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR') : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">💪</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rutina Activa</p>
              <p className="text-lg font-semibold">
                {alumno?.tieneRutinaActiva ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Próxima Clase</p>
              <p className="text-lg font-semibold">
                {alumno?.proximaClase || 'Sin clase'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="kpi-card">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📋</span>
                <span>Ver mi rutina</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">⏰</span>
                <span>Reservar turno</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">💰</span>
                <span>Ver pagos</span>
              </div>
            </button>
          </div>
        </div>

        <div className="kpi-card">
          <h3 className="text-lg font-semibold mb-4">Próximas Actividades</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Cross Funcional</p>
                  <p className="text-sm text-gray-600">Hoy - 18:00 hs</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Confirmado
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Musculación</p>
                  <p className="text-sm text-gray-600">Mañana - 09:00 hs</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Disponible
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoInicio;