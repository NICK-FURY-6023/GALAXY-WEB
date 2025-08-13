// components/ui/ThemeToggle.js

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion'; // <-- YE IMPORT MISSING THA

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        // Hydration error se bachne ke liye, jab tak page client par mount na ho, kuch mat dikhao
        return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
    }

    return (
        <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-full text-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Light and Dark Mode"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
        >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </motion.button>
    );
}