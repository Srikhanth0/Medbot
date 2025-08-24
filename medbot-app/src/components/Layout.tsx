import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange, onLogout }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#2A5A6B] to-[#4A90A4]/20">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      </div>
      
      {/* Mobile Navigation Bar - visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#2A5A6B] to-[#4A90A4]/20 border-t border-white/20 z-50 backdrop-blur-sm">
        <div className="flex justify-around items-center py-3 px-4">
          {([
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'analytics', icon: '📊', label: 'Analytics' },
            { id: 'integration', icon: '🔗', label: 'Integration' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ] as const).map((page) => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 min-w-0 ${
                currentPage === page.id 
                  ? 'bg-accent text-white shadow-medbot' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={page.label}
            >
              <span className="text-lg mb-1">{page.icon}</span>
              <span className="text-xs hidden sm:block">{page.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

