import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { pagosService } from '../../api/services/pagos';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const NuevoPago: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const alumnoId = searchParams.get('alumnoId');

  const [pagoData, setPagoData] = useState({
    monto: '',
    metodo: 'EFECTIVO',
    concepto: 'CUOTA_MENSUAL',
    notas: '',
  });

  const { data: alumno, isLoading } = useQuery({
    queryKey: ['alumno', alumnoId],
    queryFn: () => alumnosService.getAlumno(Number(alumnoId)),
    enabled: !!alumnoId
  });

  const createPagoMutation = useMutation({
    mutationFn: pagosService.createPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos', alumnoId] });
      queryClient.invalidateQueries({ queryKey: ['alumno', alumnoId] });
      addToast({
        type: 'success',
        title: 'Pago registrado',
        message: 'El pago se ha registrado correctamente',
      });
      navigate(`/alumnos/${alumnoId}`);
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al registrar el pago',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoData.monto || !alumno) return;

    createPagoMutation.mutate({
      alumnoId: alumno.id,
      monto: Number(pagoData.monto),
      metodo: pagoData.metodo,
      concepto: pagoData.concepto,
      notas: pagoData.notas,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Alumno no encontrado</h2>
        <Button onClick={() => navigate('/alumnos')}>
          Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Registrar Pago</h1>
        <Button variant="secondary" onClick={() => navigate(`/alumnos/${alumnoId}`)}>
          Cancelar
        </Button>
      </div>

      {/* Info del Alumno */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Información del Alumno</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Nombre</label>
            <p className="font-semibold">{alumno.nombre} {alumno.apellido}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">DNI</label>
            <p className="font-semibold">{alumno.dni}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Plan</label>
            <p className="font-semibold">{typeof alumno.plan === 'object' ? alumno.plan.nombre : alumno.plan}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Estado</label>
            <p className={`font-semibold ${
              alumno.estado === 'ACTIVO' ? 'text-success' :
              alumno.estado === 'SUSPENDIDO' ? 'text-warning' : 'text-error'
            }`}>
              {alumno.estado}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de Pago */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Datos del Pago</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto *
            </label>
            <input
              type="number"
              step="0.01"
              value={pagoData.monto}
              onChange={(e) => setPagoData(prev => ({ ...prev, monto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago *
            </label>
            <select
              value={pagoData.metodo}
              onChange={(e) => setPagoData(prev => ({ ...prev, metodo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concepto *
            </label>
            <select
              value={pagoData.concepto}
              onChange={(e) => setPagoData(prev => ({ ...prev, concepto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="CUOTA_MENSUAL">Cuota Mensual</option>
              <option value="INSCRIPCION">Inscripción</option>
              <option value="PRODUCTO">Producto</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={pagoData.notas}
              onChange={(e) => setPagoData(prev => ({ ...prev, notas: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Notas adicionales..."
            />
          </div>
        </div>

        <div className="flex gap-2 pt-6">
          <Button
            type="submit"
            isLoading={createPagoMutation.isPending}
            disabled={!pagoData.monto}
            className="flex-1"
          >
            Registrar Pago
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevoPago;
