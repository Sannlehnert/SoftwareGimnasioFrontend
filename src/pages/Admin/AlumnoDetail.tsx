import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { pagosService } from '../../api/services/pagos';
// import { rutinasService } from '../../api/services/rutinas';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

const AlumnoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'info' | 'pagos' | 'rutinas' | 'asistencias'>('info');
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const [pagoData, setPagoData] = useState({
    monto: '',
    metodo: 'EFECTIVO',
    concepto: 'CUOTA_MENSUAL',
  });

  const { data: alumno, isLoading } = useQuery({
    queryKey: ['alumno', id],
    queryFn: () => alumnosService.getAlumno(Number(id)),
    enabled: !!id
  });

  const { data: pagos } = useQuery({
    queryKey: ['pagos', id],
    queryFn: () => pagosService.getPagos({ alumnoId: Number(id) }),
    enabled: !!id && activeTab === 'pagos'
  });

  const { data: rutinas } = useQuery({
    queryKey: ['rutinas', id],
    queryFn: () => alumnosService.getRutinas(Number(id)),
    enabled: !!id && activeTab === 'rutinas'
  });

  const createPagoMutation = useMutation({
    mutationFn: pagosService.createPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos', id] });
      queryClient.invalidateQueries({ queryKey: ['alumno', id] });
      setIsPagoModalOpen(false);
      setPagoData({ monto: '', metodo: 'EFECTIVO', concepto: 'CUOTA_MENSUAL' });
      addToast({
        type: 'success',
        title: 'Pago registrado',
        message: 'El pago se ha registrado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al registrar el pago',
      });
    },
  });

  const handleCreatePago = () => {
    if (!pagoData.monto || !alumno) return;

    createPagoMutation.mutate({
      alumnoId: alumno.id,
      monto: Number(pagoData.monto),
      metodo: pagoData.metodo,
      concepto: pagoData.concepto,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando alumno...</div>
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

  const pagoColumns = [
    { key: 'fecha', label: 'Fecha', render: (value: string) => new Date(value).toLocaleDateString('es-AR') },
    { key: 'concepto', label: 'Concepto' },
    { key: 'monto', label: 'Monto', render: (value: number) => `$${value.toLocaleString('es-AR')}` },
    { key: 'metodo', label: 'Método' },
    { key: 'usuarioNombre', label: 'Registrado por' },
  ];

  const rutinaColumns = [
    { key: 'nombre', label: 'Rutina' },
    { key: 'fechaInicio', label: 'Inicio', render: (value: string) => new Date(value).toLocaleDateString('es-AR') },
    { key: 'fechaFin', label: 'Fin', render: (value: string) => value ? new Date(value).toLocaleDateString('es-AR') : '-' },
    { key: 'activa', label: 'Estado', render: (value: boolean) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
      }`}>
        {value ? 'Activa' : 'Inactiva'}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {alumno.nombre} {alumno.apellido}
          </h1>
          <p className="text-gray-600">DNI: {alumno.dni} • {alumno.plan}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/alumnos')}>
            Volver
          </Button>
          <Button onClick={() => setIsPagoModalOpen(true)}>
            Registrar Pago
          </Button>
        </div>
      </div>

      {/* Info Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Estado</p>
          <p className={`text-lg font-semibold ${
            alumno.estado === 'ACTIVO' ? 'text-success' :
            alumno.estado === 'SUSPENDIDO' ? 'text-warning' : 'text-error'
          }`}>
            {alumno.estado}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Vencimiento</p>
          <p className="text-lg font-semibold">
            {new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR')}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Teléfono</p>
          <p className="text-lg font-semibold">{alumno.telefono}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Email</p>
          <p className="text-lg font-semibold">{alumno.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'info', label: 'Información' },
            { key: 'pagos', label: 'Pagos' },
            { key: 'rutinas', label: 'Rutinas' },
            { key: 'asistencias', label: 'Asistencias' },
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
      <div>
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datos Personales</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                  <p>{new Date(alumno.fechaNacimiento).toLocaleDateString('es-AR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Dirección</label>
                  <p>{alumno.direccion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Ingreso</label>
                  <p>{new Date(alumno.fechaIngreso).toLocaleDateString('es-AR')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notas</h3>
              <p className="text-gray-700">{alumno.notas || 'Sin notas'}</p>
            </div>
          </div>
        )}

        {activeTab === 'pagos' && (
          <DataTable
            columns={pagoColumns}
            data={pagos?.data || []}
            totalItems={pagos?.total || 0}
            serverSidePagination={false}
          />
        )}

        {activeTab === 'rutinas' && (
          <DataTable
            columns={rutinaColumns}
            data={rutinas || []}
            serverSidePagination={false}
            actions={(row) => (
              <Button
                size="sm"
                onClick={() => navigate(`/rutinas/${row.id}`)}
              >
                Ver
              </Button>
            )}
          />
        )}
      </div>

      {/* Modal de Pago */}
      <Modal
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        title="Registrar Pago"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              value={pagoData.monto}
              onChange={(e) => setPagoData(prev => ({ ...prev, monto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              value={pagoData.metodo}
              onChange={(e) => setPagoData(prev => ({ ...prev, metodo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="MERCADO_PAGO">Mercado Pago</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concepto
            </label>
            <select
              value={pagoData.concepto}
              onChange={(e) => setPagoData(prev => ({ ...prev, concepto: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="CUOTA_MENSUAL">Cuota Mensual</option>
              <option value="INSCRIPCION">Inscripción</option>
              <option value="PRODUCTO">Producto</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsPagoModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePago}
              isLoading={createPagoMutation.isPending}
              disabled={!pagoData.monto}
              className="flex-1"
            >
              Registrar Pago
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlumnoDetail;