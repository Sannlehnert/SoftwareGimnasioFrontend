import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastProvider';
import { useNavigate } from 'react-router-dom';
import { RevenueChart, AttendanceChart } from '../../components/charts/DashboardCharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
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
      description: 'Total de miembros con cuota al día',
      action: 'alumnos'
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,230',
      change: '+8%',
      trend: 'up',
      icon: '💰',
      color: 'success',
      description: 'Recaudación mensual actual',
      action: 'informes'
    },
    {
      title: 'Clases Hoy',
      value: '24',
      change: '0%',
      trend: 'neutral',
      icon: '🎯',
      color: 'warning',
      description: 'Actividades programadas para hoy',
      action: 'turnos'
    },
    {
      title: 'Asistencia Promedio',
      value: '87%',
      change: '+3%',
      trend: 'up',
      icon: '📊',
      color: 'accent',
      description: 'Promedio de asistencia semanal',
      action: 'asistencia'
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
        <header className="mb-8" role="banner">
          <h1 className="text-4xl font-bold text-display bg-gradient-primary bg-clip-text text-transparent mb-3 leading-tight">
            ¡Bienvenido de vuelta, {user?.nombre?.split(' ')[0]}! 👋
          </h1>
          <p className="text-neutral-600 text-xl leading-relaxed">
            Aquí tienes un resumen del estado de tu gimnasio
          </p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              className="kpi-card animate-fade-in group cursor-pointer hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
              role="button"
              tabIndex={0}
              aria-labelledby={`kpi-title-${index}`}
              aria-describedby={`kpi-description-${index} kpi-tooltip-${index}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/${kpi.action}`);
                }
              }}
              onClick={() => {
                navigate(`/${kpi.action}`);
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br from-${kpi.color}-100 to-${kpi.color}-200 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-md transition-shadow`}>
                  <span className="text-4xl" role="img" aria-label={kpi.title}>{kpi.icon}</span>
                </div>
                <div className={`flex items-center gap-1 px-4 py-2 rounded-full text-base font-semibold shadow-soft ${
                  kpi.trend === 'up' ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200' :
                  kpi.trend === 'down' ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200' :
                  'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200'
                }`}>
                  {kpi.trend === 'up' && <span aria-hidden="true">↗️</span>}
                  {kpi.trend === 'down' && <span aria-hidden="true">↘️</span>}
                  {kpi.trend === 'neutral' && <span aria-hidden="true">→</span>}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div>
                <h3 id={`kpi-title-${index}`} className="text-4xl font-bold text-neutral-900 mb-3 leading-tight">{kpi.value}</h3>
                <p id={`kpi-description-${index}`} className="text-lg text-neutral-700 font-semibold mb-2">{kpi.title}</p>
                <div id={`kpi-tooltip-${index}`} className="text-sm text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {kpi.description}
                </div>
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
                    navigate(`/${action.action}`);
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
            <div className="h-64">
              <RevenueChart />
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
            <div className="h-64">
              <AttendanceChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
