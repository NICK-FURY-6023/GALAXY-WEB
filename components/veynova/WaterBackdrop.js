/**
 * Water/Liquid Motion Backdrop Component
 * Creates animated liquid-like effects behind content
 */

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material for liquid effect
const LiquidMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(),
    uColor1: new THREE.Color('#1e1b4b'),
    uColor2: new THREE.Color('#312e81'),
    uColor3: new THREE.Color('#4c1d95'),
    uIntensity: 0.8,
    uSpeed: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uIntensity;
    uniform float uSpeed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Smooth noise
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    // Fractal Brownian Motion
    float fbm(vec2 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 6; i++) {
        if(i >= octaves) break;
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    // Caustics pattern
    float caustics(vec2 uv, float time) {
      vec2 p = uv * 4.0;
      
      float c1 = fbm(p + vec2(cos(time * 0.3), sin(time * 0.2)) * 2.0, 4);
      float c2 = fbm(p + vec2(sin(time * 0.4), cos(time * 0.3)) * 1.5, 3);
      float c3 = fbm(p * 1.5 + vec2(cos(time * 0.5), sin(time * 0.6)) * 1.0, 2);
      
      return (c1 + c2 + c3) / 3.0;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 st = (2.0 * gl_FragCoord.xy - uResolution.xy) / min(uResolution.x, uResolution.y);
      
      float time = uTime * uSpeed;
      
      // Mouse influence
      vec2 mouse = uMouse * 2.0 - 1.0;
      float mouseInfluence = 1.0 - smoothstep(0.0, 1.5, length(st - mouse));
      
      // Create flowing liquid patterns
      vec2 flow1 = vec2(
        fbm(st * 2.0 + vec2(time * 0.1, time * 0.05), 4),
        fbm(st * 2.0 + vec2(time * 0.15, -time * 0.1), 4)
      ) * 0.3;
      
      vec2 flow2 = vec2(
        fbm((st + flow1) * 1.5 + vec2(-time * 0.08, time * 0.12), 3),
        fbm((st + flow1) * 1.5 + vec2(time * 0.11, -time * 0.07), 3)
      ) * 0.4;
      
      // Caustics effect
      float causticsPattern = caustics(st + flow1 + flow2, time);
      
      // Color mixing based on patterns
      float pattern1 = fbm(st + flow1 * 2.0, 4);
      float pattern2 = fbm(st + flow2 * 1.5 + vec2(time * 0.2, -time * 0.1), 3);
      
      // Dynamic color interpolation
      vec3 color = mix(uColor1, uColor2, pattern1);
      color = mix(color, uColor3, pattern2 * 0.7);
      
      // Add caustics highlights
      color += causticsPattern * 0.3 * vec3(0.4, 0.8, 1.0);
      
      // Mouse interaction
      color += mouseInfluence * 0.2 * vec3(0.6, 0.3, 1.0);
      
      // Add depth with gradient
      float depth = smoothstep(0.0, 1.0, length(st));
      color *= (1.0 - depth * 0.3);
      
      // Final intensity adjustment
      color *= uIntensity;
      
      // Add subtle transparency variation
      float alpha = 0.4 + pattern1 * 0.3 + causticsPattern * 0.2;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ LiquidMaterial });

// Liquid plane component
function LiquidPlane({ mousePosition }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse.set(mousePosition.x, mousePosition.y);
    }
  });

  return (
    <mesh ref={meshRef} scale={[20, 20, 1]} position={[0, 0, -5]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <liquidMaterial
        ref={materialRef}
        uResolution={[window.innerWidth, window.innerHeight]}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Secondary animated shapes for added depth
function FloatingShapes() {
  const shapes = useRef([]);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      shapes.current.forEach((shape, index) => {
        if (shape) {
          const time = state.clock.elapsedTime + index;
          shape.position.y = Math.sin(time * 0.5 + index) * 2;
          shape.position.x = Math.cos(time * 0.3 + index) * 3;
          shape.rotation.x = time * 0.2;
          shape.rotation.y = time * 0.15;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (shapes.current[i] = el)}
          position={[
            Math.cos(i) * 4,
            Math.sin(i) * 3,
            -3 - i * 0.5
          ]}
        >
          <torusGeometry args={[0.5, 0.2, 8, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#4c1d95' : '#312e81'}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Water Backdrop Component
export default function WaterBackdrop({ 
  className = "",
  intensity = 0.8,
  speed = 1.0,
  colors = {
    color1: '#1e1b4b',
    color2: '#312e81', 
    color3: '#4c1d95'
  }
}) {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: event.clientX / window.innerWidth,
        y: 1 - event.clientY / window.innerHeight
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: false,
          powerPreference: 'high-performance'
        }}
      >
        <LiquidPlane mousePosition={mousePosition.current} />
        <FloatingShapes />
      </Canvas>
      
      {/* CSS Gradient Fallback */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, ${colors.color3}40 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${colors.color2}40 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${colors.color1}40 0%, transparent 50%)
          `
        }}
      />
    </div>
  );
}