// components/Hero.js

import ActionButton from './ui/ActionButton';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import 3D logo to avoid SSR issues
const VenaLogo3D = dynamic(() => import('./veynova/VenaLogo3D'), {
  ssr: false,
  loading: () => (
    <div className="w-96 h-96 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
      <div className="text-6xl text-purple-400">🎵</div>
    </div>
  )
});

export default function Hero() {
    return (
        <section className="text-center pt-24 md:pt-40 container mx-auto">
            {/* 3D Vena Logo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8"
            >
                <VenaLogo3D 
                    width={384} 
                    height={384} 
                    className="mx-auto"
                    showBackground={false}
                />
            </motion.div>

            <motion.h1 
                className="text-5xl md:text-7xl font-black uppercase text-primary dark:text-primary-dark"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    VEYNOVA
                </span>
            </motion.h1>
            
            {/* --- NEW: Colorful Subtitle --- */}
            <motion.p 
                className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
                The ultimate music experience combining 
                <span className="font-bold text-cyan-500"> multi-source streaming</span>, 
                <span className="font-bold text-green-500"> Discord bot control</span>, 
                and <span className="font-bold text-orange-400">immersive 3D visuals</span>.
            </motion.p>

            <motion.div 
                className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            >
                <ActionButton href="/music" isGlowing={true}>Enter Music Hub</ActionButton>
                <ActionButton href="https://discord.gg/U4kN6ZJyMt" isGlowing={false}>Join Community</ActionButton>
            </motion.div>
        </section>
    );
}
