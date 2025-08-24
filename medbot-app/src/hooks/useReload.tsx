import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReloadContextType {
  isReloading: boolean;
  reloadStates: Record<string, boolean>;
  startReload: (key?: string) => void;
  stopReload: (key?: string) => void;
  isComponentReloading: (key: string) => boolean;
}

const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

interface ReloadProviderProps {
  children: ReactNode;
}

export const ReloadProvider: React.FC<ReloadProviderProps> = ({ children }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [reloadStates, setReloadStates] = useState<Record<string, boolean>>({});

  const startReload = (key?: string) => {
    if (key) {
      setReloadStates(prev => ({ ...prev, [key]: true }));
    } else {
      setIsReloading(true);
    }
  };

  const stopReload = (key?: string) => {
    if (key) {
      setReloadStates(prev => ({ ...prev, [key]: false }));
    } else {
      setIsReloading(false);
    }
  };

  const isComponentReloading = (key: string) => {
    return reloadStates[key] || false;
  };

  return (
    <ReloadContext.Provider value={{
      isReloading,
      reloadStates,
      startReload,
      stopReload,
      isComponentReloading
    }}>
      {children}
    </ReloadContext.Provider>
  );
};

export const useReload = () => {
  const context = useContext(ReloadContext);
  if (context === undefined) {
    throw new Error('useReload must be used within a ReloadProvider');
  }
  return context;
};

// Custom hook for component-specific reload functionality
export const useComponentReload = (componentKey: string) => {
  const { startReload, stopReload, isComponentReloading } = useReload();

  const reload = () => {
    startReload(componentKey);
    // Auto-stop after a short delay to simulate reload completion
    setTimeout(() => {
      stopReload(componentKey);
    }, 1000);
  };

  const isLoading = isComponentReloading(componentKey);

  return { reload, isLoading };
};
