/**
 * 3D Vena Instrument Logo Component
 * Features glassmorphism, neon effects, audio-reactive glow
 */

import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  MeshTransmissionMaterial,
  Text,
  Sphere,
  Torus,
  Cylinder
} from '@react-three/drei';
import * as THREE from 'three';
import { usePlayer } from '../../hooks/usePlayer';

// Vena Instrument 3D Model Component
function VenaInstrument({ audioData, isPlaying }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const neckRef = useRef();
  const stringsRef = useRef();
  const { viewport } = useThree();
  
  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Slow rotation
    groupRef.current.rotation.y += 0.005;

    // Mouse parallax tilt (max 8 degrees)
    const targetRotationX = mouseRef.current.y * 0.1;
    const targetRotationZ = mouseRef.current.x * 0.1;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, 
      targetRotationX, 
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z, 
      targetRotationZ, 
      0.05
    );

    // Audio-reactive effects when playing
    if (isPlaying && audioData) {
      // Bass frequency glow (0-200Hz range)
      const bassIntensity = audioData.slice(0, 32).reduce((sum, val) => sum + val, 0) / 32;
      
      // Subtle vertical bobbing based on bass
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * bassIntensity * 0.3;

      // String vibration effect
      if (stringsRef.current) {
        stringsRef.current.children.forEach((string, index) => {
          const vibration = Math.sin(state.clock.elapsedTime * 10 + index) * bassIntensity * 0.1;
          string.position.x = vibration;
        });
      }
    }
  });

  // Create materials with dynamic emission based on audio
  const glassMaterial = useMemo(() => ({
    color: '#ffffff',
    transmission: 0.9,
    opacity: 0.7,
    metalness: 0.1,
    roughness: 0.1,
    ior: 1.4,
    thickness: 0.2,
    envMapIntensity: 1.5,
  }), []);

  const neonMaterial = useMemo(() => {
    const bassGlow = isPlaying && audioData 
      ? audioData.slice(0, 32).reduce((sum, val) => sum + val, 0) / 32 
      : 0;
    
    return {
      color: '#7b61ff',
      emissive: '#7b61ff',
      emissiveIntensity: 0.5 + (bassGlow * 2),
      metalness: 0.8,
      roughness: 0.2,
    };
  }, [isPlaying, audioData]);

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Main Body (Veena-like shape) */}
      <group ref={bodyRef}>
        {/* Large resonant body */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <MeshTransmissionMaterial {...glassMaterial} />
        </mesh>

        {/* Upper smaller resonator */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <MeshTransmissionMaterial {...glassMaterial} />
        </mesh>

        {/* Connecting body */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 1.0, 1.8, 16]} />
          <MeshTransmissionMaterial {...glassMaterial} />
        </mesh>
      </group>

      {/* Neck */}
      <group ref={neckRef}>
        <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 8]} />
          <meshStandardMaterial {...neonMaterial} />
        </mesh>

        {/* Tuning pegs */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0.3 * (i % 2 === 0 ? 1 : -1), 3.2 + (Math.floor(i / 2) * 0.2), 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial {...neonMaterial} />
          </mesh>
        ))}
      </group>

      {/* Strings */}
      <group ref={stringsRef}>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0.1 * (i - 1.5), 0.5, 0.1]}>
            <cylinderGeometry args={[0.002, 0.002, 4, 4]} />
            <meshStandardMaterial 
              color="#00d4ff" 
              emissive="#00d4ff" 
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Decorative elements */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 8, 32]} />
        <meshStandardMaterial {...neonMaterial} />
      </mesh>

      <mesh position={[0, -0.5, 0]}>
        <torusGeometry args={[0.8, 0.015, 8, 32]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// Water/Liquid Motion Background
function LiquidBackground() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const liquidMaterial = useMemo(() => ({
    color: '#1e1b4b',
    transmission: 0.8,
    opacity: 0.3,
    metalness: 0.1,
    roughness: 0.8,
    ior: 1.1,
    thickness: 0.5,
    envMapIntensity: 0.8,
  }), []);

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={[8, 8, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshTransmissionMaterial {...liquidMaterial} />
    </mesh>
  );
}

// Camera controls component
function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main 3D Logo Component
export default function VenaLogo3D({ 
  width = 400, 
  height = 400, 
  className = "",
  showBackground = true,
  enableControls = false 
}) {
  const { isPlaying, current } = usePlayer();
  const audioDataRef = useRef(null);
  const analyserRef = useRef(null);

  // Set up audio analysis
  useEffect(() => {
    if (isPlaying && current && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyserRef.current = analyser;

        const updateAudioData = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            audioDataRef.current = Array.from(dataArray);
          }
          requestAnimationFrame(updateAudioData);
        };
        updateAudioData();

      } catch (error) {
        console.warn('Web Audio API not available:', error);
      }
    }
  }, [isPlaying, current]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#7b61ff" />
          <pointLight position={[-10, -10, 5]} intensity={0.6} color="#00d4ff" />
          <spotLight 
            position={[0, 10, 5]} 
            intensity={1} 
            angle={Math.PI / 6}
            penumbra={0.5}
            color="#ffffff"
          />

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Background liquid effect */}
          {showBackground && <LiquidBackground />}

          {/* Main Vena Instrument */}
          <VenaInstrument 
            audioData={audioDataRef.current} 
            isPlaying={isPlaying}
          />

          {/* Camera controls */}
          <CameraController />
          
          {/* Optional orbit controls for interaction */}
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
              autoRotate={false}
            />
          )}
        </Suspense>

        {/* Post-processing for bloom effect would go here */}
      </Canvas>

      {/* Fallback for low-performance devices */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
          <div className="text-6xl text-purple-400">🎵</div>
        </div>
      </noscript>
    </div>
  );
}