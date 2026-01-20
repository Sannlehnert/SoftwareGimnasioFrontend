import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { medidasService } from '../../api/services/medidas';

interface Medida {
  id: number;
  alumnoId: number;
  alumno: string;
  fecha: string;
  peso: number;
  altura: number;
  imc: number;
  grasaCorporal: number;
  masaMuscular: number;
  observaciones: string;
}

// Mock data for measurements - replace with actual API call
const mockMedidas: Medida[] = [
  {
    id: 1,
    alumnoId: 1,
    alumno: 'Juan Pérez',
    fecha: '2024-01-15',
    peso: 75.5,
    altura: 175,
    imc: 24.7,
    grasaCorporal: 18.5,
    masaMuscular: 65.2,
    observaciones: 'Buen progreso en masa muscular'
  },
  {
    id: 2,
    alumnoId: 2,
    alumno: 'María García',
    fecha: '2024-01-15',
    peso: 62.3,
    altura: 168,
    imc: 22.1,
    grasaCorporal: 22.0,
    masaMuscular: 48.5,
    observaciones: 'Manteniendo buen nivel'
  },
  {
    id: 3,
    alumnoId: 3,
    alumno: 'Carlos Rodríguez',
    fecha: '2024-01-14',
    peso: 82.1,
    altura: 180,
    imc: 25.3,
    grasaCorporal: 20.2,
    masaMuscular: 70.8,
    observaciones: 'Necesita reducir grasa corporal'
  }
];

const Medidas: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // API query for measurements
  const { data: medidas, isLoading } = useQuery<Medida[]>({
    queryKey: ['medidas'],
    queryFn: () => medidasService.getMedidas()
  });

  const filteredMedidas = medidas?.filter(medida =>
    medida.alumno.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNuevaMedida = () => {
    navigate('/medidas/nueva');
  };

  const handleVerHistorial = (alumnoId: number) => {
    navigate(`/medidas/historial/${alumnoId}`);
  };

  const handleEditarMedida = (medidaId: number) => {
    navigate(`/medidas/${medidaId}/editar`);
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
        <h1 className="text-2xl font-bold text-gray-900">Medidas Corporales</h1>
        <Button onClick={handleNuevaMedida}>
          Nueva Medida
        </Button>
      </div>

      {/* KPI Medidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Medidas</p>
          <p className="text-2xl font-bold text-blue-600">
            {medidas?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Alumnos Medidos</p>
          <p className="text-2xl font-bold text-green-600">
            {new Set(medidas?.map(m => m.alumno)).size || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">IMC Promedio</p>
          <p className="text-2xl font-bold text-purple-600">
            {medidas?.length ? (medidas.reduce((sum, m) => sum + m.imc, 0) / medidas.length).toFixed(1) : '0'}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Medidas Esta Semana</p>
          <p className="text-2xl font-bold text-success">
            {medidas?.filter(m => {
              const fecha = new Date(m.fecha);
              const semanaPasada = new Date();
              semanaPasada.setDate(semanaPasada.getDate() - 7);
              return fecha >= semanaPasada;
            }).length || 0}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar medidas por alumno
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del alumno..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla de medidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedidas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron medidas
                  </td>
                </tr>
              ) : (
                filteredMedidas.map((medida) => (
                  <tr key={medida.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {medida.alumno}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medida.observaciones}
                      </div>
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerHistorial(medida.alumnoId)}
                      >
                        Historial
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditarMedida(medida.id)}
                      >
                        Editar
                      </Button>
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

export default Medidas;
