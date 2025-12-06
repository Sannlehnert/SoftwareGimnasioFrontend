import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastProvider';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  const { login, user } = useAuth();
  const { addToast } = useToast();

  // Detectar si es dispositivo móvil para UX adaptada
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // Cargar último usuario si existe
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
      setIdentifier(lastUser);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(identifier, password);
      // Guardar último usuario para acceso rápido
      localStorage.setItem('lastUser', identifier);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para acceso rápido con último usuario
  const handleQuickLogin = () => {
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
      setIdentifier(lastUser);
      // Enfocar campo de contraseña
      const passwordInput = document.getElementById('password');
      passwordInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh-primary opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent-200/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-success-200/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-large border border-white/20 p-8 animate-bounce-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-4 shadow-glow-primary animate-glow">
              <span className="text-3xl font-bold text-white">MG</span>
            </div>
            <h1 className="text-3xl font-bold text-display bg-gradient-primary bg-clip-text text-transparent mb-2">
              MC GYM
            </h1>
          </div>

          {error && (
            <div className="bg-error-50/80 backdrop-blur-sm border border-error-200/50 text-error-700 px-4 py-3 rounded-xl mb-6 animate-slide-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-semibold text-neutral-700">
                Email o DNI
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-primary pl-12"
                  placeholder="Ingresa tu email o DNI"
                  required
                  autoComplete="username"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-primary pl-12"
                  placeholder="Ingresa tu contraseña"
                  required
                  autoComplete="current-password"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Botón de acceso rápido si hay usuario guardado */}
            {localStorage.getItem('lastUser') && (
              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors hover:underline"
              >
                🔄 Usar último usuario ({localStorage.getItem('lastUser')})
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span>Iniciar Sesión</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-neutral-200/50">
            <div className="flex items-center justify-center space-x-4 text-xs text-neutral-400">
              <span>🔒 Conexión segura</span>
              <span>•</span>
              <span>⚡ Alto rendimiento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
