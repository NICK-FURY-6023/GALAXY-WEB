// components/Hero.js

import ActionButton from './ui/ActionButton';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="text-center pt-24 md:pt-40 container mx-auto">
            <motion.h1 
                className="text-5xl md:text-7xl font-black uppercase text-primary dark:text-primary-dark"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Galaxy Music Bot
            </motion.h1>
            
            {/* --- NEW: Colorful Subtitle --- */}
            <motion.p 
                className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                The ultimate high-quality music bot for your Discord server.
                Crystal-clear <span className="font-bold text-cyan-500">320kbps audio</span>, 
                <span className="font-bold text-green-500"> 24/7 playback</span>, 
                and a universe of features, completely <span className="font-bold text-orange-400">free</span>.
            </motion.p>

            <motion.div 
                className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
                <ActionButton href="https://discord.com/api/oauth2/authorize?client_id=1044596050859663401&permissions=41375902330737&redirect_uri=https%3A%2F%2Fdiscord.gg%2FU4kN6ZJyMt&response_type=code&scope=bot%20applications.commands%20guilds.join%20identify" isGlowing={true}>Invite Bot</ActionButton>
                <ActionButton href="https://discord.gg/U4kN6ZJyMt" isGlowing={false}>Join Support Server</ActionButton>
            </motion.div>
        </section>
    );
}
