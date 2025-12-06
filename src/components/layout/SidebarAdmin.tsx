import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (label: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedMenus(newExpanded);
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Principal',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      )
    },
    {
      label: 'Alumnos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      submenu: [
        { path: '/alumnos', label: 'Listado De Alumnos' },
        { path: '/cuenta-corriente', label: 'Cuenta Corriente De Alumnos' },
      ]
    },
    {
      path: '/rutinas',
      label: 'Rutinas',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      path: '/clases',
      label: 'Clases',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: '/nutricion',
      label: 'Nutrición',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    {
      path: '/medidas',
      label: 'Medidas',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'Turnos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      submenu: [
        { path: '/turnos', label: 'Modificar Turnos' },
        { path: '/asistencia', label: 'Asistencia Alumnos' },
        { path: '/turnos-alumno', label: 'Turnos Por Alumno' },
      ]
    },
    {
      label: 'Compra/Venta',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      submenu: [
        { path: '/productos', label: 'Productos' },
        { path: '/compra-venta', label: 'Compra Venta' },
      ]
    },
    {
      label: 'Caja',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      submenu: [
        { path: '/abrir-caja', label: 'Abrir Caja' },
        { path: '/cierre-caja', label: 'Cierre Caja' },
      ]
    },
    {
      label: 'Avisos/Mensajes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      submenu: [
        { path: '/avisos', label: 'Avisos General' },
        { path: '/imagenes', label: 'Imágenes Inicio' },
        { path: '/beneficios', label: 'Beneficios' },
      ]
    },
    {
      label: 'Informes/Graficos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      submenu: [
        { path: '/informes', label: 'Informes Personalizados' },
        { path: '/cobros', label: 'Cobros Cuota' },
        { path: '/informe-ventas', label: 'Informe Compra/Venta' },
        { path: '/movimiento-caja', label: 'Informe Movimiento Caja' },
        { path: '/ingresos', label: 'Informe Ingresos' },
        { path: '/mapa-calor', label: 'Mapa De Calor Alumnos' },
      ]
    },
    {
      path: '/pantalla-rutinas',
      label: 'Pantalla Rutinas',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      path: '/pantalla-acceso',
      label: 'Pantalla De Acceso',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      label: 'Configuración',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      submenu: [
        { path: '/generales', label: 'Generales' },
        { path: '/personalizacion', label: 'Personalización De Aplicacion' },
        { path: '/usuarios', label: 'Usuarios' },
        { path: '/permisos', label: 'Permisos' },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: any) => {
    if (item.submenu) {
      const isExpanded = expandedMenus.has(item.label);
      return (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleMenu(item.label)}
            className="flex items-center w-full px-4 py-3 text-left text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 rounded-xl group"
          >
            <span className="mr-3 text-neutral-500 group-hover:text-primary-600 transition-colors">
              {item.icon}
            </span>
            <span className="flex-1 font-medium">{item.label}</span>
            <svg
              className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isExpanded && (
            <div className="ml-8 mt-2 space-y-1 animate-slide-in">
              {item.submenu.map((subItem: any) => (
                <button
                  key={subItem.path}
                  onClick={() => {
                    navigate(subItem.path);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive(subItem.path)
                      ? 'bg-primary-100 text-primary-700 shadow-soft border border-primary-200'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => {
          navigate(item.path);
          onClose();
        }}
        className={`flex items-center w-full px-4 py-3 mb-1 rounded-xl transition-all duration-200 group ${
          isActive(item.path)
            ? 'bg-primary-100 text-primary-700 shadow-soft border border-primary-200'
            : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
        }`}
      >
        <span className="mr-3 text-neutral-500 group-hover:text-primary-600 transition-colors">
          {item.icon}
        </span>
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 sidebar-translucent transform transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-neutral-200/50 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary animate-glow">
                <span className="text-white font-bold text-xl">MG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-display bg-gradient-primary bg-clip-text text-transparent">
                  MC GYM
                </h1>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map(renderMenuItem)}
            </div>
          </nav>

          {/* User Info */}
          <div className="border-t border-neutral-200/50 p-4 bg-gradient-to-r from-neutral-50 to-primary-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-glow-primary">
                {user?.nombre?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user?.nombre}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.rol?.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;
