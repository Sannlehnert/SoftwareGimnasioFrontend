import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Beneficio {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  usuarioNombre: string;
}

const Beneficios: React.FC = () => {
  const { data: beneficios, isLoading } = useQuery(['beneficios-alumno'], async () => {
    // Mock data para beneficios que ve el alumno
    return [
      {
        id: 1,
        titulo: 'Membresía de Gimnasio',
        descripcion: 'Acceso ilimitado a todas las instalaciones del gimnasio, incluyendo máquinas cardiovasculares, pesas libres y clases grupales.',
        fechaCreacion: '2024-01-15T10:00:00Z',
        usuarioNombre: 'Administración',
      },
      {
        id: 2,
        titulo: 'Entrenamiento Personal',
        descripcion: 'Sesiones personalizadas con entrenador certificado para optimizar tus resultados y prevenir lesiones.',
        fechaCreacion: '2024-01-10T14:30:00Z',
        usuarioNombre: 'Administración',
      },
      {
        id: 3,
        titulo: 'Plan Nutricional',
        descripcion: 'Acceso a planes nutricionales personalizados adaptados a tus objetivos y necesidades específicas.',
        fechaCreacion: '2024-01-08T09:15:00Z',
        usuarioNombre: 'Nutricionista',
      },
      {
        id: 4,
        titulo: 'Seguimiento de Medidas',
        descripcion: 'Monitoreo constante de tu progreso físico con mediciones corporales y análisis de composición corporal.',
        fechaCreacion: '2024-01-05T16:45:00Z',
        usuarioNombre: 'Entrenador',
      },
      {
        id: 5,
        titulo: 'Clases Grupales',
        descripcion: 'Participación en clases grupales como yoga, spinning, cross funcional y muchas más actividades.',
        fechaCreacion: '2024-01-03T11:20:00Z',
        usuarioNombre: 'Administración',
      },
      {
        id: 6,
        titulo: 'Acceso 24/7',
        descripcion: 'Disponibilidad completa del gimnasio las 24 horas del día, todos los días de la semana.',
        fechaCreacion: '2024-01-01T08:00:00Z',
        usuarioNombre: 'Administración',
      },
    ];
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Beneficios</h1>
        <div className="text-sm text-gray-500">
          Descubre todos los beneficios que tienes como miembro
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficios?.map((beneficio) => (
          <div key={beneficio.id} className="kpi-card hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-primary-100 flex-shrink-0">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-600 mb-2">{beneficio.titulo}</h3>
                <p className="text-gray-700 mb-3 text-sm">{beneficio.descripcion}</p>
                <div className="text-xs text-gray-500">
                  <p>Creado por: {beneficio.usuarioNombre}</p>
                  <p>Fecha: {new Date(beneficio.fechaCreacion).toLocaleDateString('es-AR')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!beneficios || beneficios.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay beneficios disponibles</h3>
          <p className="text-gray-600">En este momento no tienes beneficios activos.</p>
        </div>
      )}
    </div>
  );
};

export default Beneficios;
