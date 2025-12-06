import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { alumnosService } from '../../api/services/alumnos';
import Button from '../../components/ui/Button';

const AlumnoPlanNutricional: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: planNutricional, isLoading, error } = useQuery({
    queryKey: ['plan-nutricional', user?.id],
    queryFn: () => alumnosService.getPlanNutricional(user!.id),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!planNutricional) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Plan Nutricional</h1>
          <Button
            onClick={() => navigate('/nutricion/nuevo')}
            className="bg-green-600 hover:bg-green-700"
          >
            + Nuevo Plan
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🥗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes un plan nutricional asignado</h3>
            <p className="text-gray-500">Contacta con tu entrenador para que te asigne un plan personalizado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Plan Nutricional</h1>
        <div className="text-sm text-gray-500">
          Actualizado: {new Date(planNutricional.fechaActualizacion).toLocaleDateString('es-AR')}
        </div>
      </div>

      {/* Información General */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Objetivo</div>
            <div className="text-lg font-semibold text-blue-900">{planNutricional.objetivo}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Calorías Diarias</div>
            <div className="text-lg font-semibold text-green-900">{planNutricional.caloriasDiarias} kcal</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Macronutrientes</div>
            <div className="text-sm text-purple-900">
              P: {planNutricional.proteinas}g | C: {planNutricional.carbohidratos}g | G: {planNutricional.grasas}g
            </div>
          </div>
        </div>
      </div>

      {/* Comidas del Día */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comidas de Hoy</h2>

        {planNutricional.comidasDiarias?.length > 0 ? (
          <div className="space-y-4">
            {planNutricional.comidasDiarias.map((comida: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{comida.nombre}</h3>
                  <span className="text-sm text-gray-500">{comida.horario}</span>
                </div>

                <div className="space-y-2">
                  {comida.alimentos?.map((alimento: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-1">
                      <span className="text-gray-700">{alimento.nombre}</span>
                      <span className="text-sm text-gray-500">{alimento.porcion}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span>Calorías: {comida.calorias} kcal</span>
                    <span>Proteínas: {comida.proteinas}g</span>
                    <span>Carbs: {comida.carbohidratos}g</span>
                    <span>Grasas: {comida.grasas}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">🍽️</div>
            <p className="text-gray-500">No hay comidas programadas para hoy</p>
          </div>
        )}
      </div>

      {/* Consejos y Recomendaciones */}
      {planNutricional.recomendaciones && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recomendaciones</h2>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-gray-700">{planNutricional.recomendaciones}</div>
          </div>
        </div>
      )}

      {/* Progreso Semanal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Progreso de la Semana</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dia, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{dia}</div>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium ${
                planNutricional.progresoSemanal?.[index]?.cumplido
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {planNutricional.progresoSemanal?.[index]?.cumplido ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumnoPlanNutricional;
