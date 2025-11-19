import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { rutinasService } from '../../api/services/rutinas';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

const Rutinas: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<any>(null);
  const [searchAlumno, setSearchAlumno] = useState('');

  const { data: rutinas, isLoading } = useQuery({
    queryKey: ['rutinas'],
    queryFn: () => rutinasService.getRutinas({ limit: 1000 })
  });

  const { data: ejercicios } = useQuery({
    queryKey: ['ejercicios'],
    queryFn: () => rutinasService.getEjercicios()
  });

  const exportPdfMutation = useMutation(rutinasService.exportRutinaToPdf, {
    onSuccess: (blob, rutinaId) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rutina-${rutinaId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'PDF generado',
        message: 'La rutina se ha exportado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al exportar la rutina a PDF',
      });
    },
  });

  const columns = [
    { key: 'alumnoNombre', label: 'Alumno' },
    { key: 'nombre', label: 'Rutina' },
    { key: 'fechaInicio', label: 'Inicio', render: (value: string) => new Date(value).toLocaleDateString('es-AR') },
    { key: 'fechaFin', label: 'Fin', render: (value: string) => value ? new Date(value).toLocaleDateString('es-AR') : 'Sin fecha' },
    { key: 'ejercicios', label: 'Ejercicios', render: (value: any[]) => value.length },
    { key: 'activa', label: 'Estado', render: (value: boolean) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        value ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
      }`}>
        {value ? 'Activa' : 'Inactiva'}
      </span>
    )},
  ];

  const handleExportPdf = (rutinaId: number) => {
    exportPdfMutation.mutate(rutinaId);
  };

  const handleCreateRutina = () => {
    // Navegar a la página de creación de rutina
    navigate('/rutinas/nueva');
  };

  const filteredRutinas = rutinas?.filter((rutina: any) =>
    rutina.alumnoNombre.toLowerCase().includes(searchAlumno.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutinas</h1>
        <Button onClick={handleCreateRutina}>
          Crear Rutina
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por Alumno
            </label>
            <input
              type="text"
              value={searchAlumno}
              onChange={(e) => setSearchAlumno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nombre del alumno..."
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setSearchAlumno('')}
              className="w-full"
            >
              Limpiar Filtro
            </Button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Rutinas</p>
          <p className="text-2xl font-bold">{rutinas?.length || 0}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Rutinas Activas</p>
          <p className="text-2xl font-bold text-success">
            {rutinas?.filter((r: any) => r.activa).length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Promedio Ejercicios</p>
          <p className="text-2xl font-bold">
            {rutinas?.length ? Math.round(rutinas.reduce((acc: number, r: any) => acc + r.ejercicios.length, 0) / rutinas.length) : 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Sin Rutina Activa</p>
          <p className="text-2xl font-bold text-warning">
            {/* Esto sería calculado con datos de alumnos */}
            0
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRutinas || []}
        loading={isLoading}
        searchable={false}
        actions={(row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleExportPdf(row.id)}
              isLoading={exportPdfMutation.isLoading && exportPdfMutation.variables === row.id}
            >
              Exportar PDF
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/rutinas/${row.id}/editar`)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedRutina(row);
                setIsModalOpen(true);
              }}
            >
              Ver Detalle
            </Button>
          </div>
        )}
      />

      {/* Modal de Detalle de Rutina */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Rutina: ${selectedRutina?.nombre}`}
      >
        {selectedRutina && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Alumno</label>
                <p className="font-semibold">{selectedRutina.alumnoNombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <p className={`font-semibold ${
                  selectedRutina.activa ? 'text-success' : 'text-gray-600'
                }`}>
                  {selectedRutina.activa ? 'Activa' : 'Inactiva'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha Inicio</label>
                <p className="font-semibold">
                  {new Date(selectedRutina.fechaInicio).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha Fin</label>
                <p className="font-semibold">
                  {selectedRutina.fechaFin 
                    ? new Date(selectedRutina.fechaFin).toLocaleDateString('es-AR')
                    : 'Sin fecha límite'
                  }
                </p>
              </div>
            </div>

            {selectedRutina.descripcion && (
              <div>
                <label className="text-sm font-medium text-gray-600">Descripción</label>
                <p className="text-gray-700">{selectedRutina.descripcion}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Ejercicios por Día</h4>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7].map(dia => {
                  const ejerciciosDia = selectedRutina.ejercicios.filter((e: any) => e.dia === dia);
                  if (ejerciciosDia.length === 0) return null;

                  return (
                    <div key={dia} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium mb-2">
                        Día {dia} - {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dia - 1]}
                      </h5>
                      <div className="space-y-2">
                        {ejerciciosDia.map((ejercicio: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="font-medium">{ejercicio.ejercicio.nombre}</p>
                              <p className="text-sm text-gray-600">
                                {ejercicio.series} series × {ejercicio.repeticiones} reps
                                {ejercicio.descanso && ` • Descanso: ${ejercicio.descanso}s`}
                              </p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {ejercicio.ejercicio.categoria}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => handleExportPdf(selectedRutina.id)}
                isLoading={exportPdfMutation.isLoading}
                className="flex-1"
              >
                Exportar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Rutinas;