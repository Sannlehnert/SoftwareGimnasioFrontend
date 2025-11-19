import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cajaService } from '../../api/services/caja';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

const Caja: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [isAbrirModalOpen, setIsAbrirModalOpen] = useState(false);
  const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false);
  const [montoInicial, setMontoInicial] = useState('');

  const { data: estadoCaja } = useQuery(['estado-caja'], () => cajaService.getEstadoCaja());
  const { data: movimientos } = useQuery(['movimientos-caja'], () => cajaService.getMovimientos());

  const abrirCajaMutation = useMutation({
    mutationFn: cajaService.abrirCaja,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estado-caja'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos-caja'] });
      setIsAbrirModalOpen(false);
      setMontoInicial('');
      addToast({
        type: 'success',
        title: 'Caja abierta',
        message: 'La caja se ha abierto correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al abrir la caja',
      });
    },
  });

  const cerrarCajaMutation = useMutation({
    mutationFn: cajaService.cerrarCaja,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['estado-caja'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos-caja'] });
      setIsCerrarModalOpen(false);
      addToast({
        type: 'success',
        title: 'Caja cerrada',
        message: 'El cierre de caja se ha realizado correctamente',
      });
      // Aquí podrías descargar el reporte PDF
      if (data.reporteUrl) {
        window.open(data.reporteUrl, '_blank');
      }
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al cerrar la caja',
      });
    },
  });

  const movimientosColumns = [
    { key: 'fecha', label: 'Fecha', render: (value: string) => new Date(value).toLocaleString('es-AR') },
    { key: 'tipo', label: 'Tipo', render: (value: string) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value === 'INGRESO' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
      }`}>
        {value}
      </span>
    )},
    { key: 'descripcion', label: 'Descripción' },
    { key: 'monto', label: 'Monto', render: (value: number) => (
      <span className={value >= 0 ? 'text-success' : 'text-error'}>
        ${Math.abs(value).toLocaleString('es-AR')}
      </span>
    )},
    { key: 'usuarioNombre', label: 'Usuario' },
  ];

  const handleAbrirCaja = () => {
    if (!montoInicial) return;

    abrirCajaMutation.mutate({
      montoInicial: parseFloat(montoInicial),
      notas: 'Apertura de caja del día',
    });
  };

  const handleCerrarCaja = () => {
    cerrarCajaMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Caja</h1>
        <div className="flex gap-2">
          {estadoCaja?.abierta ? (
            <Button variant="warning" onClick={() => setIsCerrarModalOpen(true)}>
              Cerrar Caja
            </Button>
          ) : (
            <Button onClick={() => setIsAbrirModalOpen(true)}>
              Abrir Caja
            </Button>
          )}
        </div>
      </div>

      {/* Estado de Caja */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Estado</p>
          <p className={`text-lg font-semibold ${
            estadoCaja?.abierta ? 'text-success' : 'text-error'
          }`}>
            {estadoCaja?.abierta ? 'ABIERTA' : 'CERRADA'}
          </p>
        </div>

        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Monto Inicial</p>
          <p className="text-lg font-semibold">
            ${estadoCaja?.montoInicial?.toLocaleString('es-AR') || '0'}
          </p>
        </div>

        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Ingresos del Día</p>
          <p className="text-lg font-semibold text-success">
            +${estadoCaja?.totalIngresos?.toLocaleString('es-AR') || '0'}
          </p>
        </div>

        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Egresos del Día</p>
          <p className="text-lg font-semibold text-error">
            -${estadoCaja?.totalEgresos?.toLocaleString('es-AR') || '0'}
          </p>
        </div>
      </div>

      {estadoCaja?.abierta && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="kpi-card">
              <p className="text-sm font-medium text-gray-600">Total en Efectivo</p>
              <p className="text-2xl font-bold text-success">
                ${estadoCaja?.totalEfectivo?.toLocaleString('es-AR') || '0'}
              </p>
            </div>

            <div className="kpi-card">
              <p className="text-sm font-medium text-gray-600">Total Tarjetas</p>
              <p className="text-2xl font-bold text-blue-600">
                ${estadoCaja?.totalTarjetas?.toLocaleString('es-AR') || '0'}
              </p>
            </div>

            <div className="kpi-card">
              <p className="text-sm font-medium text-gray-600">Total Transferencias</p>
              <p className="text-2xl font-bold text-purple-600">
                ${estadoCaja?.totalTransferencias?.toLocaleString('es-AR') || '0'}
              </p>
            </div>
          </div>

          {/* Movimientos de Caja */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Movimientos del Día</h2>
            <DataTable
              columns={movimientosColumns}
              data={movimientos?.data || []}
              totalItems={movimientos?.total || 0}
              serverSidePagination={false}
            />
          </div>
        </>
      )}

      {/* Modal Abrir Caja */}
      <Modal
        isOpen={isAbrirModalOpen}
        onClose={() => setIsAbrirModalOpen(false)}
        title="Abrir Caja"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto Inicial *
            </label>
            <input
              type="number"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsAbrirModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAbrirCaja}
              isLoading={abrirCajaMutation.isPending}
              disabled={!montoInicial}
              className="flex-1"
            >
              Abrir Caja
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Cerrar Caja */}
      <Modal
        isOpen={isCerrarModalOpen}
        onClose={() => setIsCerrarModalOpen(false)}
        title="Cerrar Caja"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Resumen del Día</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monto Inicial:</span>
                <span>${estadoCaja?.montoInicial?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Ingresos:</span>
                <span className="text-success">+${estadoCaja?.totalIngresos?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Egresos:</span>
                <span className="text-error">-${estadoCaja?.totalEgresos?.toLocaleString('es-AR')}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total en Caja:</span>
                <span>${estadoCaja?.totalCaja?.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Al cerrar la caja se generará un reporte detallado de todos los movimientos del día.
          </p>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsCerrarModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCerrarCaja}
              isLoading={cerrarCajaMutation.isPending}
              className="flex-1"
            >
              Generar Cierre
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Caja;