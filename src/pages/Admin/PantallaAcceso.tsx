import React, { useState, useEffect } from 'react';
import { accesoService } from '../../api/services/acceso';
import NumericKeypad from '../../components/ui/NumericKeypad';
import { useToast } from '../../context/ToastProvider';

const PantallaAcceso: React.FC = () => {
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastAccess, setLastAccess] = useState<{dni: string, time: Date, success: boolean} | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Actualizar hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Función para reproducir audio de voz
  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-AR'; // Español de Argentina
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAccess = async (dni: string) => {
    setIsProcessing(true);
    try {
      const response = await accesoService.registrarAcceso(dni);

      // Actualizar último acceso
      setLastAccess({ dni, time: new Date(), success: response.success });

      // Mostrar toast según el tipo de respuesta
      if (response.success) {
        addToast({
          type: 'success',
          title: 'Acceso Autorizado ✅',
          message: response.mensaje,
          duration: 3000,
        });
        speak(`Acceso autorizado. ${response.mensaje}`);
      } else {
        addToast({
          type: response.codigo === 'CUOTA_VENCIDA' ? 'warning' : 'error',
          title: 'Acceso Denegado ❌',
          message: response.mensaje,
          duration: 5000,
        });
        speak(`Acceso denegado. ${response.mensaje}`);
      }

      return response;
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Error de conexión',
      });
      speak('Error de conexión. Intente nuevamente.');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-4xl w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">MC GYM</h1>
          <p className="text-2xl opacity-90">Sistema de Control de Acceso</p>
          <div className="mt-2 text-lg opacity-75">
            {currentTime.toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="mt-1 text-3xl font-mono font-bold">
            {currentTime.toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </div>
        </div>
        
        {/* Keypad Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border border-white/20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Ingreso de Alumnos</h2>
            <p className="text-lg opacity-90">Ingrese su DNI para registrar el acceso</p>
          </div>
          
          <NumericKeypad
            onSubmit={handleAccess}
            autoFocus={true}
            disabled={isProcessing}
          />
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-sm opacity-75">Accesos Hoy</div>
            <div className="text-xl font-semibold">{/* TODO: Connect to real data */}0</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-400">⚠</div>
            <div className="text-sm opacity-75">Alertas Hoy</div>
            <div className="text-xl font-semibold">{/* TODO: Connect to real data */}0</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">👥</div>
            <div className="text-sm opacity-75">Total Alumnos</div>
            <div className="text-xl font-semibold">{/* TODO: Connect to real data */}0</div>
          </div>
        </div>

        {/* Último acceso */}
        {lastAccess && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 ${
              lastAccess.success ? 'border-green-400' : 'border-red-400'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-75">Último acceso</div>
                  <div className="font-semibold">DNI: {lastAccess.dni}</div>
                  <div className="text-xs opacity-75">
                    {lastAccess.time.toLocaleTimeString('es-AR')}
                  </div>
                </div>
                <div className={`text-2xl ${lastAccess.success ? 'text-green-400' : 'text-red-400'}`}>
                  {lastAccess.success ? '✅' : '❌'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles de voz */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  voiceEnabled
                    ? 'bg-green-500/20 text-green-400 border border-green-400'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-400'
                }`}
              >
                {voiceEnabled ? '🔊 Voz Activada' : '🔇 Voz Desactivada'}
              </button>
              <button
                onClick={() => speak('Sistema de voz funcionando correctamente')}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors"
              >
                Probar Voz
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm opacity-60">
          <p>Sistema desarrollado para MC GYM • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default PantallaAcceso;