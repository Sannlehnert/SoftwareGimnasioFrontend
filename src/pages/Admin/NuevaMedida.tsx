import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';
import Button from '../../components/ui/Button';

// Mock data for students - replace with actual API call
const mockAlumnos = [
  { id: 1, nombre: 'Juan Pérez', dni: '12345678' },
  { id: 2, nombre: 'María García', dni: '87654321' },
  { id: 3, nombre: 'Carlos Rodríguez', dni: '11223344' },
  { id: 4, nombre: 'Ana López', dni: '44332211' },
  { id: 5, nombre: 'Pedro Martínez', dni: '55667788' }
];

const NuevaMedida: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [medidaData, setMedidaData] = useState({
    alumnoId: '',
    fecha: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    imc: '',
    grasaCorporal: '',
    masaMuscular: '',
    observaciones: ''
  });

  const [alumnos, setAlumnos] = useState(mockAlumnos);

  // Calculate IMC when peso or altura changes
  useEffect(() => {
    if (medidaData.peso && medidaData.altura) {
      const peso = parseFloat(medidaData.peso);
      const altura = parseFloat(medidaData.altura) / 100; // Convert cm to m
      if (peso > 0 && altura > 0) {
        const imc = (peso / (altura * altura)).toFixed(1);
        setMedidaData(prev => ({ ...prev, imc }));
      }
    }
  }, [medidaData.peso, medidaData.altura]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!medidaData.alumnoId) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'Debe seleccionar un alumno'
      });
      return;
    }

    if (!medidaData.peso || !medidaData.altura) {
      addToast({
        type: 'error',
        title: 'Campos requeridos',
        message: 'Peso y altura son obligatorios'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API para crear la medida
      // await api.post('/medidas', medidaData);

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Medida corporal registrada exitosamente'
      });
      navigate('/medidas');
    } catch (error: any) {
      console.error('Error al crear medida:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al registrar la medida'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setMedidaData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Medida Corporal</h1>
          <p className="text-gray-600">Registra las medidas corporales de un alumno</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/medidas')}
        >
          ← Volver a Medidas
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Alumno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alumno *
            </label>
            <select
              value={medidaData.alumnoId}
              onChange={(e) => handleInputChange('alumnoId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Seleccionar alumno...</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre} - DNI: {alumno.dni}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              value={medidaData.fecha}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* Medidas Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={medidaData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: 75.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm) *
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={medidaData.altura}
                onChange={(e) => handleInputChange('altura', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: 175"
                required
              />
            </div>
          </div>

          {/* IMC (calculado automáticamente) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IMC (Índice de Masa Corporal)
            </label>
            <input
              type="text"
              value={medidaData.imc}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="Se calcula automáticamente"
            />
            {medidaData.imc && (
              <p className="mt-1 text-sm text-gray-600">
                Clasificación: {
                  parseFloat(medidaData.imc) < 18.5 ? 'Bajo peso' :
                  parseFloat(medidaData.imc) < 25 ? 'Normal' :
                  parseFloat(medidaData.imc) < 30 ? 'Sobrepeso' :
                  'Obeso'
                }
              </p>
            )}
          </div>

          {/* Medidas Avanzadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grasa Corporal (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="50"
                value={medidaData.grasaCorporal}
                onChange={(e) => handleInputChange('grasaCorporal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: 18.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masa Muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="150"
                value={medidaData.masaMuscular}
                onChange={(e) => handleInputChange('masaMuscular', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: 65.2"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={medidaData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Observaciones sobre el progreso, recomendaciones, etc."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/medidas')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!medidaData.alumnoId || !medidaData.peso || !medidaData.altura}
              className="flex-1"
            >
              Registrar Medida
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaMedida;
