import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for attendance
const mockAsistencia = [
  {
    id: 1,
    alumno: 'Juan Pérez',
    clase: 'Yoga',
    fecha: '2024-01-15',
    hora: '10:00',
    asistio: true,
    observaciones: 'Llegó puntual'
  },
  {
    id: 2,
    alumno: 'María García',
    clase: 'Spinning',
    fecha: '2024-01-15',
    hora: '11:00',
    asistio: false,
    observaciones: 'Ausente sin aviso'
  },
  {
    id: 3,
    alumno: 'Carlos Rodríguez',
    clase: 'Cross Funcional',
    fecha: '2024-01-15',
    hora: '12:00',
    asistio: true,
    observaciones: 'Buen rendimiento'
  },
  {
    id: 4,
    alumno: 'Ana López',
    clase: 'Yoga',
    fecha: '2024-01-14',
    hora: '10:00',
    asistio: true,
    observaciones: ''
  },
  {
    id: 5,
    alumno: 'Pedro Sánchez',
    clase: 'Spinning',
    fecha: '2024-01-14',
    hora: '11:00',
    asistio: false,
    observaciones: 'Llamó para cancelar'
  }
];

const Asistencia: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [claseFiltro, setClaseFiltro] = useState('');

  // Mock query - replace with actual API service
  const { data: asistencia, isLoading } = useQuery({
    queryKey: ['asistencia'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAsistencia;
    }
  });

  const filteredAsistencia = asistencia?.filter(asist => {
    const matchesSearch = asist.alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asist.clase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFecha = !fechaFiltro || asist.fecha === fechaFiltro;
    const matchesClase = !claseFiltro || asist.clase.toLowerCase().includes(claseFiltro.toLowerCase());
    return matchesSearch && matchesFecha && matchesClase;
  }) || [];

  const handleMarcarAsistencia = () => {
    navigate('/asistencia/marcar');
  };

  const handleEditarAsistencia = (asistenciaId: number) => {
    navigate(`/asistencia/${asistenciaId}/editar`);
  };

  const handleVerHistorial = (alumnoId: string) => {
    navigate(`/asistencia/historial/${alumnoId}`);
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
        <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
        <Button onClick={handleMarcarAsistencia}>
          Marcar Asistencia
        </Button>
      </div>

      {/* KPI Asistencia */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Registros</p>
          <p className="text-2xl font-bold text-blue-600">
            {asistencia?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Presentes Hoy</p>
          <p className="text-2xl font-bold text-green-600">
            {asistencia?.filter(a => a.fecha === new Date().toISOString().split('T')[0] && a.asistio).length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Ausentes Hoy</p>
          <p className="text-2xl font-bold text-red-600">
            {asistencia?.filter(a => a.fecha === new Date().toISOString().split('T')[0] && !a.asistio).length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">% Asistencia Promedio</p>
          <p className="text-2xl font-bold text-purple-600">
            {asistencia?.length ? Math.round((asistencia.filter(a => a.asistio).length / asistencia.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por alumno o clase
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del alumno o clase..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por fecha
            </label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por clase
            </label>
            <input
              type="text"
              value={claseFiltro}
              onChange={(e) => setClaseFiltro(e.target.value)}
              placeholder="Nombre de la clase..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla de asistencia */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
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
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAsistencia.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron registros de asistencia
                  </td>
                </tr>
              ) : (
                filteredAsistencia.map((asist) => (
                  <tr key={asist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asist.alumno}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asist.clase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asist.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asist.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        asist.asistio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {asist.asistio ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asist.observaciones || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerHistorial(asist.alumno)}
                      >
                        Historial
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditarAsistencia(asist.id)}
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

export default Asistencia;
