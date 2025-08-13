// pages/index.js

import Head from 'next/head';
import Hero from '../components/Hero';
import NowPlaying from '../components/NowPlaying';
import LatestUpdates from '../components/LatestUpdates';
import BotStats from '../components/BotStats';
import Features from '../components/Features';
import WhyGalaxy from '../components/WhyGalaxy';
import DeveloperProfile from '../components/DeveloperProfile';

export default function Home({ websiteCommits, botCommits }) {
  const siteUrl = "https://galaxy-bot-me.vercel.app";
  return (
    <>
      <Head>
        <title>GALAXY | The Ultimate Discord Music Bot (24/7, Free)</title>
        <meta name="description" content="Experience GALAXY, the ultimate free music bot for Discord. Stream high-fidelity 320kbps audio 24/7 from Spotify, YouTube, and more. Lag-free & powerful." />
        <link rel="canonical" href={siteUrl} />
      </Head>
      <div className="px-4">
        <main className="space-y-24 md:space-y-40 py-20">
          <Hero />
          <NowPlaying />
          <LatestUpdates websiteCommits={websiteCommits} botCommits={botCommits} />
          <BotStats />
          <Features />
          <WhyGalaxy />
          <DeveloperProfile />
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const token = process.env.GITHUB_PAT;
    const owner = "NICK-FURY-6023";
    const repoNames = ["GALAXY-WEBD", "GALAXY-2.O"];

    if (!token) {
      console.error("GITHUB_PAT is missing on the server.");
      return { props: { websiteCommits: [], botCommits: [] } };
    }

    const fetchRepoCommits = async (repoName) => {
      const repoUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;
      const response = await fetch(repoUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        console.error(`Failed to fetch commits for ${repoName}: ${response.statusText}`);
        return [];
      }
      const commits = await response.json();
      
      // --- CHANGE: Wapas se 5 commits lenge ---
      return commits.slice(0, 5).map(c => ({
        sha: c.sha,
        short_sha: c.sha.substring(0, 7),
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        authorAvatar: c.author ? c.author.avatar_url : "https://github.com/identicons/default.png"
      }));
    };

    const [websiteCommits, botCommits] = await Promise.all([
      fetchRepoCommits(repoNames[0]),
      fetchRepoCommits(repoNames[1])
    ]);

    return { props: { websiteCommits, botCommits } };

  } catch (error) {
    console.error("Error fetching commits for homepage:", error.message);
    return { props: { websiteCommits: [], botCommits: [] } };
  }
}