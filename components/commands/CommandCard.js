// components/commands/CommandCard.js
import GlassCard from '../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, memo } from 'react';
import { FaChevronDown, FaRegCopy, FaCheck } from 'react-icons/fa';

const CommandCard = memo(function CommandCard({ command, description, usage, color }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const toggleOpen = () => setIsOpen(!isOpen);

    const cardStyle = {
        borderTop: `3px solid ${color}`,
        boxShadow: `0 0 15px -2px ${color}B3, 0 0 4px -1px ${color}`,
    };

    const usageParts = usage ? usage.split(' ') : [command];
    const cmdName = usageParts[0];
    const cmdArgs = usageParts.slice(1).join(' ');

    const handleCopy = (e) => {
        e.stopPropagation();
        const commandToCopy = `+${command}`;
        navigator.clipboard.writeText(commandToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div layout className="w-full">
            <GlassCard className="w-full" style={cardStyle}>
                <div className="p-4 cursor-pointer" onClick={toggleOpen}>
                    <div className="flex justify-between items-center">
                        <p className="font-mono font-bold text-lg text-primary dark:text-primary-dark">
                            <span className="text-gray-400 dark:text-gray-500">+/</span>{command}
                        </p>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                            <FaChevronDown className="text-gray-600 dark:text-gray-400" />
                        </motion.div>
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <p className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400">{description}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Usage Example:</h4>
                                    <div className="flex items-center gap-2">
                                        <pre className="flex-grow bg-black/50 p-3 rounded-md mt-1 overflow-x-auto">
                                            <code className="text-sm">
                                                <span className="text-cyan-400">+</span>
                                                <span className="text-green-400">{cmdName}</span>
                                                {cmdArgs && <span className="text-orange-400"> {cmdArgs}</span>}
                                            </code>
                                        </pre>
                                        <button onClick={handleCopy} className="p-3 mt-1 bg-gray-500/20 rounded-md hover:bg-gray-500/40 transition-colors" title="Copy Command">
                                            {isCopied ? <FaCheck className="text-green-500" /> : <FaRegCopy />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </motion.div>
    );
});

export default CommandCard;