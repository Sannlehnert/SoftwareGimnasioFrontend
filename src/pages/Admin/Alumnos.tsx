import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { alumnosService } from '../../api/services/alumnos';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const Alumnos: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');
  const [planFilter, setPlanFilter] = useState('TODOS');

  const { data: alumnos, isLoading, error } = useQuery({
    queryKey: ['alumnos', search, estadoFilter, planFilter],
    queryFn: () => alumnosService.getAlumnos({
      search,
      estado: estadoFilter !== 'TODOS' ? estadoFilter : undefined,
      plan: planFilter !== 'TODOS' ? planFilter : undefined,
    })
  });

  const columns = [
    { key: 'dni', label: 'DNI' },
    {
      key: 'nombre',
      label: 'Nombre',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value} {row.apellido}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      )
    },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'plan', label: 'Plan' },
    { 
      key: 'fechaVencimiento', 
      label: 'Vencimiento', 
      render: (value: string, row: any) => {
        const vencimiento = new Date(value);
        const hoy = new Date();
        const diffDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        
        let color = 'text-gray-600';
        if (diffDias < 0) color = 'text-error';
        else if (diffDias <= 7) color = 'text-warning';
        else if (diffDias <= 30) color = 'text-blue-600';
        
        return (
          <span className={color}>
            {vencimiento.toLocaleDateString('es-AR')}
            {diffDias < 0 && ` (Vencido)`}
            {diffDias >= 0 && diffDias <= 30 && ` (${diffDias} días)`}
          </span>
        );
      }
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ACTIVO' ? 'bg-success/10 text-success' :
          value === 'SUSPENDIDO' ? 'bg-warning/10 text-warning' :
          'bg-error/10 text-error'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  // Calcular estadísticas
  const estadisticas = {
    total: alumnos?.data?.length || 0,
    activos: alumnos?.data?.filter((a: any) => a.estado === 'ACTIVO').length || 0,
    vencidos: alumnos?.data?.filter((a: any) => {
      const vencimiento = new Date(a.fechaVencimiento);
      return vencimiento < new Date() && a.estado === 'ACTIVO';
    }).length || 0,
    suspendidos: alumnos?.data?.filter((a: any) => a.estado === 'SUSPENDIDO').length || 0,
  };

  if (error) {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Error al cargar los alumnos',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h1>
        <Button onClick={() => navigate('/alumnos/nuevo')}>
          + Nuevo Alumno
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
          <p className="text-2xl font-bold">{estadisticas.total}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Activos</p>
          <p className="text-2xl font-bold text-success">{estadisticas.activos}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Cuotas Vencidas</p>
          <p className="text-2xl font-bold text-error">{estadisticas.vencidos}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm font-medium text-gray-600">Suspendidos</p>
          <p className="text-2xl font-bold text-warning">{estadisticas.suspendidos}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nombre, Apellido, DNI o Email"
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
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="TODOS">Todos los planes</option>
              <option value="Full Mensual">Full Mensual</option>
              <option value="Semestral">Semestral</option>
              <option value="Drop-in">Drop-in</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearch('');
                setEstadoFilter('TODOS');
                setPlanFilter('TODOS');
              }}
              variant="secondary"
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <DataTable
        columns={columns}
        data={alumnos?.data || []}
        totalItems={alumnos?.total || 0}
        serverSidePagination={true}
        onPageChange={(page: number) => {
          // La paginación se maneja automáticamente con react-query
        }}
        loading={isLoading}
        searchable={false}
        selectable={true}
        onSelectionChange={(selectedRows) => {
          console.log('Alumnos seleccionados:', selectedRows);
        }}
        actions={(row) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => navigate(`/alumnos/${row.id}`)}
            >
              Ver Detalle
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/pagos/nuevo?alumnoId=${row.id}`)}
            >
              Cobrar
            </Button>
          </div>
        )}
      />

      {/* Acciones Masivas */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Acciones Masivas</h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // Implementar exportación a Excel
              const csvContent = "data:text/csv;charset=utf-8,"
                + alumnos?.data?.map((row: any) =>
                  [row.dni, row.nombre, row.apellido, row.email, row.telefono, row.plan, row.fechaVencimiento, row.estado].join(",")
                ).join("\n");

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "alumnos.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              addToast({
                type: 'success',
                title: 'Exportación completada',
                message: 'Los datos se han exportado correctamente',
              });
            }}
          >
            Exportar a Excel
          </Button>
          <Button variant="secondary" size="sm">
            Enviar Recordatorio
          </Button>
          <Button variant="secondary" size="sm">
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Alumnos;