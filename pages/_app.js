import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

function LoadingScreen() {
    return (
        <motion.div
            className="fixed inset-0 bg-dark-bg z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 360 }}
                transition={{ duration: 2.0, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            >
                <Image src="/galaxy-logo.png" alt="Galaxy Bot Loading Logo" width={128} height={128} className="rounded-full" unoptimized />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mt-4 tracking-widest uppercase">GALAXY</h1>
            <p className="text-primary-dark">Loading the Cosmos...</p>
        </motion.div>
    );
}

function MyApp({ Component, pageProps, router }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Layout>
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loading" />
          ) : (
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Component {...pageProps} />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;