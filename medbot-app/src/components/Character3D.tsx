import React, { useEffect, useRef, useState } from 'react';

// TypeScript declarations for Three.js
declare global {
  interface Window {
    THREE: any;
  }
}

const Character3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setError('3D model loading timeout');
        setIsLoading(false);
      }
    }, 15000);

    // Check if Three.js is available
    if (typeof window !== 'undefined' && window.THREE) {
      const THREE = window.THREE;
      
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x2A5A6B);

      // Camera setup
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 600;
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 50, 80);

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // Brighter ambient
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(10, 30, 20);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
      fillLight.position.set(-10, 10, 10);
      scene.add(fillLight);

      // Try to load FBX model
      if (THREE.FBXLoader) {
        const loader = new THREE.FBXLoader();
        console.log('Loading FBX model from:', '/models/Idle_Transition.fbx');
        
        loader.load(
          '/models/Idle_Transition.fbx',
          (object: any) => {
            console.log('FBX model loaded successfully:', object);
            clearTimeout(timeoutId);
            object.scale.set(0.5, 0.5, 0.5); // Increased scale
            object.position.set(10, -50, 0); // Move downward to center
            
            const mixer = new THREE.AnimationMixer(object);
            
            if (object.animations.length > 0) {
              const action = mixer.clipAction(object.animations[0]);
              action.play();
            }
            
            scene.add(object);
            camera.lookAt(object.position);
            setIsLoading(false);
          },
          (progress: any) => {
            console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
          },
          (error: any) => {
            console.error('Error loading FBX:', error);
            clearTimeout(timeoutId);
            setError('Failed to load 3D model');
            setIsLoading(false);
          }
        );
      } else {
        console.error('FBXLoader not available');
        clearTimeout(timeoutId);
        setError('3D model loader not available');
        setIsLoading(false);
      }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        if (!mountRef.current) return;
        
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } else {
      console.error('Three.js not available');
      clearTimeout(timeoutId);
      setError('Three.js not available');
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2A5A6B] to-[#4A90A4]/20 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-medbot">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-white/70">3D Model Loading...</p>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2A5A6B] to-[#4A90A4]/20 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-medbot animate-pulse">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-white/70">Loading 3D Character...</p>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};

export default Character3D;

