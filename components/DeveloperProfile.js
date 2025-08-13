// components/DeveloperProfile.js

import Image from 'next/image';
import GlassCard from './ui/GlassCard';
import { FaDiscord, FaTwitter, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DiscordPresence from './DiscordPresence';

// --- BadgeIcon ab aapke local files use karega ---
const BadgeIcon = ({ badge }) => {
    const badgeInfo = {
        HypeSquadBrilliance: { src: '/badges/hypesquadbrilliance.svg', label: 'HypeSquad Brilliance' },
        ActiveDeveloper: { src: '/badges/activedeveloper.svg', label: 'Active Developer' },
        Nitro: { src: '/badges/discordnitro.svg', label: 'Nitro Subscriber' },
        ServerBooster: { src: '/badges/discordboost1.svg', label: 'Server Booster' },
    };

    const info = badgeInfo[badge];
    if (!info) return null;

    return (
        <div title={info.label} className="w-6 h-6">
            <Image src={info.src} alt={info.label} width={22} height={22} unoptimized />
        </div>
    );
};

export default function DeveloperProfile() {
    const bannerUrl = "https://cdn.discordapp.com/banners/761635564835045387/a_965795c5182cabac1b9f50f01b08cdd3.gif?size=2048";
    const discordId = "761635564835045387";
    const [presence, setPresence] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');
        let heartbeatInterval;
        ws.onopen = () => ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.op === 1) {
                heartbeatInterval = setInterval(() => ws.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
            } else if (data.op === 0) {
                setPresence(data.d);
            }
        };
        ws.onclose = () => clearInterval(heartbeatInterval);
        return () => { ws.close(); clearInterval(heartbeatInterval); };
    }, [discordId]);

    const badgeFlags = presence?.discord_user?.public_flags || 0;
    const badges = [];
    if (badgeFlags & (1 << 7)) badges.push('HypeSquadBrilliance');
    if (badgeFlags & (1 << 22)) badges.push('ActiveDeveloper');
    if (presence?.discord_user.premium_type) badges.push('Nitro');
    if (presence?.premium_guild_since) badges.push('ServerBooster');

    return (
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <h2 className="text-4xl font-bold text-center mb-12">Meet The Developer</h2>
            <GlassCard className="max-w-xl mx-auto overflow-hidden">
                <div>
                    <Image src={bannerUrl} alt="Developer's animated banner" width={600} height={240} className="object-cover" priority unoptimized={true} />
                </div>
                <div className="p-6 relative">
                    <div className="flex items-end -mt-20">
                        <Image src="/dev-icon.png" alt="Developer's Icon" width={96} height={96} className="bg-dark-bg rounded-full border-4 border-dark-bg flex-shrink-0" />
                        <div className="ml-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-2xl font-bold text-primary dark:text-primary-dark">₦ł₵₭ ₣ɄⱤɎ ⚒</h3>
                                {badges.map(badge => <BadgeIcon key={badge} badge={badge} />)}
                            </div>
                            <div className="text-secondary dark:text-secondary-dark font-mono text-sm">
                                nick__fury
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-600 dark:text-gray-400">
                            The mind behind the music, dedicated to crafting the ultimate audio experience on Discord.
                        </p>
                        <DiscordPresence presence={presence} />
                        <div className="flex text-2xl gap-5 mt-6 pt-4 border-t border-gray-700">
                            <a href="https://discord.gg/U4kN6ZJyMt" target="_blank" rel="noopener noreferrer" aria-label="Discord"><FaDiscord /></a>
                            <a href="https://twitter.com/NICK_FURY_6023" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://github.com/NICK-FURY-6023" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                            <a href="https://instagram.com/parthaobroy" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                            <a href="https://youtube.com/@vayuesports" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.section>
    );
}
