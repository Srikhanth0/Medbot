import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (email && password) {
      const userName = email.split('@')[0] || 'User';
      onLogin(userName);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    onLogin(`${provider}User`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A5A6B] to-[#4A90A4] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-4xl font-bold text-white tracking-wider">
          MEDBOT
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <HelpCircle className="w-8 h-8" />
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              SIGN UP WITH
            </h1>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full h-14 bg-[#1877F2] hover:bg-[#166FE5] text-white text-lg font-semibold rounded-xl focus:outline-none focus:ring-0"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>

            <Button
              onClick={() => handleSocialLogin('Google')}
              className="w-full h-14 bg-white !text-black text-lg font-semibold rounded-xl border border-gray-300"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>

          {/* Divider */}
          <div className="text-center">
            <span className="text-3xl font-bold text-white">OR</span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white text-lg font-semibold mb-2 block">
                EMAIL ADDRESS
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg rounded-xl border-2 border-white bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-lg font-semibold mb-2 block">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg rounded-xl border-2 border-white bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-xl font-bold rounded-xl mt-8"
            >
              LOGIN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

