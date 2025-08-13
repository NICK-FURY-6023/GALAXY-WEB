// components/LatestUpdates.js

import { useState, useEffect } from 'react';
import { FaCodeBranch, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const CommitList = ({ commits, repoName, owner }) => {
    const repoUrl = `https://github.com/${owner}/${repoName === 'Website' ? 'GALAXY-WEBD' : 'GALAXY-2.O'}`;

    return (
        <div className="space-y-4">
            {commits && commits.length > 0 ? (
                commits.map((commit) => (
                    <div key={commit.sha} className="flex gap-4 border-t border-gray-200 dark:border-white/10 pt-4 first:pt-0 first:border-t-0">
                        <Image src={commit.authorAvatar} alt={commit.author} width={40} height={40} className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="w-full overflow-hidden">
                            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 break-words leading-tight">{commit.message}</p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{commit.author}</p>
                                <p className="text-xs text-gray-500" title={new Date(commit.date).toLocaleString()}>
                                    committed {timeAgo(commit.date)}
                                </p>
                                <a href={`${repoUrl}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-green-500 hover:underline ml-auto flex items-center gap-1.5">
                                    <FaCodeBranch />
                                    {commit.short_sha}
                                </a>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400 p-4">No recent updates.</p>
            )}
        </div>
    );
};

export default function LatestUpdates({ websiteCommits, botCommits }) {
    return (
        <section className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Latest Updates</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"> {/* items-start added for alignment */}
                {/* Bot Commits Box */}
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <div className="glass-card flex flex-col p-6">
                        <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">GALAXY Bot Updates</h3>
                        {/* --- CHANGE: Scrollable area with max-height --- */}
                        <div className="overflow-y-auto pr-2 flex-grow" style={{maxHeight: '60vh'}}>
                            <CommitList commits={botCommits} repoName="Bot" owner="NICK-FURY-6023" />
                        </div>
                    </div>
                </motion.div>
                {/* Website Commits Box */}
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <div className="glass-card flex flex-col p-6">
                        <h3 className="text-xl font-bold text-center mb-4 flex-shrink-0">Website Updates</h3>
                        {/* --- CHANGE: Scrollable area with max-height --- */}
                        <div className="overflow-y-auto pr-2 flex-grow" style={{maxHeight: '60vh'}}>
                            <CommitList commits={websiteCommits} repoName="Website" owner="NICK-FURY-6023" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}