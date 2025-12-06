import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { informesService } from '../../api/services/informes';
import { productosService } from '../../api/services/productos';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDate } from '../../utils/format';
import { useToast } from '../../context/ToastProvider';

const InformeVentas: React.FC = () => {
  const { addToast } = useToast();
  const [filters, setFilters] = useState<{
    desde: string;
    hasta: string;
    productoId: string;
  }>({
    desde: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().split('T')[0];
    })(),
    hasta: new Date().toISOString().split('T')[0],
    productoId: '',
  });

  const { data: ventas, isLoading } = useQuery({
    queryKey: ['ventas', filters],
    queryFn: () => informesService.getInformeVentas({
      desde: filters.desde,
      hasta: filters.hasta,
      ...(filters.productoId ? { productoId: Number(filters.productoId) } : {}),
    }),
  });

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: () => productosService.getProductos({}),
  });

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (venta: any) => formatDate(venta.fecha),
    },
    {
      key: 'productoNombre',
      label: 'Producto',
      render: (venta: any) => venta.productoNombre,
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      render: (venta: any) => venta.cantidad,
    },
    {
      key: 'precioUnitario',
      label: 'Precio Unitario',
      render: (venta: any) => `$${formatCurrency(venta.precioUnitario)}`,
    },
    {
      key: 'total',
      label: 'Total',
      render: (venta: any) => `$${formatCurrency(venta.total)}`,
    },
    {
      key: 'alumnoNombre',
      label: 'Cliente',
      render: (venta: any) => venta.alumnoNombre || 'Cliente General',
    },
    {
      key: 'usuarioNombre',
      label: 'Vendedor',
      render: (venta: any) => venta.usuarioNombre,
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      desde: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
      })(),
      hasta: new Date().toISOString().split('T')[0],
      productoId: '',
    });
  };

  const handleExportar = async () => {
    try {
      const response = await informesService.generarReportePdf({
        tipo: 'ventas',
        desde: filters.desde,
        hasta: filters.hasta,
        ...(filters.productoId ? { productoId: Number(filters.productoId) } : {}),
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe-ventas-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast({
        type: 'success',
        title: 'Informe exportado',
        message: 'El informe de ventas se ha descargado correctamente',
      });
    } catch (error: any) {
      console.error('Error al exportar PDF:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Error al exportar el informe de ventas',
      });
    }
  };

  const totalVentas = ventas?.data?.reduce((sum: number, venta: any) => sum + venta.total, 0) || 0;
  const totalProductos = ventas?.data?.reduce((sum: number, venta: any) => sum + venta.cantidad, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Informe de Ventas</h1>
        <Button onClick={handleExportar} className="bg-green-600 hover:bg-green-700">
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <select
              value={filters.productoId}
              onChange={(e) => handleFilterChange('productoId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los productos</option>
              {productos?.data?.map((producto: any) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${formatCurrency(totalVentas)}
            </p>
            <p className="text-sm text-gray-600">Total de Ventas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalProductos}
            </p>
            <p className="text-sm text-gray-600">Productos Vendidos</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {ventas?.data?.length || 0}
            </p>
            <p className="text-sm text-gray-600">Transacciones</p>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={ventas?.data || []}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default InformeVentas;
