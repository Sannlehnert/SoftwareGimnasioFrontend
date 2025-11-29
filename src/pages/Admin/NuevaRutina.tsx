import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { rutinasService } from '../../api/services/rutinas';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastProvider';

interface Ejercicio {
  ejercicioId: number;
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: number;
  dia: number;
}

const NuevaRutina: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [rutinaData, setRutinaData] = useState({
    nombre: '',
    descripcion: '',
    alumnoId: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    activa: true,
  });

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [isEjercicioModalOpen, setIsEjercicioModalOpen] = useState(false);
  const [editingEjercicio, setEditingEjercicio] = useState<Ejercicio | null>(null);
  const [ejercicioForm, setEjercicioForm] = useState({
    ejercicioId: '',
    nombre: '',
    series: 3,
    repeticiones: '10',
    descanso: 60,
    dia: 1,
  });

  const { data: alumnos } = useQuery({
    queryKey: ['alumnos'],
    queryFn: () => alumnosService.getAlumnos({ limit: 1000 })
  });

  const { data: ejerciciosDisponibles } = useQuery({
    queryKey: ['ejercicios'],
    queryFn: () => rutinasService.getEjercicios()
  });

  const createRutinaMutation = useMutation({
    mutationFn: (data: any) => rutinasService.createRutina(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas'] });
      addToast({
        type: 'success',
        title: 'Rutina creada',
        message: 'La rutina se ha creado correctamente',
      });
      navigate('/rutinas');
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al crear la rutina',
      });
    },
  });

  const handleAddEjercicio = () => {
    if (!ejercicioForm.ejercicioId || !ejercicioForm.nombre) return;

    const newEjercicio: Ejercicio = {
      ejercicioId: Number(ejercicioForm.ejercicioId),
      nombre: ejercicioForm.nombre,
      series: ejercicioForm.series,
      repeticiones: ejercicioForm.repeticiones,
      descanso: ejercicioForm.descanso,
      dia: ejercicioForm.dia,
    };

    if (editingEjercicio) {
      setEjercicios(prev => prev.map(ej =>
        ej.ejercicioId === editingEjercicio.ejercicioId && ej.dia === editingEjercicio.dia
          ? newEjercicio
          : ej
      ));
    } else {
      setEjercicios(prev => [...prev, newEjercicio]);
    }

    setIsEjercicioModalOpen(false);
    setEditingEjercicio(null);
    setEjercicioForm({
      ejercicioId: '',
      nombre: '',
      series: 3,
      repeticiones: '10',
      descanso: 60,
      dia: 1,
    });
  };

  const handleEditEjercicio = (ejercicio: Ejercicio) => {
    setEditingEjercicio(ejercicio);
    setEjercicioForm({
      ejercicioId: ejercicio.ejercicioId.toString(),
      nombre: ejercicio.nombre,
      series: ejercicio.series,
      repeticiones: ejercicio.repeticiones,
      descanso: ejercicio.descanso,
      dia: ejercicio.dia,
    });
    setIsEjercicioModalOpen(true);
  };

  const handleDeleteEjercicio = (ejercicio: Ejercicio) => {
    setEjercicios(prev => prev.filter(e =>
      !(e.ejercicioId === ejercicio.ejercicioId && e.dia === ejercicio.dia)
    ));
  };

  const handleEjercicioChange = (field: string, value: any) => {
    if (field === 'ejercicioId') {
      const ejercicio = ejerciciosDisponibles?.find((e: { id: number; nombre: string }) => e.id === Number(value));
      setEjercicioForm(prev => ({
        ...prev,
        ejercicioId: value,
        nombre: ejercicio?.nombre || '',
      }));
    } else {
      setEjercicioForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutinaData.nombre || !rutinaData.alumnoId || ejercicios.length === 0) return;

    const rutinaPayload = {
      ...rutinaData,
      alumnoId: Number(rutinaData.alumnoId),
      fechaFin: rutinaData.fechaFin || null,
      ejercicios: ejercicios.map(ejercicio => ({
        ejercicioId: ejercicio.ejercicioId,
        series: ejercicio.series,
        repeticiones: ejercicio.repeticiones,
        descanso: ejercicio.descanso,
        dia: ejercicio.dia,
      })),
    };

    createRutinaMutation.mutate(rutinaPayload);
  };

  const ejerciciosPorDia = [1, 2, 3, 4, 5, 6, 7].map(dia => ({
    dia,
    nombre: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dia - 1],
    ejercicios: ejercicios.filter(ej => ej.dia === dia),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Rutina</h1>
        <Button variant="secondary" onClick={() => navigate('/rutinas')}>
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Información de la Rutina</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Rutina *
              </label>
              <input
                type="text"
                value={rutinaData.nombre}
                onChange={(e) => setRutinaData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: Rutina de Fuerza"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alumno *
              </label>
              <select
                value={rutinaData.alumnoId}
                onChange={(e) => setRutinaData(prev => ({ ...prev, alumnoId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Seleccionar alumno...</option>
                {alumnos?.data?.map((alumno: any) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} - {alumno.dni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={rutinaData.fechaInicio}
                onChange={(e) => setRutinaData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin (opcional)
              </label>
              <input
                type="date"
                value={rutinaData.fechaFin}
                onChange={(e) => setRutinaData(prev => ({ ...prev, fechaFin: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={rutinaData.descripcion}
              onChange={(e) => setRutinaData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Descripción de la rutina..."
            />
          </div>
        </div>

        {/* Ejercicios por Día */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ejercicios por Día</h2>
            <Button
              type="button"
              onClick={() => setIsEjercicioModalOpen(true)}
            >
              + Agregar Ejercicio
            </Button>
          </div>

          <div className="space-y-4">
            {ejerciciosPorDia.map(({ dia, nombre, ejercicios: ejerciciosDia }) => (
              <div key={dia} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3">{nombre}</h3>
                {ejerciciosDia.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay ejercicios para este día</p>
                ) : (
                  <div className="space-y-2">
                    {ejerciciosDia.map((ejercicio, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{ejercicio.nombre}</p>
                          <p className="text-sm text-gray-600">
                            {ejercicio.series} series × {ejercicio.repeticiones} reps
                            {ejercicio.descanso && ` • Descanso: ${ejercicio.descanso}s`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditEjercicio(ejercicio)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteEjercicio(ejercicio)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2">
          <Button
            type="submit"
            isLoading={createRutinaMutation.isPending}
            disabled={!rutinaData.nombre || !rutinaData.alumnoId || ejercicios.length === 0}
            className="flex-1"
          >
            Crear Rutina
          </Button>
        </div>
      </form>

      {/* Modal Agregar/Editar Ejercicio */}
      <Modal
        isOpen={isEjercicioModalOpen}
        onClose={() => {
          setIsEjercicioModalOpen(false);
          setEditingEjercicio(null);
          setEjercicioForm({
            ejercicioId: '',
            nombre: '',
            series: 3,
            repeticiones: '10',
            descanso: 60,
            dia: 1,
          });
        }}
        title={editingEjercicio ? "Editar Ejercicio" : "Agregar Ejercicio"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ejercicio *
            </label>
            <select
              value={ejercicioForm.ejercicioId}
              onChange={(e) => handleEjercicioChange('ejercicioId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar ejercicio...</option>
              {ejerciciosDisponibles?.map((ejercicio: any) => (
                <option key={ejercicio.id} value={ejercicio.id}>
                  {ejercicio.nombre} - {ejercicio.categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Series *
              </label>
              <input
                type="number"
                min="1"
                value={ejercicioForm.series}
                onChange={(e) => handleEjercicioChange('series', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeticiones *
              </label>
              <input
                type="text"
                value={ejercicioForm.repeticiones}
                onChange={(e) => handleEjercicioChange('repeticiones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="10 o 10-12"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descanso (segundos)
              </label>
              <input
                type="number"
                min="0"
                value={ejercicioForm.descanso}
                onChange={(e) => handleEjercicioChange('descanso', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la Semana *
              </label>
              <select
                value={ejercicioForm.dia}
                onChange={(e) => handleEjercicioChange('dia', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value={1}>Lunes</option>
                <option value={2}>Martes</option>
                <option value={3}>Miércoles</option>
                <option value={4}>Jueves</option>
                <option value={5}>Viernes</option>
                <option value={6}>Sábado</option>
                <option value={7}>Domingo</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEjercicioModalOpen(false);
                setEditingEjercicio(null);
                setEjercicioForm({
                  ejercicioId: '',
                  nombre: '',
                  series: 3,
                  repeticiones: '10',
                  descanso: 60,
                  dia: 1,
                });
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddEjercicio}
              disabled={!ejercicioForm.ejercicioId}
              className="flex-1"
            >
              {editingEjercicio ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NuevaRutina;
