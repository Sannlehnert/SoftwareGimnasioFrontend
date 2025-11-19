import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastProvider';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const kpiData = [
    {
      title: 'Alumnos Activos',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: '👥',
      color: 'primary',
      description: 'Total de miembros con cuota al día'
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,230',
      change: '+8%',
      trend: 'up',
      icon: '💰',
      color: 'success',
      description: 'Recaudación mensual actual'
    },
    {
      title: 'Clases Hoy',
      value: '24',
      change: '0%',
      trend: 'neutral',
      icon: '🎯',
      color: 'warning',
      description: 'Actividades programadas para hoy'
    },
    {
      title: 'Asistencia Promedio',
      value: '87%',
      change: '+3%',
      trend: 'up',
      icon: '📊',
      color: 'accent',
      description: 'Promedio de asistencia semanal'
    }
  ];

  const quickActions = [
    {
      title: 'Registrar Acceso',
      description: 'Control de entrada de alumnos',
      icon: '🚪',
      action: 'pantalla-acceso',
      color: 'primary'
    },
    {
      title: 'Nuevo Alumno',
      description: 'Agregar miembro al gimnasio',
      icon: '👤',
      action: 'alumnos',
      color: 'success'
    },
    {
      title: 'Programar Clase',
      description: 'Crear nueva actividad',
      icon: '📅',
      action: 'turnos',
      color: 'warning'
    },
    {
      title: 'Ver Reportes',
      description: 'Análisis de rendimiento',
      icon: '📈',
      action: 'informes',
      color: 'accent'
    }
  ];

  const recentActivities = [
    { type: 'Nuevo Alumno', description: 'Juan Pérez se registró', time: 'Hace 5 min', icon: '👤' },
    { type: 'Pago', description: 'María García pagó su cuota', time: 'Hace 12 min', icon: '💳' },
    { type: 'Clase', description: 'CrossFit completado', time: 'Hace 1 hora', icon: '💪' },
    { type: 'Turno', description: 'Nuevo turno reservado', time: 'Hace 2 horas', icon: '⏰' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-display bg-gradient-primary bg-clip-text text-transparent mb-2">
            ¡Bienvenido de vuelta, {user?.nombre?.split(' ')[0]}! 👋
          </h1>
          <p className="text-neutral-600 text-lg">
            Aquí tienes un resumen del estado de tu gimnasio
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="kpi-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${kpi.color}-100 rounded-xl flex items-center justify-center`}>
                  <span className="text-2xl">{kpi.icon}</span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpi.trend === 'up' ? 'bg-success-100 text-success-800' :
                  kpi.trend === 'down' ? 'bg-error-100 text-error-800' :
                  'bg-neutral-100 text-neutral-800'
                }`}>
                  {kpi.trend === 'up' && <span>↗️</span>}
                  {kpi.trend === 'down' && <span>↘️</span>}
                  {kpi.trend === 'neutral' && <span>→</span>}
                  {kpi.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</h3>
                <p className="text-sm text-neutral-600">{kpi.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Actividad Reciente</h2>
                <button className="btn-ghost text-sm">
                  Ver todo
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-soft">
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{activity.type}</p>
                      <p className="text-sm text-neutral-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-neutral-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Acciones Rápidas</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: `Navegando a ${action.title}`,
                      message: action.description,
                      duration: 2000,
                    });
                    // Aquí iría la navegación real
                    console.log(`Navigate to ${action.action}`);
                  }}
                  className={`w-full btn-${action.color === 'primary' ? 'primary' : 'secondary'} justify-start group animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  title={action.description}
                >
                  <span className="mr-3 text-lg">{action.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              ))}
            </div>

            {/* Hora actual */}
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">
                  {currentTime.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
                <div className="text-sm text-neutral-500">
                  {currentTime.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Ingresos Mensuales</h2>
              <select className="input-primary text-sm w-auto">
                <option>Últimos 6 meses</option>
                <option>Último año</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📈</span>
                </div>
                <p className="text-neutral-600">Gráfico de ingresos próximamente</p>
              </div>
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Asistencia por Día</h2>
              <select className="input-primary text-sm w-auto">
                <option>Esta semana</option>
                <option>Este mes</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-success-50 to-success-100 rounded-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-success-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-neutral-600">Gráfico de asistencia próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
