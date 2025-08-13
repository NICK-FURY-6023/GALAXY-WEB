// pages/about.js

import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaRocket, FaHeart, FaCode, FaUsers, FaStar } from 'react-icons/fa';

// Styling ke liye helper components
const Comment = ({ children }) => <p className="text-gray-500 text-sm">{children}</p>;
const Key = ({ children }) => <span className="text-green-400">'{children}'</span>;
const StringValue = ({ children }) => <span className="text-orange-400">"{children}"</span>;

export default function AboutPage() {
    const storyPoints = [
        {
            icon: <FaRocket />,
            key: "motive",
            value: "Our core motive is to redefine the Discord music experience. We saw a world of complicated bots with poor audio quality and premium paywalls. GALAXY was built to be the simple, powerful, and reliable solution that delivers a crystal-clear, lag-free soundtrack to your community."
        },
        {
            icon: <FaCode />,
            key: "technology",
            value: "GALAXY is engineered for performance, running on a robust, low-latency Lavalink infrastructure. This allows us to stream pristine 320kbps audio directly to your voice channel. The bot is coded with modern, efficient technologies to handle numerous servers without compromising on speed or quality."
        },
        {
            icon: <FaHeart />,
            key: "journey",
            value: "The GALAXY project began as a passion project in late 2023. After countless hours of development, rigorous testing, and invaluable feedback from our early beta-testing community, the first public version was launched. Our journey is continuous, with new features always on the horizon."
        },
        {
            icon: <FaStar />,
            key: "promise",
            value: "We believe great features shouldn't be locked behind a paywall. Our promise is simple: GALAXY, along with all its current and future premium-grade features like 24/7 mode and advanced filters, will always be 100% free for everyone. No subscriptions, no hidden costs."
        },
        {
            icon: <FaUsers />,
            key: "vision",
            value: "Our vision is to make GALAXY the most beloved and feature-rich music bot on Discord. We are constantly innovating and developing new tools. Our future roadmap is directly shaped by the suggestions and needs of you, our users, because building the perfect bot is a collaborative effort."
        }
    ];

    return (
        <>
            <Head>
                <title>About GALAXY | Our Story & Mission</title>
                <meta name="description" content="Learn about GALAXY Bot's mission, technology, and our promise to deliver the best free music experience on Discord." />
                <link rel="canonical" href="https://galaxy-bot-me.vercel.app/about" />
            </Head>
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-black uppercase text-primary dark:text-primary-dark text-center mb-12"
                    >
                        About GALAXY
                    </motion.h1>

                    <div className="space-y-6">
                        {storyPoints.map((point, index) => (
                            <motion.div
                                key={point.key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-6 font-mono text-gray-300 text-lg leading-relaxed">
                                    <div className="flex items-start gap-5">
                                        <div className="text-2xl text-cyan-400 pt-1">
                                            {point.icon}
                                        </div>
                                        <div className="flex-1">
                                            <Comment># Section {index + 1}: {point.key}</Comment>
                                            <p className="text-orange-400">
                                                "{point.value}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}