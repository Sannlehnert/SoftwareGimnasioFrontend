import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { alumnosService } from '../../api/services/alumnos';
import { useAuth } from '../../hooks/useAuth';

const AlumnoInicio: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: alumno, isLoading } = useQuery({
    queryKey: ['alumno-data', user?.id],
    queryFn: () => alumnosService.getAlumno(user?.id || 0),
    enabled: !!user?.id
  });

  const handleVerRutina = () => {
    navigate('/rutina');
  };

  const handleReservarTurno = () => {
    navigate('/turnos');
  };

  const handleVerPagos = () => {
    navigate('/pagos');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg text-gray-600">Cargando tu espacio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con mensaje motivacional */}
      <div className="text-center py-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Hola, {user?.nombre?.split(' ')[0]}! 👋</h1>
        <p className="text-lg text-gray-600">Bienvenido a tu espacio en MC GYM</p>
        <p className="text-sm text-primary-600 font-medium mt-2">¡Cada día es una oportunidad para ser mejor!</p>
      </div>

      {/* Estado Actual - Más visual y atractivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className={`p-4 rounded-full ${alumno?.estadoPago === 'AL_DIA' ? 'bg-green-100 animate-pulse' : 'bg-red-100'}`}>
              <span className="text-3xl">{alumno?.estadoPago === 'AL_DIA' ? '✅' : '⚠️'}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estado de Pago</p>
              <p className={`text-xl font-bold ${alumno?.estadoPago === 'AL_DIA' ? 'text-green-600' : 'text-red-600'}`}>
                {alumno?.estadoPago === 'AL_DIA' ? 'Al día' : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-blue-100">
              <span className="text-3xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencimiento</p>
              <p className="text-xl font-bold text-blue-600">
                {alumno ? new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR') : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className={`p-4 rounded-full ${alumno?.tieneRutinaActiva ? 'bg-purple-100 animate-bounce' : 'bg-gray-100'}`}>
              <span className="text-3xl">💪</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rutina Activa</p>
              <p className={`text-xl font-bold ${alumno?.tieneRutinaActiva ? 'text-purple-600' : 'text-gray-600'}`}>
                {alumno?.tieneRutinaActiva ? '¡Activa!' : 'Sin rutina'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-4 rounded-full bg-orange-100">
              <span className="text-3xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Próxima Clase</p>
              <p className="text-xl font-bold text-orange-600">
                {alumno?.proximaClase || 'Sin clase'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso motivacional */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tu Progreso Semanal</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Asistencia a clases</span>
              <span>4/5 días</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Objetivos cumplidos</span>
              <span>3/4 metas</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 italic">¡Estás haciendo un gran trabajo! Sigue así 💪</p>
      </div>

      {/* Acciones Rápidas - Más prominentes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={handleVerRutina}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">📋</span>
            <h3 className="text-xl font-bold mb-2">Ver Mi Rutina</h3>
            <p className="text-purple-100">Accede a tus ejercicios personalizados</p>
          </div>
        </button>

        <button
          onClick={handleReservarTurno}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">⏰</span>
            <h3 className="text-xl font-bold mb-2">Reservar Turno</h3>
            <p className="text-blue-100">Agenda tu próxima clase</p>
          </div>
        </button>

        <button
          onClick={handleVerPagos}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-center">
            <span className="text-4xl mb-3 block">💰</span>
            <h3 className="text-xl font-bold mb-2">Ver Pagos</h3>
            <p className="text-green-100">Revisa tu estado de cuenta</p>
          </div>
        </button>
      </div>

      {/* Próximas Actividades */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Próximas Actividades</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center">
              <span className="text-2xl mr-4">🏃‍♂️</span>
              <div>
                <p className="font-bold text-gray-900">Cross Funcional</p>
                <p className="text-sm text-gray-600">Hoy - 18:00 hs</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
              ✅ Confirmado
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <span className="text-2xl mr-4">🏋️‍♂️</span>
              <div>
                <p className="font-bold text-gray-900">Musculación</p>
                <p className="text-sm text-gray-600">Mañana - 09:00 hs</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
              📅 Disponible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoInicio;