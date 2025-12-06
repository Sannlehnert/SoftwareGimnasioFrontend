import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }): React.JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useContext(ToastContext)!;

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400',
      icon: '✅'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400',
      icon: '❌'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-400',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400',
      icon: 'ℹ️'
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`p-4 rounded-xl border shadow-xl text-white transition-all duration-300 animate-slide-in ${style.bg} backdrop-blur-sm`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">{style.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base leading-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm mt-1 opacity-95 leading-relaxed">{toast.message}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all duration-200 flex-shrink-0"
          aria-label="Cerrar notificación"
        >
          <span className="text-lg" aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};