import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for classes - replace with actual API call
const mockClases = [
  {
    id: 1,
    nombre: 'CrossFit',
    descripcion: 'Entrenamiento funcional de alta intensidad',
    instructor: 'Juan Pérez',
    capacidad: 15,
    precio: 2500,
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    horario: '19:00 - 20:00',
    estado: 'ACTIVA'
  },
  {
    id: 2,
    nombre: 'Yoga',
    descripcion: 'Clases de yoga para relajación y flexibilidad',
    instructor: 'María García',
    capacidad: 20,
    precio: 1800,
    dias: ['Martes', 'Jueves'],
    horario: '18:00 - 19:00',
    estado: 'ACTIVA'
  },
  {
    id: 3,
    nombre: 'Spinning',
    descripcion: 'Clases de ciclismo indoor',
    instructor: 'Carlos Rodríguez',
    capacidad: 12,
    precio: 2000,
    dias: ['Lunes', 'Miércoles', 'Viernes'],
    horario: '20:00 - 21:00',
    estado: 'ACTIVA'
  }
];

const Clases: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock query - replace with actual API service
  const { data: clases, isLoading } = useQuery({
    queryKey: ['clases'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockClases;
    }
  });

  const filteredClases = clases?.filter(clase =>
    clase.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clase.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNuevaClase = () => {
    navigate('/clases/nueva');
  };

  const handleEditarClase = (claseId: number) => {
    navigate(`/clases/${claseId}/editar`);
  };

  const handleVerDetalle = (claseId: number) => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'La vista de detalle estará disponible próximamente',
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
        <h1 className="text-2xl font-bold text-gray-900">Clases</h1>
        <Button onClick={handleNuevaClase}>
          Nueva Clase
        </Button>
      </div>

      {/* KPI Total Clases */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Clases</p>
          <p className="text-2xl font-bold text-blue-600">
            {clases?.length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Clases Activas</p>
          <p className="text-2xl font-bold text-green-600">
            {clases?.filter(c => c.estado === 'ACTIVA').length || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Capacidad Total</p>
          <p className="text-2xl font-bold text-purple-600">
            {clases?.reduce((total, clase) => total + clase.capacidad, 0) || 0}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
          <p className="text-2xl font-bold text-success">
            ${clases?.reduce((total, clase) => total + clase.precio, 0).toLocaleString('es-AR') || '0'}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar clase
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre de clase o instructor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla de clases */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
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
              {filteredClases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron clases
                  </td>
                </tr>
              ) : (
                filteredClases.map((clase) => (
                  <tr key={clase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {clase.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clase.descripcion}
                        </div>
                        <div className="text-xs text-gray-400">
                          {clase.dias.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {clase.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {clase.horario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {clase.capacidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success">
                      ${clase.precio.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        clase.estado === 'ACTIVA'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {clase.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerDetalle(clase.id)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditarClase(clase.id)}
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

export default Clases;
