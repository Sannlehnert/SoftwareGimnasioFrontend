import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { rutinasService } from '../../api/services/rutinas';

const AlumnoRutina: React.FC = () => {
  const { user } = useAuth();

  const { data: rutina, isLoading } = useQuery({
    queryKey: ['mi-rutina', user?.id],
    queryFn: () => rutinasService.getRutina(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!rutina) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mi Rutina</h1>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes rutina asignada</h3>
          <p className="text-gray-500">Tu entrenador te asignará una rutina pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mi Rutina</h1>
        <div className="text-sm text-gray-600">
          Última actualización: {new Date(rutina.fechaAsignacion).toLocaleDateString('es-AR')}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{rutina.nombre}</h2>
          <p className="text-gray-600">{rutina.descripcion}</p>
        </div>

        <div className="space-y-6">
          {rutina.ejercicios?.map((ejercicio: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">{index + 1}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{ejercicio.nombre}</h3>
                  <p className="text-gray-600 mb-3">{ejercicio.descripcion}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Series:</span>
                      <span className="ml-2 text-gray-900">{ejercicio.series}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Repeticiones:</span>
                      <span className="ml-2 text-gray-900">{ejercicio.repeticiones}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Peso:</span>
                      <span className="ml-2 text-gray-900">{ejercicio.peso || 'Sin peso'} kg</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Descanso:</span>
                      <span className="ml-2 text-gray-900">{ejercicio.descanso || '60'}s</span>
                    </div>
                  </div>

                  {ejercicio.notas && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Notas:</span> {ejercicio.notas}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rutina.notas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Notas del entrenador</h3>
          <p className="text-blue-800">{rutina.notas}</p>
        </div>
      )}
    </div>
  );
};

export default AlumnoRutina;
