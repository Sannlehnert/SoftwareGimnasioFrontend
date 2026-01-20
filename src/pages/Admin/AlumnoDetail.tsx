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
  
  const [activeTab, setActiveTab] = useState<'info' | 'cuenta-corriente' | 'pagos' | 'rutinas' | 'asistencias'>('info');
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
          <p className="text-gray-600">DNI: {alumno.dni} • {typeof alumno.plan === 'object' ? alumno.plan.nombre : alumno.plan}</p>
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
            { key: 'cuenta-corriente', label: 'Cuenta Corriente' },
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

        {activeTab === 'cuenta-corriente' && (
          <div className="space-y-6">
            {/* Resumen de Cuenta */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Saldo Actual</p>
                    <p className="text-3xl font-bold text-blue-900">$0.00</p>
                  </div>
                  <div className="text-blue-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Último Pago</p>
                    <p className="text-2xl font-bold text-green-900">
                      {alumno.ultimoPago ? new Date(alumno.ultimoPago).toLocaleDateString('es-AR') : 'Sin pagos'}
                    </p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Próximo Vencimiento</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {new Date(alumno.fechaVencimiento).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-orange-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Estado</p>
                    <p className={`text-2xl font-bold ${
                      alumno.estado === 'ACTIVO' ? 'text-green-900' :
                      alumno.estado === 'SUSPENDIDO' ? 'text-yellow-900' : 'text-red-900'
                    }`}>
                      {alumno.estado}
                    </p>
                  </div>
                  <div className={`${
                    alumno.estado === 'ACTIVO' ? 'text-green-500' :
                    alumno.estado === 'SUSPENDIDO' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Movimientos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h3>
                  <Button size="sm">
                    Ver Todos
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Movimiento de ejemplo */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pago de Cuota Mensual</p>
                        <p className="text-sm text-gray-500">15 de enero de 2024 • Efectivo</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">+$2,500.00</p>
                      <p className="text-sm text-gray-500">Registrado por: Admin</p>
                    </div>
                  </div>

                  {/* Otro movimiento */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Inscripción Inicial</p>
                        <p className="text-sm text-gray-500">1 de enero de 2024 • Tarjeta</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-600">+$5,000.00</p>
                      <p className="text-sm text-gray-500">Registrado por: Admin</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm">Mostrando los últimos 2 movimientos</p>
                  <Button variant="secondary" size="sm" className="mt-2">
                    Cargar Más Movimientos
                  </Button>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  <span>Registrar Pago</span>
                </Button>
                <Button variant="secondary" className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span>Ver Facturas</span>
                </Button>
                <Button variant="secondary" className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span>Ayuda</span>
                </Button>
              </div>
            </div>
          </div>
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