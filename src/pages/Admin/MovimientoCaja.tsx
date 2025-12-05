import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cajaService } from '../../api/services/caja';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDate } from '../../utils/format';
import { useToast } from '../../context/ToastProvider';

const MovimientoCaja: React.FC = () => {
  const { addToast } = useToast();
  const [filters, setFilters] = useState({
    fecha: new Date().toISOString().split('T')[0],
  });

  const { data: movimientos, isLoading } = useQuery({
    queryKey: ['movimientos-caja', filters],
    queryFn: () => cajaService.getMovimientos({ fecha: filters.fecha }),
  });

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (movimiento: any) => formatDate(movimiento.fecha),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (movimiento: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          movimiento.tipo === 'INGRESO'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {movimiento.tipo}
        </span>
      ),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (movimiento: any) => `$${formatCurrency(movimiento.monto)}`,
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (movimiento: any) => movimiento.descripcion,
    },
    {
      key: 'metodoPago',
      label: 'Método',
      render: (movimiento: any) => movimiento.metodoPago,
    },
    {
      key: 'usuarioNombre',
      label: 'Usuario',
      render: (movimiento: any) => movimiento.usuarioNombre,
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const totalIngresos = movimientos?.data?.filter((m: any) => m.tipo === 'INGRESO').reduce((sum: number, m: any) => sum + m.monto, 0) || 0;
  const totalEgresos = movimientos?.data?.filter((m: any) => m.tipo === 'EGRESO').reduce((sum: number, m: any) => sum + m.monto, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Movimientos de Caja</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={filters.fecha}
              onChange={(e) => handleFilterChange('fecha', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ${formatCurrency(totalIngresos)}
            </p>
            <p className="text-sm text-gray-600">Total Ingresos</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              ${formatCurrency(totalEgresos)}
            </p>
            <p className="text-sm text-gray-600">Total Egresos</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              ${formatCurrency(totalIngresos - totalEgresos)}
            </p>
            <p className="text-sm text-gray-600">Balance</p>
          </div>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={movimientos?.data || []}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default MovimientoCaja;
