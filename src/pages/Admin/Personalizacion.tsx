import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { personalizacionService } from '../../api/services/personalizacion';

interface PersonalizacionConfig {
  id?: number;
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  tipografia: {
    fuentePrincipal: string;
    fuenteSecundaria: string;
    tamanoBase: number;
  };
  layout: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'auto';
    borderRadius: number;
    spacing: number;
  };
  componentes: {
    mostrarLogos: boolean;
    mostrarIconos: boolean;
    animaciones: boolean;
    transiciones: boolean;
  };
}

const Personalizacion: React.FC = () => {
  console.log('Personalizacion component is rendering');
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PersonalizacionConfig>({
    colores: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#111827'
    },
    tipografia: {
      fuentePrincipal: 'Inter',
      fuenteSecundaria: 'Roboto',
      tamanoBase: 16
    },
    layout: {
      sidebarCollapsed: false,
      theme: 'light',
      borderRadius: 8,
      spacing: 16
    },
    componentes: {
      mostrarLogos: true,
      mostrarIconos: true,
      animaciones: true,
      transiciones: true
    }
  });

  // API query para obtener configuración de personalización
  const { data: config, isLoading } = useQuery({
    queryKey: ['personalizacion-config'],
    queryFn: () => personalizacionService.getConfiguracionPersonalizacion()
  });

  // API mutation para guardar configuración de personalización
  const saveMutation = useMutation({
    mutationFn: (data: PersonalizacionConfig) => personalizacionService.actualizarConfiguracionPersonalizacion(data),
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Personalización guardada',
        message: 'Los cambios han sido aplicados correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['personalizacion-config'] });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al guardar la personalización',
      });
    }
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleColorChange = (colorType: keyof PersonalizacionConfig['colores'], value: string) => {
    setFormData(prev => ({
      ...prev,
      colores: {
        ...prev.colores,
        [colorType]: value
      }
    }));
  };

  const handleTipografiaChange = (field: keyof PersonalizacionConfig['tipografia'], value: any) => {
    setFormData(prev => ({
      ...prev,
      tipografia: {
        ...prev.tipografia,
        [field]: value
      }
    }));
  };

  const handleLayoutChange = (field: keyof PersonalizacionConfig['layout'], value: any) => {
    setFormData(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [field]: value
      }
    }));
  };

  const handleComponentesChange = (field: keyof PersonalizacionConfig['componentes'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      componentes: {
        ...prev.componentes,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const resetToDefaults = () => {
    setFormData({
      colores: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#111827'
      },
      tipografia: {
        fuentePrincipal: 'Inter',
        fuenteSecundaria: 'Roboto',
        tamanoBase: 16
      },
      layout: {
        sidebarCollapsed: false,
        theme: 'light',
        borderRadius: 8,
        spacing: 16
      },
      componentes: {
        mostrarLogos: true,
        mostrarIconos: true,
        animaciones: true,
        transiciones: true
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Personalización de Aplicación</h1>
        <div className="flex gap-3">
          <Button
            onClick={resetToDefaults}
            variant="secondary"
          >
            Restaurar Predeterminados
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={saveMutation.isPending}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Aplicar Cambios
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Esquema de Colores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Esquema de Colores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Primario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colores.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colores.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Secundario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colores.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colores.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#6B7280"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Acento
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colores.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colores.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#10B981"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fondo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colores.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colores.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.colores.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colores.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="#111827"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tipografía */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tipografía</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuente Principal
              </label>
              <select
                value={formData.tipografia.fuentePrincipal}
                onChange={(e) => handleTipografiaChange('fuentePrincipal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuente Secundaria
              </label>
              <select
                value={formData.tipografia.fuenteSecundaria}
                onChange={(e) => handleTipografiaChange('fuenteSecundaria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño Base (px)
              </label>
              <input
                type="number"
                min="12"
                max="24"
                value={formData.tipografia.tamanoBase}
                onChange={(e) => handleTipografiaChange('tamanoBase', parseInt(e.target.value) || 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Layout y Tema */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Layout y Tema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema
              </label>
              <select
                value={formData.layout.theme}
                onChange={(e) => handleLayoutChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radio de Bordes (px)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.layout.borderRadius}
                onChange={(e) => handleLayoutChange('borderRadius', parseInt(e.target.value) || 8)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espaciado Base (px)
              </label>
              <input
                type="number"
                min="8"
                max="32"
                value={formData.layout.spacing}
                onChange={(e) => handleLayoutChange('spacing', parseInt(e.target.value) || 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.layout.sidebarCollapsed}
                  onChange={(e) => handleLayoutChange('sidebarCollapsed', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Sidebar Colapsado por Defecto</span>
              </label>
            </div>
          </div>
        </div>

        {/* Componentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Componentes y Animaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.componentes.mostrarLogos}
                  onChange={(e) => handleComponentesChange('mostrarLogos', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Mostrar Logos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.componentes.mostrarIconos}
                  onChange={(e) => handleComponentesChange('mostrarIconos', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Mostrar Iconos</span>
              </label>
            </div>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.componentes.animaciones}
                  onChange={(e) => handleComponentesChange('animaciones', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Habilitar Animaciones</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.componentes.transiciones}
                  onChange={(e) => handleComponentesChange('transiciones', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Habilitar Transiciones</span>
              </label>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vista Previa</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: formData.colores.primary }}
              ></div>
              <span style={{ color: formData.colores.text, fontFamily: formData.tipografia.fuentePrincipal }}>
                Botón Primario
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: formData.colores.secondary }}
              ></div>
              <span style={{ color: formData.colores.text, fontFamily: formData.tipografia.fuenteSecundaria }}>
                Texto Secundario
              </span>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: formData.colores.background,
                borderRadius: `${formData.layout.borderRadius}px`,
                color: formData.colores.text
              }}
            >
              <p style={{ fontSize: `${formData.tipografia.tamanoBase}px` }}>
                Este es un ejemplo de cómo se vería el contenido con la configuración actual.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Personalizacion;
