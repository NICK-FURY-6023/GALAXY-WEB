// pages/api/commits.js

export default async function handler(req, res) {
  try {
    const token = process.env.GITHUB_PAT;
    if (!token) { throw new Error("GitHub PAT not configured."); }

    const owner = "NICK-FURY-6023";
    const repoNames = ["GALAXY-WEBD", "GALAXY-2.O"];

    const fetchRepoCommits = async (repoName) => {
      const repoUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;
      const response = await fetch(repoUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        console.error(`Failed to fetch commits for ${repoName}: ${response.statusText}`);
        return [];
      }
      const commits = await response.json();
      
      // --- CHANGE: 5 ke bajay 30 commits lenge ---
      return commits.slice(0, 30).map(c => ({
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
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json({ websiteCommits, botCommits });

  } catch (error) {
    console.error("Error in /api/commits:", error.message);
    res.status(500).json({ error: 'Failed to fetch commit data.' });
  }
}