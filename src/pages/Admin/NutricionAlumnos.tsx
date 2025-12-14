import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for nutrition plan students - replace with actual API call
const mockAlumnosPlan = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    dni: '12345678',
    email: 'juan.perez@email.com',
    telefono: '1123456789',
    fechaInscripcion: '2024-01-15',
    progreso: 75,
    estado: 'ACTIVO',
    ultimoSeguimiento: '2024-01-20',
    pesoInicial: 85.5,
    pesoActual: 82.0,
    objetivo: 'Pérdida de peso'
  },
  {
    id: 2,
    nombre: 'María García',
    dni: '87654321',
    email: 'maria.garcia@email.com',
    telefono: '1198765432',
    fechaInscripcion: '2024-01-10',
    progreso: 60,
    estado: 'ACTIVO',
    ultimoSeguimiento: '2024-01-18',
    pesoInicial: 70.2,
    pesoActual: 68.8,
    objetivo: 'Definición muscular'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    dni: '11223344',
    email: 'carlos.rodriguez@email.com',
    telefono: '1155566677',
    fechaInscripcion: '2024-01-05',
    progreso: 90,
    estado: 'ACTIVO',
    ultimoSeguimiento: '2024-01-22',
    pesoInicial: 92.1,
    pesoActual: 89.5,
    objetivo: 'Ganancia muscular'
  },
  {
    id: 4,
    nombre: 'Ana López',
    dni: '44332211',
    email: 'ana.lopez@email.com',
    telefono: '1188899900',
    fechaInscripcion: '2024-01-08',
    progreso: 45,
    estado: 'SUSPENDIDO',
    ultimoSeguimiento: '2024-01-15',
    pesoInicial: 65.8,
    pesoActual: 65.8,
    objetivo: 'Mantenimiento'
  }
];

const NutricionAlumnos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');

  const { data: plan, isLoading: loadingPlan } = useQuery({
    queryKey: ['plan-nutricion', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { id: 1, nombre: 'Plan Básico', nutricionista: 'Dra. María González' };
    },
    enabled: !!id
  });

  const { data: alumnos, isLoading: loadingAlumnos } = useQuery({
    queryKey: ['alumnos-plan-nutricion', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAlumnosPlan;
    },
    enabled: !!id
  });

  const filteredAlumnos = alumnos?.filter(alumno => {
    const matchesSearch = alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alumno.dni.includes(searchTerm) ||
                         alumno.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === 'TODOS' || alumno.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  }) || [];

  const handleVerAlumno = (alumnoId: number) => {
    navigate(`/alumnos/${alumnoId}`);
  };

  const handleSeguimiento = (alumnoId: number) => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'El seguimiento nutricional estará disponible próximamente',
    });
  };

  if (loadingPlan || loadingAlumnos) {
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
          <h1 className="text-2xl font-bold text-gray-900">Alumnos - {plan.nombre}</h1>
          <p className="text-gray-600">Nutricionista: {plan.nutricionista}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/nutricion/${plan.id}`)}
            variant="secondary"
          >
            Ver Plan
          </Button>
          <Button onClick={() => navigate('/nutricion')} variant="secondary">
            ← Volver
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
          <p className="text-2xl font-bold text-blue-600">{alumnos?.length || 0}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Alumnos Activos</p>
          <p className="text-2xl font-bold text-success">
            {alumnos?.filter(a => a.estado === 'ACTIVO').length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
          <p className="text-2xl font-bold text-purple-600">
            {alumnos?.length ? Math.round(alumnos.reduce((sum, a) => sum + a.progreso, 0) / alumnos.length) : 0}%
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Peso Perdido Total</p>
          <p className="text-2xl font-bold text-warning">
            {alumnos?.reduce((total, a) => total + (a.pesoInicial - a.pesoActual), 0).toFixed(1) || '0'} kg
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar alumno
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, DNI o email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="SUSPENDIDO">Suspendido</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchTerm('');
                setEstadoFilter('TODOS');
              }}
              variant="secondary"
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de alumnos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objetivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Seguimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlumnos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron alumnos
                  </td>
                </tr>
              ) : (
                filteredAlumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {alumno.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          DNI: {alumno.dni}
                        </div>
                        <div className="text-sm text-gray-500">
                          {alumno.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alumno.estado === 'ACTIVO' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${alumno.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {alumno.progreso}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>Inicial: {alumno.pesoInicial}kg</div>
                        <div>Actual: {alumno.pesoActual}kg</div>
                        <div className="font-medium text-success">
                          Perdidos: {(alumno.pesoInicial - alumno.pesoActual).toFixed(1)}kg
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alumno.objetivo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(alumno.ultimoSeguimiento).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleVerAlumno(alumno.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSeguimiento(alumno.id)}
                      >
                        Seguimiento
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

export default NutricionAlumnos;
