import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configService } from '../../api/services/config';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

const Configuracion: React.FC = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'general' | 'personalizacion' | 'usuarios' | 'permisos'>('general');
  const [configData, setConfigData] = useState({
    nombreGimnasio: '',
    direccion: '',
    telefono: '',
    email: '',
    horarioApertura: '',
    horarioCierre: '',
    tiempoTolerancia: '15',
  });

  const { data: config, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: configService.getConfig
  });
  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: configService.getUsuarios
  });

  const updateConfigMutation = useMutation({
    mutationFn: configService.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      addToast({
        type: 'success',
        title: 'Configuración guardada',
        message: 'Los cambios se han guardado correctamente',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error al guardar la configuración',
      });
    },
  });

  const handleSaveConfig = () => {
    updateConfigMutation.mutate(configData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'general', label: 'Generales', icon: '⚙️' },
            { key: 'personalizacion', label: 'Personalización', icon: '🎨' },
            { key: 'usuarios', label: 'Usuarios', icon: '👥' },
            { key: 'permisos', label: 'Permisos', icon: '🔐' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de Tabs */}
      <div className="max-w-4xl">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="kpi-card">
              <h3 className="text-lg font-semibold mb-4">Información del Gimnasio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Gimnasio *
                  </label>
                  <input
                    type="text"
                    value={configData.nombreGimnasio}
                    onChange={(e) => setConfigData(prev => ({ ...prev, nombreGimnasio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="MC GYM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={configData.telefono}
                    onChange={(e) => setConfigData(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={configData.direccion}
                    onChange={(e) => setConfigData(prev => ({ ...prev, direccion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Av. Siempre Viva 123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={configData.email}
                    onChange={(e) => setConfigData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="info@mcgym.com"
                  />
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <h3 className="text-lg font-semibold mb-4">Horarios y Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario Apertura
                  </label>
                  <input
                    type="time"
                    value={configData.horarioApertura}
                    onChange={(e) => setConfigData(prev => ({ ...prev, horarioApertura: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario Cierre
                  </label>
                  <input
                    type="time"
                    value={configData.horarioCierre}
                    onChange={(e) => setConfigData(prev => ({ ...prev, horarioCierre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tolerancia (minutos)
                  </label>
                  <input
                    type="number"
                    value={configData.tiempoTolerancia}
                    onChange={(e) => setConfigData(prev => ({ ...prev, tiempoTolerancia: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                    max="60"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveConfig}
                isLoading={updateConfigMutation.isPending}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="kpi-card">
            <h3 className="text-lg font-semibold mb-4">Gestión de Usuarios</h3>
            <div className="space-y-4">
              {usuarios?.map((usuario: any) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">{usuario.nombre} {usuario.apellido}</p>
                    <p className="text-sm text-gray-600">{usuario.email} • {usuario.rol}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      Editar
                    </Button>
                    <Button size="sm" variant="danger">
                      Desactivar
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">
                + Agregar Nuevo Usuario
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'personalizacion' && (
          <div className="kpi-card">
            <h3 className="text-lg font-semibold mb-4">Personalización de la Aplicación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex gap-2">
                  {['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo del Gimnasio
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Arrastra tu logo aquí o haz clic para subir</p>
                  <Button variant="secondary" className="mt-2">
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'permisos' && (
          <div className="kpi-card">
            <h3 className="text-lg font-semibold mb-4">Gestión de Permisos</h3>
            <p className="text-gray-600">Configura los permisos por rol de usuario.</p>
            {/* Aquí iría una tabla compleja de permisos */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracion;