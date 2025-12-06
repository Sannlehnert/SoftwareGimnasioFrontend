import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Pago {
  id: number;
  fecha: string;
  monto: number;
  concepto: string;
  estado: 'PAGADO' | 'PENDIENTE' | 'VENCIDO';
  metodoPago: string;
  fechaVencimiento?: string;
}

const Pagos: React.FC = () => {
  const { data: pagos, isLoading } = useQuery(['pagos-alumno'], async () => {
    // Mock data para pagos del alumno
    return [
      {
        id: 1,
        fecha: '2024-01-15T10:00:00Z',
        monto: 2500,
        concepto: 'Cuota Mensual Enero 2024',
        estado: 'PAGADO' as const,
        metodoPago: 'Transferencia',
      },
      {
        id: 2,
        fecha: '2024-02-15T10:00:00Z',
        monto: 2500,
        concepto: 'Cuota Mensual Febrero 2024',
        estado: 'PAGADO' as const,
        metodoPago: 'Efectivo',
      },
      {
        id: 3,
        fecha: '2024-03-15T10:00:00Z',
        monto: 2500,
        concepto: 'Cuota Mensual Marzo 2024',
        estado: 'PENDIENTE' as const,
        metodoPago: 'Pendiente',
        fechaVencimiento: '2024-03-20T00:00:00Z',
      },
      {
        id: 4,
        fecha: '2024-04-15T10:00:00Z',
        monto: 2500,
        concepto: 'Cuota Mensual Abril 2024',
        estado: 'VENCIDO' as const,
        metodoPago: 'Pendiente',
        fechaVencimiento: '2024-04-20T00:00:00Z',
      },
    ];
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PAGADO':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VENCIDO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'PAGADO':
        return 'Pagado';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'VENCIDO':
        return 'Vencido';
      default:
        return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        <div className="text-sm text-gray-500">
          Historial de pagos realizados
        </div>
      </div>

      {/* Resumen de Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagos Realizados</p>
              <p className="text-lg font-semibold text-green-600">
                {pagos?.filter(p => p.estado === 'PAGADO').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-lg font-semibold text-yellow-600">
                {pagos?.filter(p => p.estado === 'PENDIENTE').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-lg font-semibold text-red-600">
                {pagos?.filter(p => p.estado === 'VENCIDO').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pagos */}
      <div className="kpi-card">
        <h3 className="text-lg font-semibold mb-4">Historial de Pagos</h3>
        <div className="space-y-4">
          {pagos?.map((pago) => (
            <div key={pago.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(pago.estado)}`}>
                      {getEstadoText(pago.estado)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pago.concepto}</p>
                    <p className="text-xs text-gray-500">
                      Fecha: {new Date(pago.fecha).toLocaleDateString('es-AR')}
                      {pago.fechaVencimiento && (
                        <> • Vencimiento: {new Date(pago.fechaVencimiento).toLocaleDateString('es-AR')}</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Método: {pago.metodoPago}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  ${pago.monto.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {(!pagos || pagos.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pagos registrados</h3>
            <p className="text-gray-600">Aún no tienes pagos registrados en el sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagos;
