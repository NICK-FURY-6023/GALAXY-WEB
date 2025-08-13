// components/Features.js

import GlassCard from './ui/GlassCard';
// Naye icons, FaTrophy (for Achievements) add kiya hai
import { FaSatelliteDish, FaWaveSquare, FaSlidersH, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Final, glowing icons ke saath
const features = [
    { 
        title: "Multi-Platform", 
        description: "Stream from YouTube, Spotify, SoundCloud, and more.", 
        icon: <FaSatelliteDish className="text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" /> 
    },
    { 
        title: "Premium Audio", 
        description: "Crystal-clear 320kbps audio for the best experience.", 
        icon: <FaWaveSquare className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" /> 
    },
    { 
        title: "Advanced Filters", 
        description: "Equalizer, Nightcore, Bass Boost, and other effects.", 
        icon: <FaSlidersH className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" /> 
    },
    { 
        title: "Achievements", 
        description: "Unlock special achievements and quests by using the bot.", 
        // --- CHANGE: Yahan naya Trophy icon add kiya hai ---
        icon: <FaTrophy className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
    },
];

export default function Features() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <section className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                {features.map((feature) => (
                    <motion.div key={feature.title} variants={itemVariants}>
                        <GlassCard>
                            <div className="p-6 flex flex-col items-center text-center h-full">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}