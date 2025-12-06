import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastProvider';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const NuevoPlanNutricional: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState({
    titulo: '',
    descripcion: '',
    objetivo: '',
    duracionSemanas: 4,
    caloriasDiarias: 2000,
    macronutrientes: {
      proteinas: 150,
      carbohidratos: 250,
      grasas: 67
    },
    comidas: [
      { nombre: 'Desayuno', hora: '08:00', descripcion: '' },
      { nombre: 'Almuerzo', hora: '13:00', descripcion: '' },
      { nombre: 'Cena', hora: '20:00', descripcion: '' }
    ],
    recomendaciones: '',
    activo: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planData.titulo.trim()) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'El título del plan es obligatorio'
      });
      return;
    }

    if (!planData.objetivo.trim()) {
      addToast({
        type: 'error',
        title: 'Campo requerido',
        message: 'El objetivo del plan es obligatorio'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API para crear el plan nutricional
      // await api.post('/planes-nutricionales', planData);

      // Simulación de éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Plan nutricional creado exitosamente'
      });
      navigate(user?.rol === 'ADMIN' ? '/nutricion' : '/plan-nutricional');
    } catch (error: any) {
      console.error('Error al crear plan nutricional:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.mensaje || 'Error al crear el plan nutricional'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComidaChange = (index: number, field: string, value: string) => {
    const newComidas = [...planData.comidas];
    newComidas[index] = { ...newComidas[index], [field]: value };
    setPlanData(prev => ({ ...prev, comidas: newComidas }));
  };

  const addComida = () => {
    setPlanData(prev => ({
      ...prev,
      comidas: [...prev.comidas, { nombre: '', hora: '', descripcion: '' }]
    }));
  };

  const removeComida = (index: number) => {
    if (planData.comidas.length > 1) {
      setPlanData(prev => ({
        ...prev,
        comidas: prev.comidas.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Plan Nutricional</h1>
          <p className="text-gray-600">Crea un nuevo plan nutricional personalizado</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(user?.rol === 'ADMIN' ? '/nutricion' : '/plan-nutricional')}
        >
          ← Volver a Plan Nutricional
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Plan *
              </label>
              <input
                type="text"
                value={planData.titulo}
                onChange={(e) => setPlanData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: Plan de Pérdida de Peso, Ganancia Muscular..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={planData.descripcion}
                onChange={(e) => setPlanData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Describe brevemente el plan nutricional..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <select
                value={planData.objetivo}
                onChange={(e) => setPlanData(prev => ({ ...prev, objetivo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Seleccionar objetivo...</option>
                <option value="perdida-peso">Pérdida de Peso</option>
                <option value="ganancia-muscular">Ganancia Muscular</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="definicion">Definición</option>
                <option value="salud-general">Salud General</option>
              </select>
            </div>
          </div>

          {/* Configuración Nutricional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Configuración Nutricional</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (semanas)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={planData.duracionSemanas}
                  onChange={(e) => setPlanData(prev => ({ ...prev, duracionSemanas: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías Diarias (kcal)
                </label>
                <input
                  type="number"
                  min="1200"
                  max="4000"
                  value={planData.caloriasDiarias}
                  onChange={(e) => setPlanData(prev => ({ ...prev, caloriasDiarias: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Macronutrientes Diarios (gramos)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Proteínas (g)</label>
                  <input
                    type="number"
                    min="50"
                    max="300"
                    value={planData.macronutrientes.proteinas}
                    onChange={(e) => setPlanData(prev => ({
                      ...prev,
                      macronutrientes: { ...prev.macronutrientes, proteinas: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Carbohidratos (g)</label>
                  <input
                    type="number"
                    min="100"
                    max="500"
                    value={planData.macronutrientes.carbohidratos}
                    onChange={(e) => setPlanData(prev => ({
                      ...prev,
                      macronutrientes: { ...prev.macronutrientes, carbohidratos: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Grasas (g)</label>
                  <input
                    type="number"
                    min="30"
                    max="150"
                    value={planData.macronutrientes.grasas}
                    onChange={(e) => setPlanData(prev => ({
                      ...prev,
                      macronutrientes: { ...prev.macronutrientes, grasas: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comidas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Comidas del Día</h3>

            <div className="space-y-3">
              {planData.comidas.map((comida, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Comida {index + 1}</h4>
                    {planData.comidas.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeComida(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={comida.nombre}
                        onChange={(e) => handleComidaChange(index, 'nombre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: Desayuno, Almuerzo..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Hora</label>
                      <input
                        type="time"
                        value={comida.hora}
                        onChange={(e) => handleComidaChange(index, 'hora', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm text-gray-600 mb-1">Descripción</label>
                      <input
                        type="text"
                        value={comida.descripcion}
                        onChange={(e) => handleComidaChange(index, 'descripcion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: Avena con frutas..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addComida}
            >
              + Agregar Comida
            </Button>
          </div>

          {/* Recomendaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recomendaciones Adicionales
            </label>
            <textarea
              value={planData.recomendaciones}
              onChange={(e) => setPlanData(prev => ({ ...prev, recomendaciones: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Recomendaciones sobre hidratación, suplementos, hábitos alimenticios..."
            />
          </div>

          {/* Estado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={planData.activo}
              onChange={(e) => setPlanData(prev => ({ ...prev, activo: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Plan activo (visible para el alumno)
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(user?.rol === 'ADMIN' ? '/nutricion' : '/plan-nutricional')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!planData.titulo.trim() || !planData.objetivo}
              className="flex-1"
            >
              Crear Plan Nutricional
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoPlanNutricional;
