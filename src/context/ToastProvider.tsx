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
  const bgColors = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-600 border-blue-700',
  };

  return (
    <div
      className={`p-4 rounded-lg border shadow-lg text-white transition-all duration-300 ${bgColors[toast.type]}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold">{toast.title}</h4>
          {toast.message && <p className="text-sm mt-1 opacity-90">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-white/70 transition-colors"
        >
          ✕
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