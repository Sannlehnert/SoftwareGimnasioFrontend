import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turnosService } from '../../api/services/turnos';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

const Turnos: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<any>(null);
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
            Nuevo Turno
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
              <Button size="sm" variant="secondary">
                Editar
              </Button>
            </div>
          )}
        />
      )}

      {activeView === 'clases' && (
        <DataTable
          columns={clasesColumns}
          data={clases || []}
          loading={loadingClases}
          searchable={true}
          actions={(row) => (
            <Button size="sm" variant="secondary">
              Editar
            </Button>
          )}
        />
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

      {/* Modal Nuevo Turno */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Turno"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Funcionalidad de creación de turnos en desarrollo...</p>
          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                addToast({
                  type: 'info',
                  title: 'En desarrollo',
                  message: 'Esta funcionalidad estará disponible pronto',
                });
              }}
              className="flex-1"
            >
              Crear
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Turnos;