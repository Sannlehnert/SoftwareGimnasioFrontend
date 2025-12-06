import React, { useState, useCallback, useEffect, useRef } from 'react';

interface NumericKeypadProps {
  onSubmit: (dni: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ 
  onSubmit, 
  autoFocus = true,
  disabled = false 
}) => {
  const [dni, setDni] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = useCallback((value: string) => {
    if (dni.length < 15 && !isSubmitting && !disabled) {
      const newDni = dni + value;
      console.log('NumericKeypad: Adding digit:', value, 'New DNI:', newDni);
      setDni(newDni);
    }
  }, [dni, isSubmitting, disabled]);

  const handleDelete = () => {
    if (!isSubmitting && !disabled) {
      setDni(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!isSubmitting && !disabled) {
      setDni('');
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async () => {
    if (dni.length === 0 || isSubmitting || disabled) return;

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      await onSubmit(dni);
      setStatus('success');
      setMessage('Acceso autorizado');
      setTimeout(() => {
        setDni('');
        setStatus('idle');
        setMessage('');
      }, 2000);
    } catch (error: any) {
      const errorData = (error as any).response?.data;
      setStatus(errorData?.codigo === 'CUOTA_VENCIDA' ? 'warning' : 'error');
      setMessage(errorData?.mensaje || 'Error de acceso');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar entrada desde teclado físico
  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent) => {
      if (disabled || isSubmitting) return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [autoFocus, handleKeyPress, disabled, isSubmitting]);

  const keypadButtons = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: 'clear', label: 'C', action: handleClear },
    { value: '0', label: '0' },
    { value: 'delete', label: '⌫', action: handleDelete },
  ];

  const statusColors = {
    idle: 'border-gray-300',
    success: 'border-success ring-2 ring-success/20',
    warning: 'border-warning ring-2 ring-warning/20',
    error: 'border-error ring-2 ring-error/20',
  };

  const messageColors = {
    idle: 'text-gray-600',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Display del DNI */}
      <div className="mb-6">
        <div className={`relative w-full border-2 rounded-xl bg-white transition-all duration-200 font-mono ${
          statusColors[status]
        } ${disabled ? 'opacity-50' : ''}`}>
          {/* Mostrar el DNI como texto si hay contenido, placeholder si está vacío */}
          {dni.length > 0 ? (
            <div className="w-full text-4xl text-center p-6 font-mono text-black min-h-[4rem] flex items-center justify-center">
              {dni}
            </div>
          ) : (
            <div className="w-full text-4xl text-center p-6 font-mono text-gray-400 min-h-[4rem] flex items-center justify-center">
              Ingrese DNI
            </div>
          )}
          {/* Input oculto para mantener el foco y funcionalidad */}
          <input
            ref={inputRef}
            type="text"
            value={dni}
            readOnly
            className="absolute inset-0 w-full h-full opacity-0 cursor-default"
            placeholder="Ingrese DNI"
          />
          {/* Debug info */}
          <div className="absolute top-0 right-0 text-xs text-gray-500 bg-yellow-200 px-1 rounded">
            Debug: {dni.length} chars - DNI: "{dni}"
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`text-center text-lg font-semibold mb-6 transition-all duration-200 ${messageColors[status]}`}>
          {message}
        </div>
      )}

      {/* Keypad numérico */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {keypadButtons.map((button) => (
          <button
            key={button.value}
            onClick={button.action || (() => handleKeyPress(button.value))}
            disabled={disabled || isSubmitting}
            className={`
              aspect-square text-3xl font-bold rounded-xl transition-all duration-200 
              active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
              ${
                button.value === 'clear'
                  ? 'bg-error hover:bg-red-600 text-white'
                  : button.value === 'delete'
                  ? 'bg-warning hover:bg-yellow-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }
            `}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Botón de envío */}
      <button
        onClick={handleSubmit}
        disabled={dni.length === 0 || isSubmitting || disabled}
        className={`
          w-full py-6 text-2xl font-bold rounded-xl transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isSubmitting
              ? 'bg-gray-400 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white active:scale-95'
          }
        `}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Procesando...
          </div>
        ) : (
          'INGRESAR'
        )}
      </button>

      {/* Indicador de estado */}
      {status !== 'idle' && (
        <div className="mt-4 text-center">
          <div className={`inline-block w-3 h-3 rounded-full ${
            status === 'success' ? 'bg-success' :
            status === 'warning' ? 'bg-warning' : 'bg-error'
          }`} />
        </div>
      )}
    </div>
  );
};

export default NumericKeypad;