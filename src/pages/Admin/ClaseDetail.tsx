import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data - replace with actual API
const mockClaseDetail = {
  id: 1,
  nombre: 'CrossFit',
  descripcion: 'Entrenamiento funcional de alta intensidad que combina ejercicios de fuerza, gimnasia y acondicionamiento metabólico.',
  instructor: 'Juan Pérez',
  capacidad: 15,
  precio: 2500,
  dias: ['Lunes', 'Miércoles', 'Viernes'],
  horario: '19:00 - 20:00',
  estado: 'ACTIVA',
  duracion: 60,
  nivel: 'Intermedio',
  requisitos: 'Buena condición física general',
  equipo: ['Barra olímpica', 'Discos', 'Cajas de saltos', 'Anillas'],
  alumnosInscritos: 12,
  alumnos: [
    { id: 1, nombre: 'María García', email: 'maria@email.com', asistencias: 8 },
    { id: 2, nombre: 'Carlos López', email: 'carlos@email.com', asistencias: 6 },
    { id: 3, nombre: 'Ana Rodríguez', email: 'ana@email.com', asistencias: 10 },
  ]
};

const ClaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'alumnos' | 'horarios'>('info');

  const { data: clase, isLoading } = useQuery({
    queryKey: ['clase', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockClaseDetail;
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

  if (!clase) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clase no encontrada</h2>
        <Button onClick={() => navigate('/clases')}>Volver al listado</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{clase.nombre}</h1>
          <p className="text-gray-600">Instructor: {clase.instructor}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/clases/${clase.id}/editar`)}
          >
            Editar Clase
          </Button>
          <Button onClick={() => navigate('/clases')}>
            ← Volver a Clases
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Capacidad</p>
          <p className="text-2xl font-bold text-blue-600">
            {clase.alumnosInscritos}/{clase.capacidad}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Precio</p>
          <p className="text-2xl font-bold text-success">
            ${clase.precio.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Duración</p>
          <p className="text-2xl font-bold text-purple-600">{clase.duracion} min</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Estado</p>
          <span className={`px-3 py-1 text-sm rounded-full ${
            clase.estado === 'ACTIVA' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            {clase.estado}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'info', label: 'Información' },
            { key: 'alumnos', label: 'Alumnos' },
            { key: 'horarios', label: 'Horarios' },
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
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Detalles de la Clase</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descripción</label>
                    <p className="text-gray-900 mt-1">{clase.descripcion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Instructor</label>
                    <p className="text-gray-900 mt-1">{clase.instructor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nivel</label>
                    <p className="text-gray-900 mt-1">{clase.nivel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Requisitos</label>
                    <p className="text-gray-900 mt-1">{clase.requisitos}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Equipo Necesario</h3>
                <div className="grid grid-cols-2 gap-2">
                  {clase.equipo.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alumnos inscritos</span>
                    <span className="text-sm font-medium">{clase.alumnosInscritos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacidad disponible</span>
                    <span className="text-sm font-medium">{clase.capacidad - clase.alumnosInscritos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ocupación</span>
                    <span className="text-sm font-medium">
                      {Math.round((clase.alumnosInscritos / clase.capacidad) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alumnos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Alumnos Inscritos ({clase.alumnos.length})</h3>
              <Button size="sm">Agregar Alumno</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alumno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asistencias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clase.alumnos.map((alumno) => (
                    <tr key={alumno.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{alumno.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alumno.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alumno.asistencias}/12 clases
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button size="sm" variant="secondary">
                          Ver Perfil
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'horarios' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Horarios de la Clase</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clase.dias.map((dia) => (
                <div key={dia} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{dia}</h4>
                      <p className="text-sm text-gray-600">{clase.horario}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Activa
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">Próximas Clases</h4>
              <div className="space-y-2">
                {['15/01/2024', '17/01/2024', '22/01/2024'].map((fecha) => (
                  <div key={fecha} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fecha}</p>
                        <p className="text-xs text-gray-500">{clase.horario}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {clase.alumnosInscritos}/{clase.capacidad} alumnos
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaseDetail;
