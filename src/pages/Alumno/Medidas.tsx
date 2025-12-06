import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { medidasService, Medida } from '../../api/services/medidas';
import { useAuth } from '../../hooks/useAuth';

const AlumnoMedidas: React.FC = () => {
  const { user } = useAuth();

  const { data: medidas, isLoading } = useQuery<Medida[]>({
    queryKey: ['medidas-alumno', user?.id],
    queryFn: () => medidasService.getMedidasAlumno(user?.id || 0),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando medidas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Medidas Corporales</h1>
        <div className="text-sm text-gray-500">
          Seguimiento de tu progreso físico
        </div>
      </div>

      {/* Estadísticas Actuales */}
      {medidas && medidas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="kpi-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Último Peso</p>
                <p className="text-lg font-semibold">
                  {medidas[0].peso} kg
                </p>
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">📏</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Altura</p>
                <p className="text-lg font-semibold">
                  {medidas[0].altura} cm
                </p>
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">IMC</p>
                <p className="text-lg font-semibold">
                  {medidas[0].imc.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">💪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Masa Muscular</p>
                <p className="text-lg font-semibold">
                  {medidas[0].masaMuscular} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial de Medidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Medidas</h3>
        </div>

        {!medidas || medidas.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-2">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-gray-600">Aún no tienes medidas registradas</p>
            <p className="text-sm text-gray-500 mt-1">
              Tus medidas aparecerán aquí cuando el entrenador las registre
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Altura (cm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IMC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grasa (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Muscular (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medidas.map((medida) => (
                  <tr key={medida.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(medida.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medida.peso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medida.altura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        medida.imc < 18.5 ? 'bg-yellow-100 text-yellow-800' :
                        medida.imc < 25 ? 'bg-green-100 text-green-800' :
                        medida.imc < 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {medida.imc.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medida.grasaCorporal}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success">
                      {medida.masaMuscular}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {medida.observaciones || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Consejos */}
      {medidas && medidas.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Consejo del entrenador</h4>
              <p className="text-sm text-blue-800">
                Mantén un registro constante de tus medidas para ver tu progreso. Recuerda que los cambios
                en el cuerpo toman tiempo y consistencia.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumnoMedidas;
