// components/WhyGalaxy.js

import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import GlassCard from './ui/GlassCard';
import { motion } from 'framer-motion';

const comparisonData = [
    { feature: "Audio Quality", galaxy: "320kbps Crisp Audio", others: "Standard Quality" },
    { feature: "All Features Free", galaxy: true, others: false },
    { feature: "24/7 Music", galaxy: true, others: "Premium Only" },
    { feature: "Lag-Free Experience", galaxy: true, others: "Often Lags" },
    { feature: "Customer Support", galaxy: "Active & Fast", others: "Slow / None" },
];

export default function WhyGalaxy() {
    return (
        <section className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose GALAXY?</h2>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <GlassCard>
                    <div className="p-4 md:p-8">
                        {/* --- Desktop Header (Phone par hidden) --- */}
                        <div className="hidden md:grid grid-cols-3 gap-4 font-bold text-center mb-4">
                            <h3 className="text-xl text-gray-800 dark:text-gray-100">Feature</h3>
                            <h3 className="text-xl text-primary dark:text-primary-dark">GALAXY</h3>
                            <h3 className="text-xl text-gray-500 dark:text-gray-500">Other Bots</h3>
                        </div>

                        {comparisonData.map((item, index) => (
                            // Ye poora container ab ek fragment hai
                            <div key={index}>
                                {/* --- Desktop View (Phone par hidden) --- */}
                                <div className="hidden md:grid grid-cols-3 gap-4 items-center text-center py-4 border-t border-gray-200 dark:border-white/10">
                                    <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">{item.feature}</p>
                                    <div className="text-primary dark:text-primary-dark">
                                        {typeof item.galaxy === 'boolean' ? 
                                            <FaCheckCircle className="inline-block text-2xl text-green-500" /> : 
                                            <span className="font-bold">{item.galaxy}</span>
                                        }
                                    </div>
                                    <div className="text-gray-500">
                                        {typeof item.others === 'boolean' ? 
                                            <FaTimesCircle className="inline-block text-2xl text-red-500" /> :
                                            <span className="font-bold">{item.others}</span>
                                        }
                                    </div>
                                </div>

                                {/* --- NEW Mobile View (Desktop par hidden) --- */}
                                <div className="md:hidden py-4 border-t border-gray-200 dark:border-white/10">
                                    <p className="font-bold text-lg text-center mb-3">{item.feature}</p>
                                    <div className="flex justify-around items-center">
                                        <div className="text-center">
                                            <p className="font-semibold text-primary dark:text-primary-dark mb-1">GALAXY</p>
                                            {typeof item.galaxy === 'boolean' ? 
                                                <FaCheckCircle className="mx-auto text-2xl text-green-500" /> : 
                                                <span className="font-semibold text-sm">{item.galaxy}</span>
                                            }
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-gray-500 mb-1">Other Bots</p>
                                            {typeof item.others === 'boolean' ? 
                                                <FaTimesCircle className="mx-auto text-2xl text-red-500" /> :
                                                <span className="font-semibold text-sm">{item.others}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>
        </section>
    );
}