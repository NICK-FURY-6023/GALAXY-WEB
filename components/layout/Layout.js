// components/layout/Layout.js

import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import WaterBackdrop to avoid SSR issues
const WaterBackdrop = dynamic(() => import('../veynova/WaterBackdrop'), {
  ssr: false
});

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-light dark:bg-dark text-text-main-light dark:text-text-main-dark overflow-x-hidden relative">
            {/* Water/Liquid Motion Backdrop */}
            <WaterBackdrop intensity={0.6} speed={0.8} />
            
            <div className="relative z-10">
                <Header />
                <motion.main 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="min-h-screen"
                >
                    {children}
                </motion.main>
                <Footer />
            </div>
        </div>
    );
}