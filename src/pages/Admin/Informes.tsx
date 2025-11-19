import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { informesService } from '../../api/services/informes';
import Button from '../../components/ui/Button';

const Informes: React.FC = () => {
  const [fechaDesde, setFechaDesde] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [fechaHasta, setFechaHasta] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [tipoInforme, setTipoInforme] = useState<'cobros' | 'ingresos' | 'asistencia' | 'ventas'>('cobros');

  const { data: informeCobros, isLoading: loadingCobros } = useQuery({
    queryKey: ['informe-cobros', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeCobros({ desde: fechaDesde, hasta: fechaHasta }),
    enabled: tipoInforme === 'cobros'
  });

  const { data: informeIngresos, isLoading: loadingIngresos } = useQuery({
    queryKey: ['informe-ingresos', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeIngresos({ desde: fechaDesde, hasta: fechaHasta }),
    enabled: tipoInforme === 'ingresos'
  });

  const { data: mapaCalor, isLoading: loadingMapaCalor } = useQuery({
    queryKey: ['mapa-calor', fechaDesde, fechaHasta],
    queryFn: () => informesService.getMapaCalor({ desde: fechaDesde, hasta: fechaHasta }),
    enabled: tipoInforme === 'asistencia'
  });

  const { data: informeVentas, isLoading: loadingVentas } = useQuery({
    queryKey: ['informe-ventas', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeVentas({ desde: fechaDesde, hasta: fechaHasta }),
    enabled: tipoInforme === 'ventas'
  });

  const isLoading = loadingCobros || loadingIngresos || loadingMapaCalor || loadingVentas;

  const generarReportePdf = async () => {
    try {
      const blob = await informesService.generarReportePdf({
        tipo: tipoInforme,
        desde: fechaDesde,
        hasta: fechaHasta,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe-${tipoInforme}-${fechaDesde}-${fechaHasta}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  const renderInformeCobros = () => {
    if (!informeCobros) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Total Recaudado</p>
            <p className="text-2xl font-bold text-success">
              ${informeCobros.totalRecaudado?.toLocaleString('es-AR')}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Cobros Realizados</p>
            <p className="text-2xl font-bold">{informeCobros.totalCobros}</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Promedio por Cobro</p>
            <p className="text-2xl font-bold">
              ${informeCobros.promedioCobro?.toLocaleString('es-AR')}
            </p>
          </div>
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Días con Cobros</p>
            <p className="text-2xl font-bold">{informeCobros.diasConCobros}</p>
          </div>
        </div>

        {/* Gráfico simplificado */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold mb-4">Cobros por Día</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de cobros por día</p>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="kpi-card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Método de Pago</h3>
          <div className="space-y-2">
            {informeCobros.metodosPago?.map((metodo: any) => (
              <div key={metodo.metodo} className="flex justify-between items-center">
                <span className="capitalize">{metodo.metodo.toLowerCase()}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(metodo.monto / informeCobros.totalRecaudado) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    ${metodo.monto.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMapaCalor = () => {
    if (!mapaCalor) return null;

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const horas = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 a 21:00

    const getColorIntensity = (count: number, maxCount: number) => {
      if (count === 0) return 'bg-gray-100';
      const intensity = Math.floor((count / maxCount) * 5);
      const colors = [
        'bg-green-100',
        'bg-green-200',
        'bg-green-300',
        'bg-green-400',
        'bg-green-500',
        'bg-green-600',
      ];
      return colors[Math.min(intensity, 5)];
    };

    const maxCount = Math.max(...mapaCalor.data.map((item: any) => item.count));

    return (
      <div className="space-y-6">
        <div className="kpi-card">
          <h3 className="text-lg font-semibold mb-4">Mapa de Calor - Asistencia por Horario</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-sm font-medium text-gray-600">Hora/Día</th>
                  {dias.map(dia => (
                    <th key={dia} className="p-2 text-sm font-medium text-gray-600 text-center">
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map(hora => (
                  <tr key={hora}>
                    <td className="p-2 text-sm font-medium text-gray-600 text-center">
                      {hora}:00
                    </td>
                    {dias.map((dia, diaIndex) => {
                      const data = mapaCalor.data.find(
                        (item: any) => item.dia === dia && item.hora === `${hora}:00`
                      );
                      const count = data?.count || 0;
                      return (
                        <td
                          key={diaIndex}
                          className={`p-2 text-center text-xs ${getColorIntensity(count, maxCount)} ${
                            count > 0 ? 'text-white' : 'text-gray-400'
                          }`}
                          title={`${dia} ${hora}:00 - ${count} asistencias`}
                        >
                          {count > 0 ? count : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Hora Pico</p>
            <p className="text-xl font-bold">{mapaCalor.horaPico?.hora || '-'}</p>
            <p className="text-sm text-gray-500">{mapaCalor.horaPico?.count || 0} asistencias</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Día Más Concurrido</p>
            <p className="text-xl font-bold">{mapaCalor.diaPico?.dia || '-'}</p>
            <p className="text-sm text-gray-500">{mapaCalor.diaPico?.count || 0} asistencias</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
            <p className="text-xl font-bold">{mapaCalor.promedioDiario || 0}</p>
            <p className="text-sm text-gray-500">asistencias por día</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Informes y Analytics</h1>
        <Button onClick={generarReportePdf} disabled={isLoading}>
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <div className="kpi-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Informe
            </label>
            <select
              value={tipoInforme}
              onChange={(e) => setTipoInforme(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="cobros">Cobros y Pagos</option>
              <option value="ingresos">Ingresos</option>
              <option value="asistencia">Asistencia</option>
              <option value="ventas">Ventas de Productos</option>
            </select>
          </div>
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
          <div className="flex items-end">
            <Button
              onClick={() => {
                // Re-fetch data
                window.location.reload();
              }}
              className="w-full"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido del Informe */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Generando informe...</span>
            </div>
          </div>
        ) : (
          <>
            {tipoInforme === 'cobros' && renderInformeCobros()}
            {tipoInforme === 'asistencia' && renderMapaCalor()}
            {tipoInforme === 'ingresos' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Informe de ingresos en desarrollo...</p>
              </div>
            )}
            {tipoInforme === 'ventas' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Informe de ventas en desarrollo...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Informes;