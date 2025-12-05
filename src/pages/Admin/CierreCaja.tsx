import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cajaService } from '../../api/services/caja';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const CierreCaja: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: estadoCaja, isLoading } = useQuery(['estado-caja'], () => cajaService.getEstadoCaja());

  useEffect(() => {
    if (estadoCaja && !estadoCaja.abierta) {
      navigate('/caja');
    }
  }, [estadoCaja, navigate]);

  const cerrarCajaMutation = useMutation({
    mutationFn: cajaService.cerrarCaja,
    onSuccess: (data) => {
      addToast({
        type: 'success',
        title: 'Caja cerrada',
        message: 'El cierre de caja se ha realizado correctamente',
      });
      // Aquí podrías descargar el reporte PDF
      if (data.reporteUrl) {
        window.open(data.reporteUrl, '_blank');
      }
      navigate('/caja');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al cerrar la caja',
      });
    },
  });

  const handleCerrarCaja = () => {
    cerrarCajaMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!estadoCaja?.abierta) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Caja Cerrada</h1>
          <p className="text-gray-600 mb-6">La caja ya está cerrada. No hay nada que cerrar.</p>
          <Button onClick={() => navigate('/caja')}>
            Ir a Gestión de Caja
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Cerrar Caja</h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-4">Resumen del Día</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Monto Inicial:</span>
                <p className="text-lg">${estadoCaja.montoInicial?.toLocaleString('es-AR')}</p>
              </div>
              <div>
                <span className="font-medium">Total Ingresos:</span>
                <p className="text-lg text-success">+${estadoCaja.totalIngresos?.toLocaleString('es-AR')}</p>
              </div>
              <div>
                <span className="font-medium">Total Egresos:</span>
                <p className="text-lg text-error">-${estadoCaja.totalEgresos?.toLocaleString('es-AR')}</p>
              </div>
              <div className="border-t pt-2">
                <span className="font-semibold">Total en Caja:</span>
                <p className="text-xl font-bold">${estadoCaja.totalCaja?.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Efectivo</p>
              <p className="text-2xl font-bold text-success">${estadoCaja.totalEfectivo?.toLocaleString('es-AR')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Tarjetas</p>
              <p className="text-2xl font-bold text-blue-600">${estadoCaja.totalTarjetas?.toLocaleString('es-AR')}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Transferencias</p>
              <p className="text-2xl font-bold text-purple-600">${estadoCaja.totalTransferencias?.toLocaleString('es-AR')}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Al cerrar la caja se generará un reporte detallado de todos los movimientos del día.
          </p>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/caja')}
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
      </div>
    </div>
  );
};

export default CierreCaja;
