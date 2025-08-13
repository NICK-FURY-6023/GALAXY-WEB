// components/ui/ActionButton.js

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ActionButton({ href, children, isGlowing = false }) {
    // Classes for light mode and dark mode
    const lightModeClasses = "bg-primary text-white";
    const darkModeClasses = "dark:bg-primary-dark dark:text-black dark:hover:bg-gray-200";
    const glowClass = isGlowing ? "dark:shadow-glow" : "";

    return (
        <Link href={href} passHref>
            <motion.div
                className={`px-8 py-4 font-bold text-lg rounded-full cursor-pointer transition-all duration-300 ease-in-out btn-3d uppercase tracking-wider ${lightModeClasses} ${darkModeClasses} ${glowClass}`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                {children}
            </motion.div>
        </Link>
    );
}