import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { informesService } from '../../api/services/informes';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const Informes: React.FC = () => {
  const { addToast } = useToast();
  const [fechaDesde, setFechaDesde] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [fechaHasta, setFechaHasta] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: ingresosMensuales } = useQuery({
    queryKey: ['informes', 'ingresos-mensuales', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeIngresos({ desde: fechaDesde, hasta: fechaHasta })
  });

  const { data: asistencias } = useQuery({
    queryKey: ['informes', 'asistencias', fechaDesde, fechaHasta],
    queryFn: () => informesService.getMapaCalor({ desde: fechaDesde, hasta: fechaHasta })
  });

  const { data: pagosPorMetodo } = useQuery({
    queryKey: ['informes', 'pagos-metodo', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeCobros({ desde: fechaDesde, hasta: fechaHasta })
  });

  const { data: alumnosActivos } = useQuery({
    queryKey: ['informes', 'alumnos-activos', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeIngresos({ desde: fechaDesde, hasta: fechaHasta })
  });

  const { data: clasesPopulares } = useQuery({
    queryKey: ['informes', 'clases-populares', fechaDesde, fechaHasta],
    queryFn: () => informesService.getMapaCalor({ desde: fechaDesde, hasta: fechaHasta })
  });

  const { data: productosVendidos } = useQuery({
    queryKey: ['informes', 'productos-vendidos', fechaDesde, fechaHasta],
    queryFn: () => informesService.getInformeVentas({ desde: fechaDesde, hasta: fechaHasta })
  });

  // Calcular totales
  const totalIngresos = ingresosMensuales?.data?.reduce((sum: number, item: any) => sum + item.monto, 0) || 0;
  const totalAsistencias = asistencias?.data?.reduce((sum: number, item: any) =>
    sum + Object.values(item).filter((val: any) => typeof val === 'number').reduce((a: number, b: number) => a + b, 0), 0
  ) || 0;
  const totalAlumnos = alumnosActivos?.total || 0;
  const totalProductos = productosVendidos?.data?.reduce((sum: number, item: any) => sum + item.cantidad, 0) || 0;

  const handleExportar = async (tipo: string) => {
    try {
      const response = await informesService.generarReportePdf({
        tipo,
        desde: fechaDesde,
        hasta: fechaHasta
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast({
        type: 'success',
        title: 'Informe exportado',
        message: 'El informe se ha descargado correctamente',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al exportar el informe',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Informes y Reportes</h1>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filtros de Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                // Refetch all queries
                window.location.reload();
              }}
              className="w-full"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
          <p className="text-2xl font-bold text-success">
            ${totalIngresos.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Asistencias Totales</p>
          <p className="text-2xl font-bold text-blue-600">
            {totalAsistencias}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Alumnos Activos</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalAlumnos}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Productos Vendidos</p>
          <p className="text-2xl font-bold text-orange-600">
            {totalProductos}
          </p>
        </div>
      </div>

      {/* Gráficos y Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por Método de Pago */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Ingresos por Método de Pago</h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExportar('ingresos-metodo')}
            >
              Exportar
            </Button>
          </div>
          <div className="space-y-3">
            {pagosPorMetodo?.data?.map((metodo: any) => (
              <div key={metodo.metodo} className="flex justify-between items-center">
                <span className="text-sm font-medium">{metodo.metodo}</span>
                <span className="text-sm font-semibold text-success">
                  ${metodo.total.toLocaleString('es-AR')}
                </span>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Clases Más Populares */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Clases Más Populares</h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleExportar('clases-populares')}
            >
              Exportar
            </Button>
          </div>
          <div className="space-y-3">
            {clasesPopulares?.data?.slice(0, 5).map((clase: any) => (
              <div key={clase.id} className="flex justify-between items-center">
                <span className="text-sm font-medium">{clase.nombre}</span>
                <span className="text-sm text-gray-600">{clase.inscripciones} inscritos</span>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Productos Más Vendidos</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleExportar('productos-vendidos')}
          >
            Exportar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Vendida
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos Totales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productosVendidos?.data?.map((producto: any) => (
                <tr key={producto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {producto.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-success font-semibold">
                    ${producto.total.toLocaleString('es-AR')}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Informes;
