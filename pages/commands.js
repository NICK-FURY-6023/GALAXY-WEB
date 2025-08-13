// pages/commands.js

import Head from 'next/head';
import CommandExplorer from '../components/commands/CommandExplorer';

export default function CommandsPage() {
    return (
        <>
            <Head>
                <title>Commands | GALAXY Bot</title>
                <meta name="description" content="Explore the full list of commands for the GALAXY Discord bot. Includes commands for music, settings, and more, with examples." />
                <link rel="canonical" href="https://galaxy-bot-me.vercel.app/commands" />
            </Head>
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-black uppercase text-primary dark:text-primary-dark">
                        Bot Commands
                    </h1>
                    <p className="text-lg mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore all user commands. The bot supports both prefix `+` and slash `/` commands.
                    </p>
                </div>
                <CommandExplorer />
            </main>
        </>
    );
}