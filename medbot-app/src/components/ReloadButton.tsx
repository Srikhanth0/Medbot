import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useComponentReload } from '@/hooks/useReload';

interface ReloadButtonProps {
  componentKey: string;
  onReload?: () => void;
  className?: string;
  size?: 'sm' | 'medium' | 'lg' | 'icon';
  variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  children?: React.ReactNode;
}

const ReloadButton: React.FC<ReloadButtonProps> = ({
  componentKey,
  onReload,
  className = '',
  size = 'medium',
  variant = 'outline',
  children
}) => {
  const { reload, isLoading } = useComponentReload(componentKey);

  const handleReload = () => {
    reload();
    if (onReload) {
      onReload();
    }
  };

  return (
    <Button
      onClick={handleReload}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`${className} ${isLoading ? 'opacity-75' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <RefreshCw className="w-4 h-4 mr-2" />
      )}
      {children || (isLoading ? 'Reloading...' : 'Reload')}
    </Button>
  );
};

export default ReloadButton;
