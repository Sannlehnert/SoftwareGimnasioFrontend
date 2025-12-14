import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastProvider';

// Mock data for nutrition plan - replace with actual API call
const mockPlanData = {
  id: 1,
  nombre: 'Plan Básico',
  descripcion: 'Plan nutricional básico para principiantes con enfoque en pérdida de peso saludable y ganancia de masa muscular.',
  nutricionista: 'Dra. María González',
  precio: 1500,
  duracion: '1 mes',
  objetivos: ['Pérdida de peso', 'Ganancia de masa muscular'],
  estado: 'ACTIVO',
  contenido: {
    desayuno: ['Avena con frutas y nueces', 'Yogur griego con granola', 'Tostadas integrales con aguacate'],
    almuerzo: ['Pechuga de pollo con verduras al vapor', 'Ensalada de quinoa con vegetales', 'Pescado a la plancha con arroz integral'],
    cena: ['Salmón al horno con ensalada', 'Tortilla de verduras con queso', 'Puré de verduras con carne magra'],
    snacks: ['Frutas frescas', 'Nueces y semillas', 'Yogur natural']
  },
  recomendaciones: [
    'Beber al menos 2 litros de agua al día',
    'Realizar actividad física moderada 3-4 veces por semana',
    'Dormir 7-8 horas diarias',
    'Evitar azúcares refinados y alimentos procesados'
  ],
  contraindicaciones: [
    'No recomendado para personas con diabetes tipo 1',
    'Consultar con médico si hay alergias alimentarias',
    'No apto para embarazadas sin supervisión médica'
  ]
};

const EditarNutricion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nutricionista: '',
    precio: 0,
    duracion: '1 mes',
    estado: 'ACTIVO',
    objetivos: [''],
    contenido: {
      desayuno: [''],
      almuerzo: [''],
      cena: [''],
      snacks: ['']
    },
    recomendaciones: [''],
    contraindicaciones: ['']
  });

  const { data: plan, isLoading } = useQuery({
    queryKey: ['plan-nutricion', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlanData;
    },
    enabled: !!id
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...data, id: parseInt(id!) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-nutricion'] });
      queryClient.invalidateQueries({ queryKey: ['plan-nutricion', id] });
      addToast({
        type: 'success',
        title: 'Plan actualizado',
        message: 'El plan nutricional se ha actualizado correctamente',
      });
      navigate(`/nutricion/${id}`);
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar el plan nutricional',
      });
    }
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        nutricionista: plan.nutricionista,
        precio: plan.precio,
        duracion: plan.duracion,
        estado: plan.estado,
        objetivos: plan.objetivos,
        contenido: plan.contenido,
        recomendaciones: plan.recomendaciones,
        contraindicaciones: plan.contraindicaciones
      });
    }
  }, [plan]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleContenidoChange = (categoria: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      contenido: {
        ...prev.contenido,
        [categoria]: prev.contenido[categoria as keyof typeof prev.contenido].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addContenidoItem = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      contenido: {
        ...prev.contenido,
        [categoria]: [...prev.contenido[categoria as keyof typeof prev.contenido], '']
      }
    }));
  };

  const removeContenidoItem = (categoria: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      contenido: {
        ...prev.contenido,
        [categoria]: prev.contenido[categoria as keyof typeof prev.contenido].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanMutation.mutate(formData);
  };

  if (isLoading) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Editar Plan Nutricional</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/nutricion/${id}`)}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updatePlanMutation.isPending}
          >
            {updatePlanMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Plan *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nutricionista *
              </label>
              <input
                type="text"
                value={formData.nutricionista}
                onChange={(e) => handleInputChange('nutricionista', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración *
              </label>
              <select
                value={formData.duracion}
                onChange={(e) => handleInputChange('duracion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="1 mes">1 mes</option>
                <option value="2 meses">2 meses</option>
                <option value="3 meses">3 meses</option>
                <option value="4 meses">4 meses</option>
                <option value="5 meses">5 meses</option>
                <option value="6 meses">6 meses</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Objetivos</h2>
            <Button
              type="button"
              onClick={() => addArrayItem('objetivos')}
              size="sm"
              variant="secondary"
            >
              + Agregar Objetivo
            </Button>
          </div>
          <div className="space-y-2">
            {formData.objetivos.map((objetivo, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => handleArrayChange('objetivos', index, e.target.value)}
                  placeholder="Ej: Pérdida de peso"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {formData.objetivos.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeArrayItem('objetivos', index)}
                    size="sm"
                    variant="secondary"
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Contenido del Plan</h2>

          {/* Desayunos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Desayunos</h3>
              <Button
                type="button"
                onClick={() => addContenidoItem('desayuno')}
                size="sm"
                variant="secondary"
              >
                + Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contenido.desayuno.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContenidoChange('desayuno', index, e.target.value)}
                    placeholder="Ej: Avena con frutas"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.contenido.desayuno.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeContenidoItem('desayuno', index)}
                      size="sm"
                      variant="secondary"
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Almuerzos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Almuerzos</h3>
              <Button
                type="button"
                onClick={() => addContenidoItem('almuerzo')}
                size="sm"
                variant="secondary"
              >
                + Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contenido.almuerzo.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContenidoChange('almuerzo', index, e.target.value)}
                    placeholder="Ej: Pechuga de pollo con verduras"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.contenido.almuerzo.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeContenidoItem('almuerzo', index)}
                      size="sm"
                      variant="secondary"
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cenas */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Cenas</h3>
              <Button
                type="button"
                onClick={() => addContenidoItem('cena')}
                size="sm"
                variant="secondary"
              >
                + Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contenido.cena.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContenidoChange('cena', index, e.target.value)}
                    placeholder="Ej: Salmón al horno"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.contenido.cena.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeContenidoItem('cena', index)}
                      size="sm"
                      variant="secondary"
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Snacks */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900">Snacks</h3>
              <Button
                type="button"
                onClick={() => addContenidoItem('snacks')}
                size="sm"
                variant="secondary"
              >
                + Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contenido.snacks.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleContenidoChange('snacks', index, e.target.value)}
                    placeholder="Ej: Frutas frescas"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.contenido.snacks.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeContenidoItem('snacks', index)}
                      size="sm"
                      variant="secondary"
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recomendaciones</h2>
            <Button
              type="button"
              onClick={() => addArrayItem('recomendaciones')}
              size="sm"
              variant="secondary"
            >
              + Agregar Recomendación
            </Button>
          </div>
          <div className="space-y-2">
            {formData.recomendaciones.map((recomendacion, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={recomendacion}
                  onChange={(e) => handleArrayChange('recomendaciones', index, e.target.value)}
                  placeholder="Ej: Beber al menos 2 litros de agua al día"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {formData.recomendaciones.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeArrayItem('recomendaciones', index)}
                    size="sm"
                    variant="secondary"
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contraindicaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Contraindicaciones</h2>
            <Button
              type="button"
              onClick={() => addArrayItem('contraindicaciones')}
              size="sm"
              variant="secondary"
            >
              + Agregar Contraindicación
            </Button>
          </div>
          <div className="space-y-2">
            {formData.contraindicaciones.map((contraindicacion, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={contraindicacion}
                  onChange={(e) => handleArrayChange('contraindicaciones', index, e.target.value)}
                  placeholder="Ej: No recomendado para diabéticos tipo 1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {formData.contraindicaciones.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeArrayItem('contraindicaciones', index)}
                    size="sm"
                    variant="secondary"
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarNutricion;
