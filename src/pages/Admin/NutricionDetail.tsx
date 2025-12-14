import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for nutrition plan detail - replace with actual API call
const mockPlanDetail = {
  id: 1,
  nombre: 'Plan Básico',
  descripcion: 'Plan nutricional básico para principiantes con enfoque en pérdida de peso saludable y ganancia de masa muscular.',
  nutricionista: 'Dra. María González',
  precio: 1500,
  duracion: '1 mes',
  objetivos: ['Pérdida de peso', 'Ganancia de masa muscular', 'Mejora de hábitos alimenticios'],
  estado: 'ACTIVO',
  fechaCreacion: '2024-01-15',
  ultimaModificacion: '2024-01-20',
  contenido: {
    desayuno: [
      'Avena con frutas y nueces',
      'Yogur griego con granola',
      'Tostadas integrales con aguacate'
    ],
    almuerzo: [
      'Pechuga de pollo con verduras al vapor',
      'Ensalada de quinoa con vegetales',
      'Pescado a la plancha con arroz integral'
    ],
    cena: [
      'Salmón al horno con ensalada',
      'Tortilla de verduras con queso',
      'Puré de verduras con carne magra'
    ],
    snacks: [
      'Frutas frescas',
      'Nueces y semillas',
      'Yogur natural'
    ]
  },
  recomendaciones: [
    'Beber al menos 2 litros de agua al día',
    'Realizar actividad física moderada 3-4 veces por semana',
    'Dormir 7-8 horas diarias',
    'Evitar azúcares refinados y alimentos procesados'
  ],
  contraindicaciones: [
    'No recomendado para personas con diabetes tipo 1',
    'Consultar con médico si hay alergias alimentarias',
    'No apto para embarazadas sin supervisión médica'
  ],
  estadisticas: {
    alumnosInscritos: 12,
    alumnosCompletaron: 8,
    promedioPerdidaPeso: 2.5,
    promedioGananciaMuscular: 1.2,
    satisfaccionPromedio: 4.2
  }
};

const NutricionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'informacion' | 'contenido' | 'estadisticas'>('informacion');

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan-nutricion', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlanDetail;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan nutricional no encontrado</h2>
        <Button onClick={() => navigate('/nutricion')}>Volver a Planes Nutricionales</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{plan.nombre}</h1>
          <p className="text-gray-600">Plan Nutricional - {plan.nutricionista}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/nutricion/${plan.id}/editar`)}
            variant="secondary"
          >
            Editar Plan
          </Button>
          <Button onClick={() => navigate('/nutricion')} variant="secondary">
            ← Volver
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Alumnos Inscritos</p>
          <p className="text-2xl font-bold text-blue-600">{plan.estadisticas.alumnosInscritos}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Completaron Plan</p>
          <p className="text-2xl font-bold text-success">{plan.estadisticas.alumnosCompletaron}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Precio</p>
          <p className="text-2xl font-bold text-purple-600">${plan.precio.toLocaleString('es-AR')}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Satisfacción</p>
          <p className="text-2xl font-bold text-warning">{plan.estadisticas.satisfaccionPromedio}/5</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'informacion', label: 'Información' },
            { key: 'contenido', label: 'Contenido del Plan' },
            { key: 'estadisticas', label: 'Estadísticas' },
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'informacion' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre del Plan</label>
                    <p className="text-gray-900">{plan.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nutricionista</label>
                    <p className="text-gray-900">{plan.nutricionista}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Duración</label>
                    <p className="text-gray-900">{plan.duracion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Precio</label>
                    <p className="text-gray-900">${plan.precio.toLocaleString('es-AR')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      plan.estado === 'ACTIVO' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {plan.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Creación</label>
                    <p className="text-gray-900">{new Date(plan.fechaCreacion).toLocaleDateString('es-AR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Última Modificación</label>
                    <p className="text-gray-900">{new Date(plan.ultimaModificacion).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Descripción</h4>
              <p className="text-gray-700">{plan.descripcion}</p>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Objetivos</h4>
              <div className="flex flex-wrap gap-2">
                {plan.objetivos.map((objetivo, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {objetivo}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Recomendaciones Generales</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {plan.recomendaciones.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-2">Contraindicaciones</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {plan.contraindicaciones.map((contra, index) => (
                  <li key={index}>{contra}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'contenido' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contenido del Plan Nutricional</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Desayunos</h4>
                  <ul className="space-y-2">
                    {plan.contenido.desayuno.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Almuerzos</h4>
                  <ul className="space-y-2">
                    {plan.contenido.almuerzo.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cenas</h4>
                  <ul className="space-y-2">
                    {plan.contenido.cena.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Snacks</h4>
                  <ul className="space-y-2">
                    {plan.contenido.snacks.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Estadísticas del Plan</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Resultados Promedio</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pérdida de peso:</span>
                      <span className="font-semibold text-success">{plan.estadisticas.promedioPerdidaPeso} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ganancia muscular:</span>
                      <span className="font-semibold text-blue-600">{plan.estadisticas.promedioGananciaMuscular} kg</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Satisfacción</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-1">
                      {plan.estadisticas.satisfaccionPromedio}
                    </div>
                    <div className="text-sm text-gray-600">de 5 estrellas</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(plan.estadisticas.satisfaccionPromedio) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Tasa de Finalización</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">
                      {Math.round((plan.estadisticas.alumnosCompletaron / plan.estadisticas.alumnosInscritos) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {plan.estadisticas.alumnosCompletaron} de {plan.estadisticas.alumnosInscritos} alumnos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutricionDetail;
