import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alumnosService } from '../../api/services/alumnos';
import { pagosService } from '../../api/services/pagos';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

interface CuentaCorrienteItem {
  alumno: {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    estado: string;
  };
  saldo: number;
  ultimoPago: string;
}

const CuentaCorriente: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: alumnos, isLoading: loadingAlumnos } = useQuery({
    queryKey: ['alumnos'],
    queryFn: () => alumnosService.getAlumnos({ limit: 1000 })
  });

  const { data: pagos, isLoading: loadingPagos } = useQuery({
    queryKey: ['pagos'],
    queryFn: () => pagosService.getPagos({ limit: 10000 })
  });

  const calcularCuentaCorriente = (): CuentaCorrienteItem[] => {
    if (!alumnos?.data || !pagos?.data) return [];

    return alumnos.data.map((alumno: any) => {
      const pagosAlumno = pagos.data.filter((pago: any) => pago.alumnoId === alumno.id);
      const saldo = pagosAlumno.reduce((total: number, pago: any) => total + pago.monto, 0);

      const ultimoPago = pagosAlumno.length > 0
        ? pagosAlumno.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0].fecha
        : 'Sin pagos';

      return {
        alumno: {
          id: alumno.id,
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          dni: alumno.dni,
          estado: alumno.estado
        },
        saldo,
        ultimoPago
      };
    });
  };

  const filteredData = calcularCuentaCorriente().filter(item =>
    item.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alumno.dni.includes(searchTerm)
  );

  const handleVerDetalle = (alumnoId: number) => {
    addToast({
      type: 'info',
      title: 'Funcionalidad pendiente',
      message: 'La vista de detalle estará disponible próximamente',
    });
  };

  if (loadingAlumnos || loadingPagos) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cuenta Corriente</h1>
      </div>

      {/* KPI Total Alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
          <p className="text-2xl font-bold text-blue-600">
            {alumnos?.data?.length || 0}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar alumno
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, apellido o DNI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Tabla de cuentas corrientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron alumnos
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.alumno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.alumno.nombre} {item.alumno.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.alumno.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.alumno.estado === 'ACTIVO'
                          ? 'bg-green-100 text-green-800'
                          : item.alumno.estado === 'SUSPENDIDO'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={item.saldo >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ${item.saldo.toLocaleString('es-AR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ultimoPago === 'Sin pagos'
                        ? item.ultimoPago
                        : new Date(item.ultimoPago).toLocaleDateString('es-AR')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleVerDetalle(item.alumno.id)}
                      >
                        Ver Detalle
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

export default CuentaCorriente;
