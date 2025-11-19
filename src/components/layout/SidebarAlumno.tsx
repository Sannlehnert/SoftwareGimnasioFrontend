import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarAlumnoProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarAlumno: React.FC<SidebarAlumnoProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/turnos', label: 'Turnos', icon: '⏰' },
    { path: '/rutina', label: 'Rutina', icon: '💪' },
    { path: '/clase', label: 'Clase', icon: '🎯' },
    { path: '/plan-nutricional', label: 'Plan Nutricional', icon: '🥗' },
    { path: '/medidas', label: 'Medidas', icon: '📊' },
    { path: '/beneficios', label: 'Beneficios', icon: '🎁' },
    { path: '/pagos', label: 'Pagos', icon: '💰' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 sidebar-translucent transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <div className="text-xl font-bold text-primary-600">MC GYM</div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`flex items-center w-full px-4 py-3 mb-1 transition-colors rounded-lg ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-600 font-semibold">👤</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Alumno</p>
              <p className="text-xs text-gray-500">Bienvenido</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAlumno;