import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for nutrition plans - replace with actual API call
const mockPlanesNutricion = [
  {
    id: 1,
    nombre: 'Plan Básico',
    descripcion: 'Plan nutricional básico para principiantes',
    nutricionista: 'Dra. María González',
    precio: 1500,
    duracion: '1 mes',
    objetivos: ['Pérdida de peso', 'Ganancia de masa muscular'],
    estado: 'ACTIVO',
    alumnosInscritos: 12
  },
  {
    id: 2,
    nombre: 'Plan Premium',
    descripcion: 'Plan nutricional completo con seguimiento personalizado',
    nutricionista: 'Dr. Carlos Rodríguez',
    precio: 2500,
    duracion: '3 meses',
    objetivos: ['Definición muscular', 'Mejora del rendimiento'],
    estado: 'ACTIVO',
    alumnosInscritos: 8
  },
  {
    id: 3,
    nombre: 'Plan Vegano',
    descripcion: 'Plan nutricional especializado en alimentación vegana',
    nutricionista: 'Lic. Ana López',
    precio: 2000,
    duracion: '2 meses',
    objetivos: ['Alimentación saludable', 'Equilibrio nutricional'],
    estado: 'ACTIVO',
    alumnosInscritos: 5
  }
];

const Nutricion: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock query - replace with actual API service
  const { data: planesNutricion, isLoading } = useQuery({
    queryKey: ['planes-nutricion'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlanesNutricion;
    }
  });

  const filteredPlanes = planesNutricion?.filter(plan =>
    plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.nutricionista.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNuevoPlan = () => {
    navigate('/nutricion/nuevo');
  };

  const handleEditarPlan = (planId: number) => {
    navigate(`/nutricion/${planId}/editar`);
  };

  const handleVerDetalle = (planId: number) => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'La vista de detalle estará disponible próximamente',
    });
  };

  const handleVerAlumnos = (planId: number) => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'La lista de alumnos inscritos estará disponible próximamente',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planes Nutricionales</h1>
        <Button onClick={handleNuevoPlan}>
          Nuevo Plan Nutricional
        </Button>
      </div>

      {/* KPI Planes Nutricionales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Planes</p>
          <p className="text-2xl font-bold text-blue-600">
            {planesNutricion?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Planes Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {planesNutricion?.filter(p => p.estado === 'ACTIVO').length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Alumnos Inscritos</p>
          <p className="text-2xl font-bold text-purple-600">
            {planesNutricion?.reduce((total, plan) => total + plan.alumnosInscritos, 0) || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
          <p className="text-2xl font-bold text-success">
            ${planesNutricion?.reduce((total, plan) => total + (plan.precio * plan.alumnosInscritos), 0).toLocaleString('es-AR') || '0'}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar plan nutricional
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre del plan o nutricionista..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla de planes nutricionales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Nutricional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nutricionista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumnos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlanes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron planes nutricionales
                  </td>
                </tr>
              ) : (
                filteredPlanes.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {plan.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {plan.descripcion}
                        </div>
                        <div className="text-xs text-gray-400">
                          {plan.objetivos.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.nutricionista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.duracion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.alumnosInscritos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success">
                      ${plan.precio.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.estado === 'ACTIVO'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerDetalle(plan.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerAlumnos(plan.id)}
                      >
                        Alumnos
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditarPlan(plan.id)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Nutricion;
