// components/layout/Header.js

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Icons import kiye hain
import { FaHome, FaInfoCircle, FaList, FaHeadset, FaBars, FaTimes } from 'react-icons/fa';

// Mobile menu NavLink
const MobileNavLink = ({ href, children, onClick, color }) => (
    <Link href={href} onClick={onClick} className={`flex items-center gap-3 py-2 text-xl dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors duration-300 ${color}`}>
        {children}
    </Link>
);

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const [activeLink, setActiveLink] = useState(router.pathname);

    useEffect(() => {
        const existingTimer = window.headerAnimationTimer;
        if (existingTimer) clearTimeout(existingTimer);
        setActiveLink(router.pathname);
        const newTimer = setTimeout(() => setActiveLink(null), 1200);
        window.headerAnimationTimer = newTimer;
        return () => clearTimeout(newTimer);
    }, [router.pathname]);

    // Har link ke liye alag color aur naya icon
    const navLinks = [
        { name: 'Home', href: '/', color: 'text-blue-500', bgColor: 'bg-blue-500', icon: <FaHome /> },
        { name: 'About', href: '/about', color: 'text-green-500', bgColor: 'bg-green-500', icon: <FaInfoCircle /> },
        { name: 'Commands', href: '/commands', color: 'text-purple-500', bgColor: 'bg-purple-500', icon: <FaList /> },
        { name: 'Support', href: 'https://discord.gg/U4kN6ZJyMt', color: 'text-orange-500', bgColor: 'bg-orange-500', icon: <FaHeadset />, isExternal: true },
    ];

    const botInviteUrl = "https://discord.com/api/oauth2/authorize?client_id=1044596050859663401&permissions=41375902330737&redirect_uri=https%3A%2F%2Fdiscord.gg%2FU4kN6ZJyMt&response_type=code&scope=bot%20applications.commands%20guilds.join%20identify";

    return (
        <header className="sticky top-0 z-50 py-3 px-4 sm:px-8 glass-card">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/galaxy-logo.png" alt="Galaxy Bot Logo" width={40} height={40} className="rounded-full" unoptimized/>
                        <span className="hidden sm:block text-2xl font-bold tracking-wider text-gray-800 dark:text-white">GALAXY</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-2 text-sm">
                    {navLinks.map(link => (
                        <div key={link.name} className="relative p-2">
                            {link.isExternal ? (
                                <a href={link.href} target="_blank" rel="noopener noreferrer" className={`bubble-btn px-4 py-2 font-bold flex items-center gap-2 ${link.color}`}>
                                    {link.icon} {link.name}
                                </a>
                            ) : (
                                <Link href={link.href} className={`bubble-btn px-4 py-2 font-bold flex items-center gap-2 ${link.color}`}>
                                    {link.icon} {link.name}
                                </Link>
                            )}
                            <AnimatePresence>
                                {activeLink === link.href && (
                                    <motion.div
                                        className={`absolute bottom-[-2px] left-2 right-2 h-1 rounded-full ${link.bgColor}`}
                                        layoutId="active-header-underline"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <a href={botInviteUrl} target="_blank" rel="noopener noreferrer" className="bubble-btn invite hidden sm:block">
                        Invite Bot
                    </a>
                    <ThemeToggle />
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu" className="focus:outline-none text-gray-800 dark:text-white">
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col items-center gap-4">
                            {navLinks.map(link => (
                                 link.isExternal ? (
                                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 py-2 text-xl font-bold ${link.color}`}>
                                        {link.icon} {link.name}
                                    </a>
                                 ) : (
                                    <MobileNavLink key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} color={link.color}>
                                        {link.icon} {link.name}
                                    </MobileNavLink>
                                 )
                            ))}
                            <a href={botInviteUrl} target="_blank" rel="noopener noreferrer" className="bubble-btn invite mt-2">
                                Invite Bot
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}