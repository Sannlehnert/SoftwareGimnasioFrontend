import React, { useState, useEffect } from 'react';
import { alumnosService } from '../../api/services/alumnos';
import { rutinasService, Rutina } from '../../api/services/rutinas';
import NumericKeypad from '../../components/ui/NumericKeypad';
import { useToast } from '../../context/ToastProvider';

const PantallaRutinas: React.FC = () => {
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [alumnoInfo, setAlumnoInfo] = useState<{ nombre: string; apellido: string; dni: string } | null>(null);
  const [lastSearch, setLastSearch] = useState<{dni: string, time: Date, found: boolean} | null>(null);
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

  const handleSearchRutina = async (dni: string) => {
    setIsProcessing(true);
    try {
      // Primero buscar el alumno por DNI
      const alumnosResponse = await alumnosService.getAlumnos({ search: dni, limit: 1 });
      const alumno = alumnosResponse.data?.find((a: any) => a.dni === dni);

      if (!alumno) {
        setLastSearch({ dni, time: new Date(), found: false });
        setRutinas([]);
        setAlumnoInfo(null);
        addToast({
          type: 'error',
          title: 'Alumno no encontrado',
          message: `No se encontró ningún alumno con DNI ${dni}`,
          duration: 5000,
        });
        speak(`Alumno con DNI ${dni} no encontrado`);
        return;
      }

      // Buscar rutinas del alumno
      const rutinasResponse = await alumnosService.getRutinas(alumno.id);
      const rutinasActivas = rutinasResponse.filter((r: Rutina) => r.activa);

      setLastSearch({ dni, time: new Date(), found: true });
      setRutinas(rutinasActivas);
      setAlumnoInfo({ nombre: alumno.nombre, apellido: alumno.apellido, dni: alumno.dni });

      if (rutinasActivas.length > 0) {
        addToast({
          type: 'success',
          title: 'Rutina encontrada',
          message: `${rutinasActivas.length} rutina(s) activa(s) encontrada(s) para ${alumno.nombre} ${alumno.apellido}`,
          duration: 3000,
        });
        speak(`Rutina encontrada para ${alumno.nombre} ${alumno.apellido}`);
      } else {
        addToast({
          type: 'warning',
          title: 'Sin rutina activa',
          message: `${alumno.nombre} ${alumno.apellido} no tiene rutinas activas`,
          duration: 5000,
        });
        speak(`No se encontraron rutinas activas para ${alumno.nombre} ${alumno.apellido}`);
      }

    } catch (error: any) {
      setLastSearch({ dni, time: new Date(), found: false });
      setRutinas([]);
      setAlumnoInfo(null);
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
      <div className="text-center text-white max-w-6xl w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">MC GYM</h1>
          <p className="text-2xl opacity-90">Sistema de Consulta de Rutinas</p>
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
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 mb-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Consulta de Rutinas</h2>
            <p className="text-lg opacity-90">Ingrese su DNI para ver su rutina</p>
          </div>

          <NumericKeypad
            onSubmit={handleSearchRutina}
            autoFocus={true}
            disabled={isProcessing}
          />
        </div>

        {/* Información del alumno y rutinas */}
        {alumnoInfo && rutinas.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-6xl mx-auto border border-white/20 mb-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                Rutina de {alumnoInfo.nombre} {alumnoInfo.apellido}
              </h3>
              <p className="text-lg opacity-90">DNI: {alumnoInfo.dni}</p>
            </div>

            <div className="space-y-6">
              {rutinas.map((rutina) => (
                <div key={rutina.id} className="bg-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{rutina.nombre}</h4>
                      {rutina.descripcion && (
                        <p className="text-sm opacity-75 mt-1">{rutina.descripcion}</p>
                      )}
                    </div>
                    <div className="text-right text-sm opacity-75">
                      <p>Inicio: {new Date(rutina.fechaInicio).toLocaleDateString('es-AR')}</p>
                      {rutina.fechaFin && (
                        <p>Fin: {new Date(rutina.fechaFin).toLocaleDateString('es-AR')}</p>
                      )}
                    </div>
                  </div>

                  {/* Ejercicios por día */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map(dia => {
                      const ejerciciosDia = rutina.ejercicios.filter(e => e.dia === dia);
                      if (ejerciciosDia.length === 0) return null;

                      return (
                        <div key={dia} className="bg-white/5 rounded-lg p-4">
                          <h5 className="font-semibold mb-3 text-left">
                            Día {dia} - {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][dia - 1]}
                          </h5>
                          <div className="space-y-2">
                            {ejerciciosDia.map((ejercicio, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                                <div className="text-left">
                                  <p className="font-medium">{ejercicio.ejercicio.nombre}</p>
                                  <p className="text-sm opacity-75">
                                    {ejercicio.series} series × {ejercicio.repeticiones} reps
                                    {ejercicio.descanso && ` • Descanso: ${ejercicio.descanso}s`}
                                  </p>
                                  {ejercicio.notas && (
                                    <p className="text-xs opacity-60 mt-1">{ejercicio.notas}</p>
                                  )}
                                </div>
                                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded ml-4">
                                  {ejercicio.ejercicio.categoria}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay rutinas */}
        {alumnoInfo && rutinas.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-2">Sin Rutinas Activas</h3>
              <p className="text-lg opacity-90">
                {alumnoInfo.nombre} {alumnoInfo.apellido} no tiene rutinas activas actualmente.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">📊</div>
            <div className="text-sm opacity-75">Consultas Hoy</div>
            <div className="text-xl font-semibold">{/* TODO: Connect to real data */}0</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">👥</div>
            <div className="text-sm opacity-75">Alumnos con Rutina</div>
            <div className="text-xl font-semibold">{/* TODO: Connect to real data */}0</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">🏋️</div>
            <div className="text-sm opacity-75">Rutinas Activas</div>
            <div className="text-xl font-semibold">{rutinas.length}</div>
          </div>
        </div>

        {/* Última búsqueda */}
        {lastSearch && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 ${
              lastSearch.found ? 'border-green-400' : 'border-red-400'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-75">Última consulta</div>
                  <div className="font-semibold">DNI: {lastSearch.dni}</div>
                  <div className="text-xs opacity-75">
                    {lastSearch.time.toLocaleTimeString('es-AR')}
                  </div>
                </div>
                <div className={`text-2xl ${lastSearch.found ? 'text-green-400' : 'text-red-400'}`}>
                  {lastSearch.found ? '✅' : '❌'}
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
                onClick={() => speak('Sistema de consulta de rutinas funcionando correctamente')}
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

export default PantallaRutinas;
