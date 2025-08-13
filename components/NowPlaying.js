// components/NowPlaying.js

import { FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import GlassCard from './ui/GlassCard'; // GlassCard import karo

const songData = {
    isPlaying: true,
    song: "Legends Never Die",
    artist: "League of Legends, Against The Current",
    albumArt: "https://cdn.discordapp.com/attachments/997575905541107872/1391200753196208159/4Q46xYqUwZQ-HD.jpg?ex=686e53ea&is=686d026a&hm=cf26a8411db51be80502bf99543605eb5efba2700c9fbe5eeb98b32b95febc54&",
    totalDurationSeconds: 235,
};

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export default function NowPlaying() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => { setHasMounted(true); }, []);

    const [elapsedSeconds, setElapsedSeconds] = useState(75);
    const [progress, setProgress] = useState(0);
    const isRotating = songData.isPlaying;

    useEffect(() => {
        if (!hasMounted || !songData.isPlaying) return;
        const timerInterval = setInterval(() => {
            setElapsedSeconds(prev => (prev + 1) >= songData.totalDurationSeconds ? 0 : prev + 1);
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [hasMounted, songData.isPlaying]);

    useEffect(() => {
        const currentProgress = (elapsedSeconds / songData.totalDurationSeconds) * 100;
        setProgress(currentProgress);
    }, [elapsedSeconds]);

    if (!hasMounted) { return null; }
    if (!songData.isPlaying) { return null; }

    return (
        // --- Isko ek normal section bana diya hai ---
        <section className="container mx-auto px-4">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md mx-auto" // Center me laane ke liye
            >
                <GlassCard>
                    <div className="p-4">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-20 h-20 flex-shrink-0" // Art thoda bada kar diya
                                animate={{ rotate: isRotating ? 360 : 0 }}
                                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                            >
                                <img
                                    src={songData.albumArt}
                                    alt="Album Art"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </motion.div>
                            <div className="flex-grow overflow-hidden">
                                <p className="font-bold text-lg truncate text-primary dark:text-primary-dark">{songData.song}</p>
                                <p className="text-base text-secondary dark:text-secondary-dark truncate">{songData.artist}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <img src="/galaxy-logo.png" alt="Galaxy Logo" width={16} height={16} className="rounded-full" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Playing on GALAXY</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div
                                    className="bg-primary dark:bg-primary-dark h-1.5 rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        transition: 'width 1s linear',
                                    }}
                                >
                                </div>
                            </div>
                            <div className="flex justify-between text-xs font-mono text-gray-500 dark:text-gray-400 mt-1.5">
                                <span>{formatTime(elapsedSeconds)}</span>
                                <span>{formatTime(songData.totalDurationSeconds)}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        </section>
    );
}