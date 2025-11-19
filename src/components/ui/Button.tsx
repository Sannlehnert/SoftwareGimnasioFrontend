import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-error hover:bg-red-600 text-white focus:ring-error',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;