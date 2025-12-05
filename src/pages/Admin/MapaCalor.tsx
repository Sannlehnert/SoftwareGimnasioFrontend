import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { formatDate } from '../../utils/format';

interface AlumnoHeatMap {
  id: number;
  nombre: string;
  apellido: string;
  estado: string;
  ultimaAsistencia: string;
  diasDesdeUltimaAsistencia: number;
  intensidad: 'alta' | 'media' | 'baja' | 'ninguna';
}

const MapaCalor: React.FC = () => {
  const [filters, setFilters] = useState({
    desde: '',
    hasta: '',
  });
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');

  const { data: alumnos, isLoading, error } = useQuery({
    queryKey: ['alumnos', 'heatmap'],
    queryFn: () => alumnosService.getAlumnos({ limit: 1000 }),
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      desde: '',
      hasta: '',
    });
  };

  const getHeatMapData = (): AlumnoHeatMap[] => {
    if (!alumnos?.data) return [];

    return alumnos.data.map((alumno: any) => {
      // Simular última asistencia (en producción vendría del backend)
      const diasAleatorios = Math.floor(Math.random() * 60); // 0-60 días atrás
      const ultimaAsistencia = new Date(Date.now() - diasAleatorios * 24 * 60 * 60 * 1000);

      let intensidad: 'alta' | 'media' | 'baja' | 'ninguna' = 'ninguna';

      if (alumno.estado === 'SUSPENDIDO') {
        intensidad = 'ninguna';
      } else if (alumno.estado === 'INACTIVO') {
        intensidad = 'baja';
      } else if (diasAleatorios <= 7) {
        intensidad = 'alta';
      } else if (diasAleatorios <= 14) {
        intensidad = 'media';
      } else if (diasAleatorios <= 30) {
        intensidad = 'baja';
      } else {
        intensidad = 'ninguna';
      }

      return {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        estado: alumno.estado,
        ultimaAsistencia: ultimaAsistencia.toISOString(),
        diasDesdeUltimaAsistencia: diasAleatorios,
        intensidad,
      };
    });
  };

  const getIntensidadColor = (intensidad: string, estado: string) => {
    if (estado === 'SUSPENDIDO') return 'bg-red-500';
    if (estado === 'INACTIVO') return 'bg-yellow-500';

    switch (intensidad) {
      case 'alta': return 'bg-green-500';
      case 'media': return 'bg-green-300';
      case 'baja': return 'bg-yellow-300';
      default: return 'bg-gray-300';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return 'text-green-600';
      case 'INACTIVO': return 'text-yellow-600';
      case 'SUSPENDIDO': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const heatMapData = getHeatMapData();

  const stats = {
    totalAlumnos: heatMapData.length,
    activos: heatMapData.filter(a => a.estado === 'ACTIVO').length,
    inactivos: heatMapData.filter(a => a.estado === 'INACTIVO').length,
    suspendidos: heatMapData.filter(a => a.estado === 'SUSPENDIDO').length,
    altaActividad: heatMapData.filter(a => a.intensidad === 'alta').length,
    mediaActividad: heatMapData.filter(a => a.intensidad === 'media').length,
    bajaActividad: heatMapData.filter(a => a.intensidad === 'baja').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mapa de Calor de Alumnos</h1>
        <p className="text-sm text-gray-500">Visualización de actividad estudiantil</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filtros de Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={filters.desde}
              onChange={(e) => handleFilterChange('desde', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={filters.hasta}
              onChange={(e) => handleFilterChange('hasta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAlumnos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inactivos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspendidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspendidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Leyenda de Intensidad</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Alta actividad (≤7 días)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
            <span className="text-sm">Media actividad (8-14 días)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
            <span className="text-sm">Baja actividad (15-30 días)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
            <span className="text-sm">Sin actividad ({'>'}30 días)</span>
          </div>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">Error al cargar los datos del mapa de calor. Verifica que estés logueado.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Mapa de Calor</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Vista Compacta
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'detailed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Vista Detallada
                </button>
              </div>
            </div>

            {viewMode === 'compact' ? (
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                {heatMapData.map((alumno) => (
                  <div
                    key={alumno.id}
                    className={`aspect-square rounded-lg border-2 border-white shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer relative group ${getIntensidadColor(alumno.intensidad, alumno.estado)}`}
                    title={`${alumno.nombre} ${alumno.apellido} - ${alumno.estado}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm drop-shadow-lg">
                        {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                      </span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-semibold">{alumno.nombre} {alumno.apellido}</div>
                      <div className="text-gray-300">Estado: {alumno.estado}</div>
                      <div className="text-gray-300">Última asistencia: {formatDate(alumno.ultimaAsistencia)}</div>
                      <div className="text-gray-300">{alumno.diasDesdeUltimaAsistencia} días atrás</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {heatMapData.map((alumno) => (
                  <div
                    key={alumno.id}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:scale-105 ${getIntensidadColor(alumno.intensidad, alumno.estado)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {alumno.nombre} {alumno.apellido}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(alumno.estado)} bg-opacity-20`}>
                        {alumno.estado}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Última asistencia: {formatDate(alumno.ultimaAsistencia)}</p>
                      <p>{alumno.diasDesdeUltimaAsistencia} días atrás</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabla Detallada */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Lista Detallada</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alumno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días sin Asistir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intensidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heatMapData.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {alumno.nombre} {alumno.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(alumno.estado)} bg-opacity-20`}>
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(alumno.ultimaAsistencia)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alumno.diasDesdeUltimaAsistencia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-block w-3 h-3 rounded-full ${getIntensidadColor(alumno.intensidad, alumno.estado)}`}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCalor;
