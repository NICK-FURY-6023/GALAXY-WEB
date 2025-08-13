import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const sidebarVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  exit: { x: '100%', transition: { duration: 0.3, ease: 'easeInOut' } },
};

export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-64 bg-secondary-light dark:bg-secondary-dark shadow-2xl z-50 p-6"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary-light dark:text-text-secondary-dark">
              <FiX size={28} />
            </button>
            <nav className="mt-16 flex flex-col space-y-6 text-lg">
              <Link href="/" onClick={onClose} className="text-text-main-light dark:text-text-main-dark hover:text-accent-purple dark:hover:text-accent-glow transition-colors">Home</Link>
              <Link href="/commands" onClick={onClose} className="text-text-main-light dark:text-text-main-dark hover:text-accent-purple dark:hover:text-accent-glow transition-colors">Commands</Link>
              <a href="#" target="_blank" rel="noopener noreferrer" onClick={onClose} className="text-text-main-light dark:text-text-main-dark hover:text-accent-purple dark:hover:text-accent-glow transition-colors">Support Server</a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}