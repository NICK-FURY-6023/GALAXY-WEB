// pages/website-updates.js

import Head from 'next/head';
import { FaCodeBranch } from 'react-icons/fa';

// Commit List Component
const CommitList = ({ commits, owner, repo }) => (
    <div className="space-y-4">
        {commits && commits.length > 0 ? (
            commits.map((commit) => (
                <div key={commit.sha} className="flex gap-4 glass-card p-4">
                    <FaCodeBranch className="text-gray-500 mt-1 text-xl flex-shrink-0" />
                    <div className="w-full overflow-hidden">
                        <p className="text-base font-semibold text-gray-800 dark:text-gray-200 break-words">{commit.message}</p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <a href={`https://github.com/${owner}/${repo}/commit/${commit.sha}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-green-500 hover:underline">
                                {commit.sha}
                            </a>
                            <p className="text-xs text-gray-500">by {commit.author}</p>
                            <p className="text-xs text-gray-500 ml-auto">{new Date(commit.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-400 p-4">No recent commits to display.</p>
        )}
    </div>
);


export default function WebsiteUpdatesPage({ commits, error }) {
    return (
        <>
            <Head>
                <title>GALAXY | Website Updates</title>
            </Head>
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-primary dark:text-primary-dark">Website Updates</h1>
                        <p className="text-lg mt-2 text-gray-500 dark:text-gray-400">Latest commits pushed to the GALAXY-WEBD repository.</p>
                    </div>

                    {error ? (
                        <p className="text-center text-lg text-red-500">Error: {error}</p>
                    ) : (
                        <CommitList commits={commits} owner="NICK-FURY-6023" repo="GALAXY-WEBD" />
                    )}
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    try {
        const token = process.env.GITHUB_PAT;
        if (!token) { throw new Error("GitHub PAT not configured."); }

        const owner = "NICK-FURY-6023";
        const repoName = "GALAXY-WEBD";
        const repoUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;
        
        const response = await fetch(repoUrl, { headers: { Authorization: `Bearer ${token}` } });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const commitsData = await response.json();
        const commits = commitsData.slice(0, 30).map(c => ({
            sha: c.sha.substring(0, 7),
            message: c.commit.message,
            author: c.commit.author.name,
            date: c.commit.author.date,
        }));

        return { props: { commits, error: null } };

    } catch (error) {
        console.error("[Website Updates Error]:", error.message);
        return { props: { commits: [], error: error.message } };
    }
}