import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pagosService, Pago } from '../../api/services/pagos';
import { alumnosService } from '../../api/services/alumnos';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDate } from '../../utils/format';

const Cobros: React.FC = () => {
  const [filters, setFilters] = useState({
    desde: '',
    hasta: '',
    alumnoId: '',
  });

  const { data: pagos, isLoading, error } = useQuery({
    queryKey: ['pagos', filters],
    queryFn: () => pagosService.getPagos({
      desde: filters.desde || undefined,
      hasta: filters.hasta || undefined,
      alumnoId: filters.alumnoId ? Number(filters.alumnoId) : undefined,
    }),
  });

  const { data: alumnos } = useQuery({
    queryKey: ['alumnos'],
    queryFn: () => alumnosService.getAlumnos({ limit: 1000 }),
  });

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (pago: Pago) => formatDate(pago.fecha),
    },
    {
      key: 'alumnoNombre',
      label: 'Alumno',
      render: (pago: Pago) => pago.alumnoNombre,
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (pago: Pago) => `$${formatCurrency(pago.monto)}`,
    },
    {
      key: 'metodo',
      label: 'Método',
      render: (pago: Pago) => {
        const metodos = {
          EFECTIVO: 'Efectivo',
          TRANSFERENCIA: 'Transferencia',
          TARJETA: 'Tarjeta',
          MERCADO_PAGO: 'Mercado Pago',
        };
        return metodos[pago.metodo as keyof typeof metodos] || pago.metodo;
      },
    },
    {
      key: 'concepto',
      label: 'Concepto',
      render: (pago: Pago) => pago.concepto,
    },
    {
      key: 'usuarioNombre',
      label: 'Usuario',
      render: (pago: Pago) => pago.usuarioNombre,
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      desde: '',
      hasta: '',
      alumnoId: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cobros y Pagos</h1>
        <p className="text-sm text-gray-500">Componente cargado correctamente</p>
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
              Alumno
            </label>
            <select
              value={filters.alumnoId}
              onChange={(e) => handleFilterChange('alumnoId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos los alumnos</option>
              {alumnos?.data?.map((alumno: any) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre} {alumno.apellido}
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

      {/* Tabla de Pagos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">Error al cargar los pagos. Verifica que estés logueado.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={pagos?.data || []}
            loading={isLoading}
          />
        )}
      </div>

      {/* Resumen */}
      {pagos?.data && pagos.data.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Resumen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                ${formatCurrency(pagos.data.reduce((sum: number, pago: Pago) => sum + pago.monto, 0))}
              </p>
              <p className="text-sm text-gray-600">Total Cobrado</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {pagos.data.length}
              </p>
              <p className="text-sm text-gray-600">Total Pagos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-info">
                ${formatCurrency(
                  pagos.data.length > 0
                    ? pagos.data.reduce((sum: number, pago: Pago) => sum + pago.monto, 0) / pagos.data.length
                    : 0
                )}
              </p>
              <p className="text-sm text-gray-600">Promedio por Pago</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cobros;
