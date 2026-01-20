import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { asistenciaService, AsistenciaRecord } from '../../api/services/asistencia';

const HistorialAsistencia: React.FC = () => {
  const { alumnoId } = useParams<{ alumnoId: string }>();
  const navigate = useNavigate();
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // API query for attendance history
  const { data: historial, isLoading } = useQuery({
    queryKey: ['historial-asistencia', alumnoId, fechaDesde, fechaHasta],
    queryFn: async (): Promise<AsistenciaRecord[]> => {
      if (!alumnoId) throw new Error('ID de alumno requerido');
      const params: any = {};
      if (fechaDesde) params.desde = fechaDesde;
      if (fechaHasta) params.hasta = fechaHasta;
      return await asistenciaService.getAsistenciaAlumno(parseInt(alumnoId), params);
    }
  });

  const filteredHistorial = historial?.filter(item => {
    const fechaItem = new Date(item.fecha);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    if (desde && fechaItem < desde) return false;
    if (hasta && fechaItem > hasta) return false;
    return true;
  }) || [];

  const totalClases = filteredHistorial.length;
  const clasesAsistidas = filteredHistorial.filter(item => item.asistio).length;
  const porcentajeAsistencia = totalClases > 0 ? Math.round((clasesAsistidas / totalClases) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Asistencia</h1>
        <Button variant="secondary" onClick={() => navigate('/asistencia')}>
          Volver
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total de Clases</p>
          <p className="text-2xl font-bold text-blue-600">{totalClases}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Clases Asistidas</p>
          <p className="text-2xl font-bold text-green-600">{clasesAsistidas}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">% de Asistencia</p>
          <p className="text-2xl font-bold text-purple-600">{porcentajeAsistencia}%</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
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
                  Clase
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistorial.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron registros en el período seleccionado
                  </td>
                </tr>
              ) : (
                filteredHistorial.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.clase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.asistio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.asistio ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.observaciones || '-'}
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

export default HistorialAsistencia;
