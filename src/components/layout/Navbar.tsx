import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOffline } from '../../hooks/useOffline';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  user: any;
  onLogout: () => void;
  showMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user, onLogout, showMenu = true }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const isOffline = useOffline();
  const navigate = useNavigate();

  const getRolDisplay = (rol: string) => {
    const roles: { [key: string]: string } = {
      SUPERADMIN: 'Super Administrador',
      ADMIN: 'Administrador',
      EMPLEADO: 'Empleado',
      ALUMNO: 'Alumno',
    };
    return roles[rol] || rol;
  };

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl shadow-soft border-b border-neutral-200/50 relative z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-3 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 lg:hidden group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="ml-4 lg:ml-0 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary animate-glow">
              <span className="text-white font-bold text-lg">MG</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-display bg-gradient-primary bg-clip-text text-transparent">
                MC GYM
              </h1>
              <p className="text-sm text-neutral-500 hidden sm:block">
                Sistema de Gestión Integral
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Indicador de Estado */}
          {isOffline && (
            <div className="flex items-center gap-3 px-4 py-2 bg-warning-50/80 backdrop-blur-sm border border-warning-200/50 text-warning-800 rounded-xl text-sm font-medium animate-pulse-slow">
              <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
              <span>Modo Offline</span>
            </div>
          )}

          {/* Notificaciones */}
          <button className="relative p-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-7.5 1 1 0 00-.68-1.21 1 1 0 00-1.21.68A7.97 7.97 0 008 12.5v.5H5a1 1 0 000 2h10a1 1 0 000-2h-3v-.5c0-1.64-.63-3.2-1.76-4.44z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-glow-error animate-bounce-in">
              3
            </span>
          </button>

          {/* Perfil del Usuario */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-4 p-2 rounded-xl hover:bg-neutral-50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-gradient-primary text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-glow-primary group-hover:scale-105 transition-transform">
                {getInitials(user?.nombre || 'U')}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-neutral-800">{user?.nombre}</p>
                <p className="text-xs text-neutral-500">{getRolDisplay(user?.rol)}</p>
              </div>
              <svg
                className={`w-5 h-5 text-neutral-500 transition-all duration-200 group-hover:text-primary-600 ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-large border border-neutral-200/50 py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-neutral-200/50">
                  <p className="text-sm font-semibold text-neutral-900">{user?.nombre}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 flex items-center gap-3 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 flex items-center gap-3 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configuración
                </button>

                <div className="border-t border-neutral-200/50 mt-2 pt-2">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm text-error-600 hover:bg-error-50 hover:text-error-700 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Modal de Perfil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">{getInitials(user?.nombre || 'U')}</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">{user?.nombre}</h2>
              <p className="text-neutral-600 mb-4">{user?.email}</p>
              <p className="text-sm text-neutral-500 mb-6">{getRolDisplay(user?.rol)}</p>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-xl mr-3">📝</span>
                  <span>Editar Perfil</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <span className="text-xl mr-3">🔒</span>
                  <span>Cambiar Contraseña</span>
                </div>
              </button>
            </div>

            <div className="flex gap-2 pt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuración */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 w-full">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Configuración</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Claro</option>
                  <option>Oscuro</option>
                  <option>Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>Español</option>
                  <option>Inglés</option>
                </select>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="notifications" className="mr-2" />
                <label htmlFor="notifications" className="text-sm text-gray-700">
                  Notificaciones push
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="sound" className="mr-2" />
                <label htmlFor="sound" className="text-sm text-gray-700">
                  Sonido de notificaciones
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-6">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
              <button className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
