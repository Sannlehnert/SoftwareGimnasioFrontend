import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';

// Mock data for history - replace with actual API
const mockHistorialData = [
  {
    id: 1,
    fecha: '2024-01-01',
    peso: 78.0,
    altura: 175,
    imc: 25.5,
    grasaCorporal: 20.0,
    masaMuscular: 62.0,
    observaciones: 'Inicio del programa'
  },
  {
    id: 2,
    fecha: '2024-01-08',
    peso: 76.8,
    altura: 175,
    imc: 25.1,
    grasaCorporal: 19.5,
    masaMuscular: 63.2,
    observaciones: 'Primera semana, buen progreso'
  },
  {
    id: 3,
    fecha: '2024-01-15',
    peso: 75.5,
    altura: 175,
    imc: 24.7,
    grasaCorporal: 18.5,
    masaMuscular: 65.2,
    observaciones: 'Buen progreso en masa muscular'
  }
];

const HistorialMedidas: React.FC = () => {
  const { alumnoId } = useParams<{ alumnoId: string }>();
  const navigate = useNavigate();

  // Mock query - replace with actual API service
  const { data: historial, isLoading } = useQuery({
    queryKey: ['historial-medidas', alumnoId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockHistorialData;
    },
    enabled: !!alumnoId
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Historial de Medidas</h1>
        <Button variant="secondary" onClick={() => navigate('/medidas')}>
          ← Volver
        </Button>
      </div>

      {/* Gráfico de progreso */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Progreso a lo largo del tiempo</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Gráfico de progreso próximamente</p>
        </div>
      </div>

      {/* Tabla de historial */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              {historial?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay medidas registradas
                  </td>
                </tr>
              ) : (
                historial?.map((medida) => (
                  <tr key={medida.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(medida.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {medida.peso} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medida.altura} cm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        medida.imc < 18.5 ? 'bg-yellow-100 text-yellow-800' :
                        medida.imc < 25 ? 'bg-green-100 text-green-800' :
                        medida.imc < 30 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {medida.imc}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medida.grasaCorporal}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success">
                      {medida.masaMuscular} kg
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {medida.observaciones}
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

export default HistorialMedidas;
