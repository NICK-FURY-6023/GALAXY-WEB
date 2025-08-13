# 🚀 GALAXY Bot - Official Website

Welcome to the official source code for the GALAXY Discord Music Bot's website. This project is a modern, responsive, and feature-rich showcase website built with Next.js and Tailwind CSS.

**Live Demo:** [https://galaxy-bot-me.vercel.app/](https://galaxy-bot-me.vercel.app/)

![GALAXY Website Showcase](https://media.discordapp.net/attachments/997575905541107872/1391905133356515490/Screenshot_2025-07-08-03-42-50-509_com.android.chrome-edit.jpg?ex=686d982c&is=686c46ac&hm=081848f6ace8725f595a2d593fac466b10917f35c964e7d43e217a1e158856b1&)

## ✨ Features

This website is packed with modern features to provide an excellent user experience:

* **Futuristic UI/UX:** A sleek, dark-themed (with light mode toggle) design featuring glassmorphism effects and smooth animations.
* **High-Performance Background:** A lightweight, performant 2D canvas-based animated starfield that provides a "galaxy" feel without causing lag.
* **Fully Responsive:** Looks and works great on all devices, from mobile phones to desktops.
* **Live GitHub Updates:** A dedicated section on the homepage that automatically fetches and displays the latest commits from both the Website and Bot's private GitHub repositories, using a secure server-side API.
* **Comprehensive Command Explorer:**
    * Lists all user-facing commands with descriptions and usage examples.
    * Categorized and alphabetically sorted lists.
    * Password-protected section for developer-only commands.
    * Filter commands by category and search by name.
* **Dynamic Components:** Includes interactive components like a "Now Playing" card and live bot statistics.
* **Key Pages:**
    * **Home:** Hero section, bot features, live updates, developer profile.
    * **About:** Detailed information about the bot's story and purpose.
    * **Commands:** The interactive command explorer.
    * **Legal:** Professionally styled Privacy Policy and Terms & Conditions pages.

## 🛠️ Tech Stack

This project is built with a modern, powerful tech stack:

* **Framework:** [Next.js](https://nextjs.org/) (React Framework)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
* **Deployment:** [Vercel](https://vercel.com/)
* **Backend API:** Next.js API Routes (for fetching GitHub commits)

## 📂 Project Structure

```
.
├── components/
│   ├── commands/
│   ├── layout/
│   └── ui/
├── data/
│   └── (changelog.json if you use it)
├── pages/
│   ├── api/
│   │   └── commits.js
│   ├── _app.js
│   ├── _document.js
│   └── (other pages: index.js, about.js, etc.)
├── public/
│   └── (images and favicon)
├── styles/
│   └── globals.css
├── .env.local.example
├── package.json
└── tailwind.config.js
```

## ⚙️ Setup and Installation (For Local Development)

To run this project on your local machine, follow these steps:

**1. Clone the repository:**
```bash
git clone [https://github.com/NICK-FURY-6023/GALAXY-WEBD.git](https://github.com/NICK-FURY-6023/GALAXY-WEBD.git)
cd GALAXY-WEBD
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up Environment Variables:**
   * Create a new file in the root of your project named `.env.local`.
   * Open the file and add your GitHub Personal Access Token (PAT). This is required to fetch commits from your private repositories.

   ```
   GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
   ```
   **Note:** The `.env.local` file is listed in `.gitignore` and should never be committed to your repository.

**4. Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Environment Variables

This project requires the following environment variables to function correctly:

* `GITHUB_PAT`: A GitHub Personal Access Token with `repo` scope is required to fetch commit history from your private repositories.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/NICK-FURY-6023/GALAXY-WEBD/issues) on the repository.

---
**Developed by NICK FURY.**
