import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';
import { useLocation } from 'react-router-dom';

interface ConfiguracionGeneral {
  id?: number;
  nombreGimnasio: string;
  direccion: string;
  telefono: string;
  email: string;
  cuit: string;
  ivaResponsable: boolean;
  logoUrl?: string;
  sitioWeb?: string;
  redesSociales: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  horarioAtencion: {
    lunes: { apertura: string; cierre: string };
    martes: { apertura: string; cierre: string };
    miercoles: { apertura: string; cierre: string };
    jueves: { apertura: string; cierre: string };
    viernes: { apertura: string; cierre: string };
    sabado: { apertura: string; cierre: string };
    domingo: { apertura: string; cierre: string };
  };
  configuracionPago: {
    cuotaMensual: number;
    descuentoPagoAdelantado: number;
    diasGracia: number;
    penalizacionMora: number;
  };
}

const Generales: React.FC = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ConfiguracionGeneral>({
    nombreGimnasio: 'MC GYM',
    direccion: '',
    telefono: '',
    email: '',
    cuit: '',
    ivaResponsable: false,
    sitioWeb: '',
    redesSociales: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    horarioAtencion: {
      lunes: { apertura: '06:00', cierre: '22:00' },
      martes: { apertura: '06:00', cierre: '22:00' },
      miercoles: { apertura: '06:00', cierre: '22:00' },
      jueves: { apertura: '06:00', cierre: '22:00' },
      viernes: { apertura: '06:00', cierre: '22:00' },
      sabado: { apertura: '08:00', cierre: '20:00' },
      domingo: { apertura: '09:00', cierre: '18:00' }
    },
    configuracionPago: {
      cuotaMensual: 0,
      descuentoPagoAdelantado: 0,
      diasGracia: 0,
      penalizacionMora: 0
    }
  });

  // Mock query para obtener configuración (simulando API)
  const { data: config, isLoading } = useQuery({
    queryKey: ['configuracion-general'],
    queryFn: async () => {
      // Simular llamada a API
      return new Promise<ConfiguracionGeneral>((resolve) => {
        setTimeout(() => {
          resolve(formData);
        }, 500);
      });
    }
  });

  // Mock mutation para guardar configuración
  const saveMutation = useMutation({
    mutationFn: async (data: ConfiguracionGeneral) => {
      // Simular llamada a API
      return new Promise<ConfiguracionGeneral>((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      });
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Configuración guardada',
        message: 'Los cambios han sido guardados correctamente',
      });
      queryClient.invalidateQueries({ queryKey: ['configuracion-general'] });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al guardar la configuración',
      });
    }
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ConfiguracionGeneral] as any,
        [field]: value
      }
    }));
  };

  const handleHorarioChange = (dia: string, tipo: 'apertura' | 'cierre', value: string) => {
    setFormData(prev => ({
      ...prev,
      horarioAtencion: {
        ...prev.horarioAtencion,
        [dia]: {
          ...prev.horarioAtencion[dia as keyof typeof prev.horarioAtencion],
          [tipo]: value
        }
      }
    }));
  };

  const handleRedesSocialesChange = (red: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      redesSociales: {
        ...prev.redesSociales,
        [red]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
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
        <h1 className="text-3xl font-bold text-gray-900">Configuración General</h1>
        <Button
          onClick={handleSubmit}
          isLoading={saveMutation.isPending}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Guardar Cambios
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información del Gimnasio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Gimnasio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Gimnasio *
              </label>
              <input
                type="text"
                value={formData.nombreGimnasio}
                onChange={(e) => handleInputChange('nombreGimnasio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CUIT
              </label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => handleInputChange('cuit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.sitioWeb}
                onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                placeholder="https://www.mcgym.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.ivaResponsable}
                onChange={(e) => handleInputChange('ivaResponsable', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Responsable Inscripto IVA</span>
            </label>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={formData.redesSociales.facebook}
                onChange={(e) => handleRedesSocialesChange('facebook', e.target.value)}
                placeholder="https://facebook.com/mcgym"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={formData.redesSociales.instagram}
                onChange={(e) => handleRedesSocialesChange('instagram', e.target.value)}
                placeholder="https://instagram.com/mcgym"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter/X
              </label>
              <input
                type="url"
                value={formData.redesSociales.twitter}
                onChange={(e) => handleRedesSocialesChange('twitter', e.target.value)}
                placeholder="https://twitter.com/mcgym"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Horarios de Atención */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Horarios de Atención</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(formData.horarioAtencion).map(([dia, horario]) => (
              <div key={dia} className="space-y-3">
                <h3 className="font-medium text-gray-900 capitalize">{dia}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Apertura
                    </label>
                    <input
                      type="time"
                      value={horario.apertura}
                      onChange={(e) => handleHorarioChange(dia, 'apertura', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cierre
                    </label>
                    <input
                      type="time"
                      value={horario.cierre}
                      onChange={(e) => handleHorarioChange(dia, 'cierre', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuración de Pagos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Pagos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuota Mensual ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.configuracionPago.cuotaMensual === 0 ? '' : formData.configuracionPago.cuotaMensual}
                onChange={(e) => handleNestedChange('configuracionPago', 'cuotaMensual', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento Pago Adelantado (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.configuracionPago.descuentoPagoAdelantado === 0 ? '' : formData.configuracionPago.descuentoPagoAdelantado}
                onChange={(e) => handleNestedChange('configuracionPago', 'descuentoPagoAdelantado', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Días de Gracia
              </label>
              <input
                type="number"
                min="0"
                value={formData.configuracionPago.diasGracia === 0 ? '' : formData.configuracionPago.diasGracia}
                onChange={(e) => handleNestedChange('configuracionPago', 'diasGracia', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penalización por Mora (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.configuracionPago.penalizacionMora === 0 ? '' : formData.configuracionPago.penalizacionMora}
                onChange={(e) => handleNestedChange('configuracionPago', 'penalizacionMora', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Logo y Branding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Logo y Branding</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL del Logo
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            {formData.logoUrl && (
              <div className="flex items-center space-x-4">
                <img
                  src={formData.logoUrl}
                  alt="Logo del gimnasio"
                  className="w-16 h-16 object-contain border border-gray-200 rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-sm text-gray-600">Vista previa del logo</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Generales;
