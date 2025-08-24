import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  disabled = false 
}) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-colors
        ${checked ? 'bg-green-600' : 'bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-7' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch; 