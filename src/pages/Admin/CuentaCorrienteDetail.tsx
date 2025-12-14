import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { pagosService } from '../../api/services/pagos';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const CuentaCorrienteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'resumen' | 'movimientos'>('resumen');

  const { data: alumno, isLoading: loadingAlumno } = useQuery({
    queryKey: ['alumno', id],
    queryFn: () => alumnosService.getAlumno(Number(id)),
    enabled: !!id
  });

  const { data: pagos, isLoading: loadingPagos } = useQuery({
    queryKey: ['pagos', id],
    queryFn: () => pagosService.getPagos({ alumnoId: Number(id), limit: 100 }),
    enabled: !!id
  });

  const calcularSaldo = () => {
    if (!pagos?.data) return 0;
    return pagos.data.reduce((total: number, pago: any) => total + pago.monto, 0);
  };

  const calcularEstadoCuenta = () => {
    const saldo = calcularSaldo();
    const hoy = new Date();
    const vencimiento = new Date(alumno?.fechaVencimiento || Date.now());
    const diffDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (saldo < 0) {
      return { estado: 'DEUDOR', color: 'text-error', bgColor: 'bg-error/10' };
    } else if (diffDias < 0) {
      return { estado: 'VENCIDO', color: 'text-warning', bgColor: 'bg-warning/10' };
    } else if (diffDias <= 7) {
      return { estado: 'POR VENCER', color: 'text-warning', bgColor: 'bg-warning/10' };
    } else {
      return { estado: 'AL DÍA', color: 'text-success', bgColor: 'bg-success/10' };
    }
  };

  if (loadingAlumno || loadingPagos) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Alumno no encontrado</h2>
        <Button onClick={() => navigate('/cuenta-corriente')}>Volver a Cuenta Corriente</Button>
      </div>
    );
  }

  const saldo = calcularSaldo();
  const estadoCuenta = calcularEstadoCuenta();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cuenta Corriente - {alumno.nombre} {alumno.apellido}
          </h1>
          <p className="text-gray-600">DNI: {alumno.dni}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/pagos/nuevo?alumnoId=${alumno.id}`)}
            className="bg-green-600 hover:bg-green-700"
          >
            Registrar Pago
          </Button>
          <Button onClick={() => navigate('/cuenta-corriente')} variant="secondary">
            ← Volver
          </Button>
        </div>
      </div>

      {/* Estado de Cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Saldo Actual</p>
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-success' : 'text-error'}`}>
            ${saldo.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Estado de Cuenta</p>
          <p className={`text-lg font-bold ${estadoCuenta.color}`}>{estadoCuenta.estado}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Próximo Vencimiento</p>
          <p className="text-lg font-bold">
            {new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR')}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Estado del Alumno</p>
          <span className={`px-3 py-1 text-sm rounded-full ${
            alumno.estado === 'ACTIVO' ? 'bg-success/10 text-success' :
            alumno.estado === 'SUSPENDIDO' ? 'bg-warning/10 text-warning' :
            'bg-error/10 text-error'
          }`}>
            {alumno.estado}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'resumen', label: 'Resumen' },
            { key: 'movimientos', label: 'Movimientos' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Información del Alumno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                    <p className="text-gray-900">{alumno.nombre} {alumno.apellido}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">DNI</label>
                    <p className="text-gray-900">{alumno.dni}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{alumno.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Plan</label>
                    <p className="text-gray-900">{alumno.plan}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alumno.estado === 'ACTIVO' ? 'bg-success/10 text-success' :
                      alumno.estado === 'SUSPENDIDO' ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    }`}>
                      {alumno.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                    <p className="text-gray-900">
                      {new Date(alumno.fechaIngreso || Date.now()).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Próximo Vencimiento</label>
                    <p className={`font-medium ${estadoCuenta.color}`}>
                      {new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Pagos Realizados</label>
                    <p className="text-gray-900">{pagos?.data?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Pagos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resumen de Pagos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Total Pagado</h4>
                  <p className="text-2xl font-bold text-success">
                    ${pagos?.data?.reduce((total: number, pago: any) => total + pago.monto, 0).toLocaleString('es-AR') || '0'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Último Pago</h4>
                  <p className="text-2xl font-bold text-gray-900">
                    {pagos?.data && pagos.data.length > 0
                      ? new Date(pagos.data[0].fecha).toLocaleDateString('es-AR')
                      : 'Sin pagos'
                    }
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Promedio Mensual</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    ${pagos?.data && pagos.data.length > 0
                      ? Math.round(pagos.data.reduce((total: number, pago: any) => total + pago.monto, 0) / pagos.data.length).toLocaleString('es-AR')
                      : '0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movimientos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Historial de Movimientos</h3>
              <Button
                onClick={() => navigate(`/pagos/nuevo?alumnoId=${alumno.id}`)}
                size="sm"
              >
                + Nuevo Pago
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagos?.data && pagos.data.length > 0 ? (
                    pagos.data.map((pago: any) => (
                      <tr key={pago.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(pago.fecha).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pago.concepto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                          +${pago.monto.toLocaleString('es-AR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pago.metodo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">
                            PAGADO
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No hay movimientos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuentaCorrienteDetail;
