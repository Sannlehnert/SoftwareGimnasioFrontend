import React from 'react';
import { useOffline } from '../../hooks/useOffline';

const OfflineIndicator: React.FC = () => {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>Modo offline - Algunas funciones pueden no estar disponibles</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;