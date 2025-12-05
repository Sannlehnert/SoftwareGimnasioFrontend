import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cajaService } from '../../api/services/caja';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const AbrirCaja: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [montoInicial, setMontoInicial] = useState('');

  const { data: estadoCaja, isLoading } = useQuery(['estado-caja'], () => cajaService.getEstadoCaja());

  useEffect(() => {
    if (estadoCaja?.abierta) {
      navigate('/caja');
    }
  }, [estadoCaja, navigate]);

  const abrirCajaMutation = useMutation({
    mutationFn: cajaService.abrirCaja,
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Caja abierta',
        message: 'La caja se ha abierto correctamente',
      });
      navigate('/caja');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al abrir la caja',
      });
    },
  });

  const handleAbrirCaja = () => {
    if (!montoInicial) return;

    abrirCajaMutation.mutate({
      montoInicial: parseFloat(montoInicial),
      notas: 'Apertura de caja del día',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Abrir Caja</h1>

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
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/caja')}
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
      </div>
    </div>
  );
};

export default AbrirCaja;
