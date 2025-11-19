import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/services/auth';
import { useToast } from './ToastProvider';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'SUPERADMIN' | 'ADMIN' | 'EMPLEADO' | 'ALUMNO';
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authService.getMe()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('accessToken');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    const { accessToken, user: userData } = await authService.login(identifier, password);
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);

    // Mostrar mensaje de bienvenida elegante
    setTimeout(() => {
      showWelcomeModal(userData.nombre);
    }, 500);

    // Redireccionar automáticamente según el rol usando navigate
    setTimeout(() => {
      if (userData.rol === 'ALUMNO') {
        navigate('/inicio');
      } else {
        navigate('/dashboard');
      }
    }, 2500); // Después del modal de bienvenida
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
      <WelcomeModal />
    </AuthContext.Provider>
  );
};

// Componente modal de bienvenida elegante
const WelcomeModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState('');

  React.useEffect(() => {
    window.showWelcomeModal = (name: string) => {
      setUserName(name);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4 animate-bounce-in">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          ¡Bienvenido de vuelta!
        </h2>
        <p className="text-neutral-600 text-lg">
          {userName}
        </p>
        <div className="mt-6 text-sm text-neutral-500">
          Cargando tu panel de control...
        </div>
      </div>
    </div>
  );
};

// Función global para mostrar el modal
declare global {
  interface Window {
    showWelcomeModal: (name: string) => void;
  }
}

// Función para mostrar el modal
const showWelcomeModal = (name: string) => {
  if (window.showWelcomeModal) {
    window.showWelcomeModal(name);
  }
};
