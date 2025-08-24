import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Activity, Shield, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Real-time tracking of vital signs and health metrics"
    },
    {
      icon: Activity,
      title: "AI Assistant",
      description: "24/7 medical chatbot with 3D character interaction"
    },
    {
      icon: Shield,
      title: "Secure Data",
      description: "HIPAA-compliant data storage and privacy protection"
    },
    {
      icon: Users,
      title: "Care Team",
      description: "Connect with healthcare providers and specialists"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A5A6B] via-[#4A90A4] to-[#1a3a47] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4CAF50]/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E8D5E8]/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4A90A4]/10 rounded-full animate-spin"></div>
      </div>

      {/* 3D Jumping White Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-6 h-6 bg-white/80 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s', boxShadow: '0 4px 8px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-white/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 3px 6px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute bottom-40 left-20 w-8 h-8 bg-white/70 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '2s', boxShadow: '0 5px 10px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-white/50 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 2px 4px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute top-1/3 left-1/4 w-5 h-5 bg-white/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '1.5s', boxShadow: '0 4px 8px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-7 h-7 bg-white/80 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '2.5s', boxShadow: '0 6px 12px rgba(255,255,255,0.3)' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div 
          className={`text-3xl font-bold text-white tracking-wider transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          MEDBOT
        </div>
        <Button
          variant="ghost"
          className={`text-white hover:bg-gray-800 hover:text-white transition-all duration-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          onClick={onGetStarted}
        >
          Sign In
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div 
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Your Health,
            <br />
            <span className="text-[#4CAF50] animate-pulse">Simplified</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl">
            Experience the future of healthcare with AI-powered monitoring, 
            real-time analytics, and personalized medical assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-[#2056a7f8] hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(76,175,80,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.7)]"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(76,175,80,0.5)]">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-5 h-5 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Bottom Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-[#4CAF50] animate-pulse"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-[#E8D5E8] animate-pulse"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-[#4A90A4] animate-pulse"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LandingPage;

