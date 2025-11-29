import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosService } from '../../api/services/turnos';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';
import NuevaClaseForm from '../../components/forms/NuevaClaseForm';
import EditarClaseForm from '../../components/forms/EditarClaseForm';
import NuevoTurnoForm from '../../components/forms/NuevoTurnoForm';
import EditarTurnoForm from '../../components/forms/EditarTurnoForm';

const Turnos: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);
  const [isEditarClaseModalOpen, setIsEditarClaseModalOpen] = useState(false);
  const [isEditarTurnoModalOpen, setIsEditarTurnoModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
  const [selectedClase, setSelectedClase] = useState<any>(null);
  const [activeView, setActiveView] = useState<'turnos' | 'clases'>('turnos');

  const { data: turnos, isLoading: loadingTurnos } = useQuery({
    queryKey: ['turnos'],
    queryFn: () => turnosService.getTurnos({ desde: new Date().toISOString().split('T')[0] })
  });

  const { data: clases, isLoading: loadingClases } = useQuery({
    queryKey: ['clases'],
    queryFn: turnosService.getClases
  });

  const { data: inscripciones } = useQuery({
    queryKey: ['inscripciones', selectedTurno?.id],
    queryFn: () => selectedTurno ? turnosService.getInscripciones(selectedTurno.id) : null,
    enabled: !!selectedTurno
  });

  const createTurnoMutation = useMutation({
    mutationFn: turnosService.createTurno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      setIsModalOpen(false);
      addToast({
        type: 'success',
        title: 'Turno creado',
        message: 'El turno se ha creado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear el turno',
      });
    },
  });

  const createClaseMutation = useMutation({
    mutationFn: turnosService.createClase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      setIsModalOpen(false);
      addToast({
        type: 'success',
        title: 'Clase creada',
        message: 'La clase se ha creado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear la clase',
      });
    },
  });

  const registrarAsistenciaMutation = useMutation({
    mutationFn: ({ inscripcionId, asistio }: { inscripcionId: number; asistio: boolean }) =>
      turnosService.registrarAsistencia(inscripcionId, asistio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inscripciones', selectedTurno?.id] });
      addToast({
        type: 'success',
        title: 'Asistencia registrada',
        message: 'La asistencia se ha registrado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al registrar asistencia',
      });
    },
  });

  const turnosColumns = [
    { key: 'claseNombre', label: 'Clase' },
    { key: 'fechaHora', label: 'Fecha y Hora', render: (value: string) => new Date(value).toLocaleString('es-AR') },
    { key: 'sala', label: 'Sala' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'inscritos', label: 'Inscritos', render: (value: number, row: any) => `${value}/${row.cupo}` },
    { key: 'estado', label: 'Estado', render: (value: string) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value === 'ACTIVO' ? 'bg-success/10 text-success' :
        value === 'CANCELADO' ? 'bg-error/10 text-error' :
        'bg-warning/10 text-warning'
      }`}>
        {value}
      </span>
    )},
  ];

  const clasesColumns = [
    { key: 'nombre', label: 'Clase' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'duracion', label: 'Duración (min)' },
    { key: 'instructores', label: 'Instructores', render: (value: string[]) => value.join(', ') },
    { key: 'activo', label: 'Estado', render: (value: boolean) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
      }`}>
        {value ? 'Activa' : 'Inactiva'}
      </span>
    )},
  ];

  const handleRegistrarAsistencia = (inscripcionId: number, asistio: boolean) => {
    registrarAsistenciaMutation.mutate({ inscripcionId, asistio });
  };

  const handleAsistenciaTurno = (turno: any) => {
    setSelectedTurno(turno);
    setIsAsistenciaModalOpen(true);
  };

  const handleEditarClase = (clase: any) => {
    setSelectedClase(clase);
    setIsEditarClaseModalOpen(true);
  };

  const handleEditarTurno = (turno: any) => {
    setSelectedTurno(turno);
    setIsEditarTurnoModalOpen(true);
  };

  const updateClaseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      turnosService.updateClase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      addToast({
        type: 'success',
        title: 'Clase actualizada',
        message: 'La clase se ha actualizado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar la clase',
      });
    },
  });

  const updateTurnoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      turnosService.updateTurno(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      setIsEditarTurnoModalOpen(false);
      addToast({
        type: 'success',
        title: 'Turno actualizado',
        message: 'El turno se ha actualizado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al actualizar el turno',
      });
    },
  });

  const handleDesactivarClase = async (clase: any) => {
    if (window.confirm(`¿Estás seguro de que quieres ${clase.activo ? 'desactivar' : 'activar'} la clase "${clase.nombre}"?`)) {
      try {
        await updateClaseMutation.mutateAsync({
          id: clase.id,
          data: { activo: !clase.activo }
        });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Turnos y Clases</h1>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'turnos' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('turnos')}
          >
            Turnos
          </Button>
          <Button
            variant={activeView === 'clases' ? 'primary' : 'secondary'}
            onClick={() => setActiveView('clases')}
          >
            Clases
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            {activeView === 'turnos' ? 'Nuevo Turno' : 'Nueva Clase'}
          </Button>
        </div>
      </div>

      {activeView === 'turnos' && (
        <DataTable
          columns={turnosColumns}
          data={turnos || []}
          loading={loadingTurnos}
          searchable={true}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAsistenciaTurno(row)}
              >
                Asistencia
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleEditarTurno(row)}
              >
                Editar
              </Button>
            </div>
          )}
        />
      )}

      {activeView === 'clases' && (
        <div className="space-y-6">
          <DataTable
            columns={clasesColumns}
            data={clases || []}
            loading={loadingClases}
            searchable={true}
            actions={(row) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditarClase(row)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant={row.activo ? "danger" : "warning"}
                  onClick={() => handleDesactivarClase(row)}
                >
                  {row.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            )}
          />

          {/* Estadísticas de Clases */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Clases</h3>
              <p className="text-3xl font-bold text-primary-600">{clases?.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clases Activas</h3>
              <p className="text-3xl font-bold text-success">{clases?.filter((c: any) => c.activo).length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacidad Total</h3>
              <p className="text-3xl font-bold text-blue-600">
                {clases?.reduce((acc: number, c: any) => acc + c.capacidad, 0) || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructores</h3>
              <p className="text-3xl font-bold text-purple-600">
                {new Set(clases?.flatMap((c: any) => c.instructores)).size || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asistencia */}
      <Modal
        isOpen={isAsistenciaModalOpen}
        onClose={() => setIsAsistenciaModalOpen(false)}
        title={`Asistencia - ${selectedTurno?.claseNombre}`}
      >
        {selectedTurno && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">{selectedTurno.claseNombre}</h4>
              <p className="text-sm text-gray-600">
                {new Date(selectedTurno.fechaHora).toLocaleString('es-AR')} • {selectedTurno.sala}
              </p>
              <p className="text-sm text-gray-600">
                Instructor: {selectedTurno.instructor}
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Alumno</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inscripciones?.map((inscripcion: any) => (
                    <tr key={inscripcion.id}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{inscripcion.alumnoNombre}</p>
                          <p className="text-sm text-gray-600">
                            Inscrito: {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          inscripcion.estado === 'ASISTIO' ? 'bg-success/10 text-success' :
                          inscripcion.estado === 'AUSENTE' ? 'bg-error/10 text-error' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {inscripcion.estado === 'ASISTIO' ? 'Asistió' :
                           inscripcion.estado === 'AUSENTE' ? 'Ausente' : 'Confirmado'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleRegistrarAsistencia(inscripcion.id, true)}
                            disabled={inscripcion.estado === 'ASISTIO'}
                            variant={inscripcion.estado === 'ASISTIO' ? 'primary' : 'secondary'}
                          >
                            ✓ Asistió
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRegistrarAsistencia(inscripcion.id, false)}
                            disabled={inscripcion.estado === 'AUSENTE'}
                          >
                            ✗ Ausente
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsAsistenciaModalOpen(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Nuevo Turno/Clase */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeView === 'turnos' ? "Crear Nuevo Turno" : "Crear Nueva Clase"}
      >
        {activeView === 'turnos' ? (
          <NuevoTurnoForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={(turnoData: Parameters<typeof turnosService.createTurno>[0]) => createTurnoMutation.mutate(turnoData)}
            isLoading={createTurnoMutation.isPending}
          />
        ) : (
          <NuevaClaseForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={(claseData: Parameters<typeof turnosService.createClase>[0]) => createClaseMutation.mutate(claseData)}
            isLoading={createClaseMutation.isPending}
          />
        )}
      </Modal>

      {/* Modal Editar Clase */}
      <Modal
        isOpen={isEditarClaseModalOpen}
        onClose={() => setIsEditarClaseModalOpen(false)}
        title="Editar Clase"
      >
        {selectedClase && (
          <EditarClaseForm
            clase={selectedClase}
            onClose={() => setIsEditarClaseModalOpen(false)}
            onSubmit={(claseData: Partial<any>) => {
              updateClaseMutation.mutate({
                id: selectedClase.id,
                data: claseData
              });
              setIsEditarClaseModalOpen(false);
            }}
            isLoading={updateClaseMutation.isPending}
          />
        )}
      </Modal>

      {/* Modal Editar Turno */}
      <Modal
        isOpen={isEditarTurnoModalOpen}
        onClose={() => setIsEditarTurnoModalOpen(false)}
        title="Editar Turno"
      >
        {selectedTurno && (
          <EditarTurnoForm
            turno={selectedTurno}
            onClose={() => setIsEditarTurnoModalOpen(false)}
            onSubmit={(turnoData: Partial<any>) => {
              updateTurnoMutation.mutate({
                id: selectedTurno.id,
                data: turnoData
              });
            }}
            isLoading={updateTurnoMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
};

export default Turnos;