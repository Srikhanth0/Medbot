import React from 'react';
import { 
  Home, 
  BarChart3, 
  Grid3X3, 
  Settings, 
  Calendar, 
  User
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { icon: Home, route: 'dashboard', label: 'Dashboard' },
    { icon: BarChart3, route: 'analytics', label: 'Analytics' },
    { icon: Grid3X3, route: 'integration', label: 'Integration' },
    { icon: Settings, route: 'settings', label: 'Settings' },
    { icon: Calendar, route: 'calendar', label: 'Calendar' },
    { icon: User, route: 'profile', label: 'Profile' }
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-[#2A5A6B] to-[#1a3a47] h-screen flex flex-col items-center py-6 space-y-6 shadow-lg">
      
      
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.route;
          
          return (
            <button
              key={item.route}
              onClick={() => onPageChange(item.route)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? 'text-white border-2 border-white/30 scale-105' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-105'
                }
              `}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

