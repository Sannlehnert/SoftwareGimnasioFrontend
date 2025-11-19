export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (includeTime) {
    return dateObj.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDNI = (dni: string): string => {
  // Formato: XX.XXX.XXX
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatPhone = (phone: string): string => {
  // Formato: +54 11 1234-5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+54 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const daysUntil = (date: string | Date): number => {
  const target = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(dni.replace(/\D/g, ''));
};