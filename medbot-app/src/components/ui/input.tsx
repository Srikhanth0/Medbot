import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  ...props 
}) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-input bg-gray-700 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const classes = [baseClasses, className].filter(Boolean).join(' ');
  
  return (
    <input
      type={type}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      {...props}
    />
  );
};

export { Input }; 