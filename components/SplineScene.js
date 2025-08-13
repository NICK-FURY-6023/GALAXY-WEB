// components/SplineScene.js

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function SplineScene() {
  const canvasRef = useRef(null);
  // Hum theme ko yahan sirf initial color set karne ke liye use karenge
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let stars = [];
    // Performance ke liye stars kam rakhe hain
    const numStars = 400; 
    
    // Ye function canvas ko set karega
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.5,
          vz: Math.random() * 0.4 + 0.1 // Har star ki alag speed
        });
      }
    };

    // Ye function animation loop chalayega
    const animate = () => {
      // Har frame par check karo ki dark mode on hai ya nahi
      const starColor = document.documentElement.classList.contains('dark') ? 'white' : '#333333';
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = starColor;

      stars.forEach(star => {
        star.y += star.vz;
        
        // Agar star screen se bahar jaye to use upar se wapas le aao
        if (star.y > canvas.height + star.radius) {
          star.y = 0 - star.radius;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Ye function tab switch hone par kaam karega
    const handleVisibilityChange = () => {
        if (document.hidden) {
            // Tab hide hone par animation rok do
            cancelAnimationFrame(animationFrameId);
        } else {
            // Tab wapas aane par animation shuru karo
            animationFrameId = requestAnimationFrame(animate);
        }
    };

    const handleResize = () => {
        setup();
    };

    // Initial setup aur animation start karo
    setup();
    animate();

    // Event listeners add karo
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function: Jab component unmount ho to listeners hata do
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty array ka matlab hai ki ye effect sirf ek baar (component mount hone par) chalega

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-[-1] transition-opacity duration-500"
    />
  );
}