import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';
import Button from '../../components/ui/Button';

// Mock data for classes and students
const mockClases = [
  { id: 1, nombre: 'Yoga', horario: '10:00', instructor: 'María López' },
  { id: 2, nombre: 'Spinning', horario: '11:00', instructor: 'Carlos García' },
  { id: 3, nombre: 'Cross Funcional', horario: '12:00', instructor: 'Ana Rodríguez' },
  { id: 4, nombre: 'Pilates', horario: '16:00', instructor: 'Pedro Sánchez' },
  { id: 5, nombre: 'Zumba', horario: '17:00', instructor: 'Laura Martínez' }
];

const mockAlumnos = [
  { id: 1, nombre: 'Juan Pérez', dni: '12345678', activo: true },
  { id: 2, nombre: 'María García', dni: '87654321', activo: true },
  { id: 3, nombre: 'Carlos Rodríguez', dni: '11223344', activo: true },
  { id: 4, nombre: 'Ana López', dni: '44332211', activo: true },
  { id: 5, nombre: 'Pedro Martínez', dni: '55667788', activo: true },
  { id: 6, nombre: 'Laura Sánchez', dni: '66778899', activo: false },
  { id: 7, nombre: 'Miguel Torres', dni: '77889900', activo: true },
  { id: 8, nombre: 'Sofia Ramírez', dni: '88990011', activo: true }
];

const MarcarAsistencia: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClase, setSelectedClase] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencia, setAsistencia] = useState<{[key: number]: boolean}>({});
  const [observaciones, setObservaciones] = useState<{[key: number]: string}>({});

  const alumnosActivos = mockAlumnos.filter(alumno => alumno.activo);

  useEffect(() => {
    // Initialize attendance as false for all active students
    const initialAsistencia: {[key: number]: boolean} = {};
    alumnosActivos.forEach(alumno => {
      initialAsistencia[alumno.id] = false;
    });
    setAsistencia(initialAsistencia);
  }, [selectedClase]);

  const handleAsistenciaChange = (alumnoId: number, presente: boolean) => {
    setAsistencia(prev => ({
      ...prev,
      [alumnoId]: presente
    }));
  };

  const handleObservacionChange = (alumnoId: number, observacion: string) => {
    setObservaciones(prev => ({
      ...prev,
      [alumnoId]: observacion
    }));
  };

  const handleMarcarTodosPresentes = () => {
    const todosPresentes: {[key: number]: boolean} = {};
    alumnosActivos.forEach(alumno => {
      todosPresentes[alumno.id] = true;
    });
    setAsistencia(todosPresentes);
  };

  const handleMarcarTodosAusentes = () => {
    const todosAusentes: {[key: number]: boolean} = {};
    alumnosActivos.forEach(alumno => {
      todosAusentes[alumno.id] = false;
    });
    setAsistencia(todosAusentes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClase) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'Debe seleccionar una clase'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API para marcar asistencia
      // const asistenciaData = {
      //   claseId: selectedClase,
      //   fecha,
      //   registros: alumnosActivos.map(alumno => ({
      //     alumnoId: alumno.id,
      //     asistio: asistencia[alumno.id] || false,
      //     observaciones: observaciones[alumno.id] || ''
      //   }))
      // };
      // await api.post('/asistencia', asistenciaData);

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Asistencia registrada exitosamente'
      });
      navigate('/asistencia');
    } catch (error: any) {
      console.error('Error al marcar asistencia:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al registrar la asistencia'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const presentesCount = Object.values(asistencia).filter(Boolean).length;
  const ausentesCount = alumnosActivos.length - presentesCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marcar Asistencia</h1>
          <p className="text-gray-600">Registra la asistencia de los alumnos a una clase</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/asistencia')}
        >
          ← Volver a Asistencia
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de clase y fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clase *
              </label>
              <select
                value={selectedClase}
                onChange={(e) => setSelectedClase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Seleccionar clase...</option>
                {mockClases.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.nombre} - {clase.horario} ({clase.instructor})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {selectedClase && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lista de Alumnos</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleMarcarTodosPresentes}
                  >
                    Todos Presentes
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleMarcarTodosAusentes}
                  >
                    Todos Ausentes
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{alumnosActivos.length}</p>
                  <p className="text-sm text-gray-600">Total Alumnos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{presentesCount}</p>
                  <p className="text-sm text-gray-600">Presentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{ausentesCount}</p>
                  <p className="text-sm text-gray-600">Ausentes</p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de alumnos */}
          {selectedClase && (
            <div className="space-y-3">
              {alumnosActivos.map((alumno) => (
                <div key={alumno.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{alumno.nombre}</h4>
                        <p className="text-sm text-gray-500">DNI: {alumno.dni}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`presente-${alumno.id}`}
                          checked={asistencia[alumno.id] || false}
                          onChange={(e) => handleAsistenciaChange(alumno.id, e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`presente-${alumno.id}`} className="text-sm text-gray-700">
                          Presente
                        </label>
                      </div>

                      <div className="w-64">
                        <input
                          type="text"
                          placeholder="Observaciones..."
                          value={observaciones[alumno.id] || ''}
                          onChange={(e) => handleObservacionChange(alumno.id, e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/asistencia')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!selectedClase}
              className="flex-1"
            >
              Registrar Asistencia
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcarAsistencia;
