import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'medium' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-lg shadow-gray-500/50',
    secondary: 'bg-blue-500 text-white shadow-lg shadow-gray-500/50',
    destructive: 'bg-red-500 text-white shadow-lg shadow-gray-500/50',
    outline: 'border bg-blue-600 shadow-lg hover:text-white',
    ghost: 'bg-blue-500 text-white shadow-lg shadow-green-700/50',
    link: 'text-blue-500 underline-offset-4 shadow-lg shadow-gray-500/50'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    medium: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.medium,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button }; 