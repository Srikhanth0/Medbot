import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = 'Hello User!', userName = 'User', onLogout }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning !';
    if (hour < 18) return 'Good Afternoon !';
    return 'Good Evening !';
  };

  return (
    <header className="bg-primary h-16 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-primary-foreground">
        {title}
      </h1>
      
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm text-primary-foreground opacity-90">
            {getGreeting()}
          </div>
          <div className="text-lg font-semibold text-primary-foreground">
            {userName}
          </div>
        </div>
        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-card-foreground" />
        </div>
        
        {onLogout && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-primary-foreground hover:bg-primary/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

