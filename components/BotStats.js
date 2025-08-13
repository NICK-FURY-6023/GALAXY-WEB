// components/BotStats.js

import { motion } from 'framer-motion';
import { FaServer, FaUsers, FaHeartbeat } from 'react-icons/fa';
import GlassCard from './ui/GlassCard';

// Dummy data
const dummyStats = {
    servers: 255,
    users: 25000,
    ping: 60,
};

const StatItem = ({ icon, label, value }) => (
    <div className="text-center">
        {/* --- CHANGE: Icon par glow effect add kiya hai --- */}
        <div className="text-4xl md:text-5xl text-primary dark:text-primary-dark mb-3
                        drop-shadow-[0_0_5px_rgba(31,41,55,0.4)]
                        dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {icon}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            {value}
        </h3>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
            {label}
        </p>
    </div>
);

export default function BotStats() {
    return (
        <section className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <GlassCard>
                    <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                        <StatItem icon={<FaServer />} label="Servers" value={dummyStats.servers.toLocaleString()} />
                        <StatItem icon={<FaUsers />} label="Users" value={dummyStats.users.toLocaleString()} />
                        <StatItem icon={<FaHeartbeat />} label="Ping" value={`${dummyStats.ping}ms`} />
                    </div>
                </GlassCard>
            </motion.div>
        </section>
    );
}