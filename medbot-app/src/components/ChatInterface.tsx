import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { sendMessageToGemini, checkServerHealth } from '@/utils/geminiApi';
import { loadAnimations, AnimationData } from '@/utils/LoadAnimations';
import { buildStructuredGeminiPrompt } from '@/utils/geminiPrompt';
import { vectorSearch } from '@/utils/vectorSearch';
import ReloadButton from '@/components/ReloadButton';

// Three.js imports
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Removed unused function

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI health assistant powered by Gemini. How can I help you with your health today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [modelStatus, setModelStatus] = useState<{
    loaded: boolean;
    skinningWarnings: number;
    textureWarnings: number;
  }>({ loaded: false, skinningWarnings: 0, textureWarnings: 0 });
  // Removed unused state
  const [, setAnimations] = useState<THREE.AnimationClip[]>([]);
  const [animationData, setAnimationData] = useState<AnimationData[]>([]);
  const [currentAnimationName, setCurrentAnimationName] = useState<string>('Idle');
  const [modelYPosition, setModelYPosition] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection();
  }, []);

  // Load animation data on component mount
  useEffect(() => {
    const loadAnimationData = async () => {
      const data = await loadAnimations();
      setAnimationData(data);
      console.log('Loaded animation data:', data);
    };
    loadAnimationData();
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2A5A6B);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      threeContainerRef.current.clientWidth / threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 60);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(threeContainerRef.current.clientWidth, threeContainerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    threeContainerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add OrbitControls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Enhanced lighting setup for better visual quality
    
    // 1. Ambient light - provides overall base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 2.0); // Increased intensity for better base lighting
    scene.add(ambientLight);

    // 2. Main directional light (key light) - primary light source
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Increased intensity
    directionalLight.position.set(15, 25, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096; // Higher shadow resolution
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -60;
    directionalLight.shadow.camera.right = 60;
    directionalLight.shadow.camera.top = 60;
    directionalLight.shadow.camera.bottom = -60;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    // 3. Fill light - softens shadows from opposite side
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 1.2); // Cool blue fill light
    fillLight.position.set(-15, 20, -10);
    scene.add(fillLight);

    // 4. Rim light - creates edge definition
    const rimLight = new THREE.DirectionalLight(0x4CAF50, 1.0); // Green rim light
    rimLight.position.set(0, 15, -25);
    scene.add(rimLight);

    // 5. Top light - illuminates from above
    const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
    topLight.position.set(0, 30, 0);
    scene.add(topLight);

    // 6. Side accent lights - adds depth and dimension
    const leftAccentLight = new THREE.PointLight(0x4CAF50, 0.8, 80);
    leftAccentLight.position.set(-20, 15, 10);
    scene.add(leftAccentLight);

    const rightAccentLight = new THREE.PointLight(0x2196F3, 0.8, 80);
    rightAccentLight.position.set(20, 15, 10);
    scene.add(rightAccentLight);

    // 7. Back light - separates model from background
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 10, -30);
    scene.add(backLight);

    // 8. Hemisphere light - provides natural sky/ground lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x2A5A6B, 1.0);
    hemisphereLight.position.set(0, 50, 0);
    scene.add(hemisphereLight);

    // 9. Spot lights for dramatic effect
    const spotLight1 = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 6, 0.1, 1);
    spotLight1.position.set(25, 30, 25);
    spotLight1.target.position.set(0, 10, 0);
    spotLight1.castShadow = true;
    scene.add(spotLight1);
    scene.add(spotLight1.target);

    const spotLight2 = new THREE.SpotLight(0x4CAF50, 1.0, 80, Math.PI / 8, 0.2, 1);
    spotLight2.position.set(-20, 25, 15);
    spotLight2.target.position.set(0, 10, 0);
    scene.add(spotLight2);
    scene.add(spotLight2.target);

    // Load only the Idle animation model
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/models/Idle.fbx',
      (object) => {
        object.scale.set(0.15, 0.15, 0.15);
        object.position.set(0, modelYPosition, 0);
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(object);
        modelRef.current = object;

        // Extract animation from this model
        setAnimations(object.animations);
        setModelStatus((prev) => ({ ...prev, loaded: true }));

        // Log animation count
        console.log(`Loaded Idle model with ${object.animations.length} animations:`, object.animations.map(anim => anim.name));

        // Setup mixer and play the idle animation
        const mixer = new THREE.AnimationMixer(object);
        mixerRef.current = mixer;
        if (object.animations.length > 0) {
          const action = mixer.clipAction(object.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }
      },
      (xhr) => {
        // Progress callback
        console.log(`Idle.fbx: ${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        console.error('Failed to load Idle model:', error);
        setModelStatus((prev) => ({ ...prev, loaded: false }));
      }
    );

    // Animation loop with proper timing and performance optimization
    let lastTime = 0;
    let animationId: number;
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (!threeContainerRef.current || !renderer || !camera) return;
      const width = threeContainerRef.current.clientWidth;
      const height = threeContainerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  // Removed unused function

  // Function to handle animation requests using RAG pipeline
  const handleAnimationRequest = async (userInput: string): Promise<string | null> => {
    if (animationData.length === 0) {
      console.warn('No animation data available');
      return null;
    }

    try {
      // Step 1: Semantic search for most similar animation
      const matchedAnimations = vectorSearch(userInput, animationData, 1);
      
      if (matchedAnimations.length === 0) {
        console.warn('No matching animations found');
        return null;
      }
      
      const matchedAnimation = matchedAnimations[0];
      console.log(`Semantic search matched: ${matchedAnimation.name} (${matchedAnimation.file})`);
      
      // Step 2: Build structured Gemini prompt
      const structuredPrompt = buildStructuredGeminiPrompt(userInput, matchedAnimation);
      
      // Step 3: Get response from Gemini
      const response = await sendMessageToGemini(structuredPrompt);
      
      // Step 4: Extract animation file name from response (should be in quotes)
      const animationFileMatch = response.match(/"([^"]+\.fbx)"/);
      const animationFile = animationFileMatch ? animationFileMatch[1] : matchedAnimation.file;
      
      console.log(`Gemini response: ${response}`);
      console.log(`Selected animation file: ${animationFile}`);
      
      return animationFile;
    } catch (error) {
      console.error('Error in animation request:', error);
      return null;
    }
  };

  // Function to load and play a specific animation
  const loadAndPlayAnimation = (animationFile: string) => {
    if (!sceneRef.current || !mixerRef.current) {
      console.error('Scene or mixer not initialized');
      return;
    }

    // Remove current model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }

    // Stop current mixer
    mixerRef.current.stopAllAction();

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      `/models/${animationFile}`,
      (object) => {
        object.scale.set(0.15, 0.15, 0.15);
        object.position.set(0, modelYPosition, 0);
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        if (sceneRef.current) {
          sceneRef.current.add(object);
          modelRef.current = object;
        }

        // Setup mixer and play the animation
        const mixer = new THREE.AnimationMixer(object);
        mixerRef.current = mixer;
        
        if (object.animations.length > 0) {
          const action = mixer.clipAction(object.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          
          // Update current animation name
          const matchedAnimation = animationData.find(anim => anim.file === animationFile);
          if (matchedAnimation) {
            setCurrentAnimationName(matchedAnimation.name);
          }
          
          console.log(`Playing animation: ${animationFile}`);
        }
      },
      (xhr) => {
        console.log(`${animationFile}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        console.error(`Failed to load animation ${animationFile}:`, error);
      }
    );
  };

  const checkServerConnection = async () => {
    try {
      const isHealthy = await checkServerHealth();
      setServerStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      setServerStatus('disconnected');
      console.error('Server connection failed:', error);
    }
  };



  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage = inputText.trim();
      
      // Add user message
      const newUserMessage: Message = {
        id: messages.length + 1,
        text: userMessage,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        // Check if this is an animation request
        const animationKeywords = [
          'exercise', 'workout', 'pose', 'move', 'dance', 'jump', 'squat', 'push', 'sit', 'bicycle', 'idle',
          'pain', 'stiffness', 'tension', 'back', 'chest', 'legs', 'arms', 'core', 'abs', 'warmup', 'stretch',
          'strength', 'cardio', 'flexibility', 'mobility', 'recovery', 'relief', 'therapy', 'rehabilitation'
        ];
        const isAnimationRequest = animationKeywords.some(keyword => 
          userMessage.toLowerCase().includes(keyword)
        );

        let aiResponse: string;
        
        if (isAnimationRequest && animationData.length > 0) {
          // Handle animation request using RAG pipeline
          const selectedAnimation = await handleAnimationRequest(userMessage);
          
          if (selectedAnimation) {
            // Load and play the selected animation
            loadAndPlayAnimation(selectedAnimation);
            
            // Use the structured Gemini response directly
            const structuredPrompt = buildStructuredGeminiPrompt(userMessage, 
              animationData.find(anim => anim.file === selectedAnimation)!
            );
            const fullResponse = await sendMessageToGemini(structuredPrompt);
            
            // Use the full response (summarization will be handled by the server)
            aiResponse = fullResponse;
          } else {
            aiResponse = "I couldn't find a matching exercise for that request. Try asking for a specific type of workout like 'show me a chest exercise' or 'I want to do jumping jacks'.";
          }
        } else {
          // Regular health assistant response
          const fullResponse = await sendMessageToGemini(userMessage);
          
          // Use the full response (summarization will be handled by the server)
          aiResponse = fullResponse;
        }
        
        const botResponse: Message = {
          id: messages.length + 2,
          text: aiResponse,
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        // Add error message
        const errorMessage: Message = {
          id: messages.length + 2,
          text: error instanceof Error ? error.message : 'An error occurred. Please try again.',
          isBot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-card rounded-2xl h-full flex">
      {/* 3D Character Section - Left Side */}
      <div className="w-1/3 min-w-[300px] p-4 border-r border-border">
        <div className="h-full rounded-xl overflow-hidden">
          <div 
            ref={threeContainerRef} 
            className="w-full h-full rounded-xl"
            style={{ minHeight: '400px' }}
          />
        </div>
        
        {/* Model Status and Controls */}
        {modelStatus.loaded && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-black">{currentAnimationName} animation playing</span>
              </div>
              <p className="text-xs text-black mt-2">
                Click and drag to rotate • Scroll to zoom
              </p>
              <p className="text-xs text-black mt-2">
                Try: "show me jumping jacks" or "I want to do push ups"
              </p>
              <p className="text-xs text-black mt-2">
                Or: "I have back pain" or "need a warmup exercise"
              </p>
            </div>
            
            {/* Y-Axis Position Control */}
            <div className="p-3 bg-muted rounded-lg">
              <label className="text-sm font-medium text-black mb-2 block">
                Model Height: {modelYPosition}
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={modelYPosition}
                onChange={(e) => {
                  const newY = parseInt(e.target.value);
                  setModelYPosition(newY);
                  if (modelRef.current) {
                    modelRef.current.position.y = newY;
                  }
                }}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-black mt-1">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Section - Right Side */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <h3 className="text-xl font-bold">AI Health Assistant</h3>
              {modelStatus.loaded && (modelStatus.skinningWarnings > 0 || modelStatus.textureWarnings > 0) && (
                <div className="flex items-center space-x-1 text-xs opacity-80">
                  <span>⚠️</span>
                  <span>Model optimized</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ReloadButton 
                componentKey="chat-interface" 
                onReload={() => {
                  // Clear messages and restart chat
                  setMessages([{
                    id: 1,
                    text: "Hello! I'm your AI health assistant powered by Gemini. How can I help you with your health today?",
                    isBot: true,
                    timestamp: new Date()
                  }]);
                  checkServerConnection();
                }}
                size="sm"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              />
              <div className={`w-2 h-2 rounded-full ${
                serverStatus === 'connected' ? 'bg-green-400' : 
                serverStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
              <span className="text-sm opacity-80">
                {serverStatus === 'connected' ? 'AI Connected' : 
                 serverStatus === 'disconnected' ? 'AI Disconnected' : 'AI Checking...'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`
                  max-w-xs px-4 py-2 rounded-2xl
                  ${message.isBot 
                    ? 'bg-accent text-black' 
                    : 'bg-primary text-black'
                  }
                `}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-accent text-black px-4 py-2 rounded-2xl flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={serverStatus === 'connected' ? "Ask me about your health..." : "Server disconnected..."}
                className="h-12 rounded-xl border-2 border-primary text-white placeholder:text-gray-300"
                disabled={isLoading || serverStatus === 'disconnected'}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading || serverStatus === 'disconnected' || !inputText.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Server status message */}
          {serverStatus === 'disconnected' && (
            <div className="mt-2 text-sm text-red-500 text-center">
              Cannot connect to AI server. Make sure the server is running on port 3001.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;