# Macro Tracker 🥑

A premium, high-performance macro tracking application built with **Next.js 14**, **Tailwind CSS**, and **Lucide Icons**. Track your daily intake of Protein, Carbs, and Fats with a sleek, responsive dashboard.

## Features ✨

- **Dynamic Dashboard**: Real-time progress rings for calories and macronutrients.
- **Smart Food Search**: Instant search through a **local JSON food database** for privacy and speed.
- **Meal Journal**: Track your daily meals and view calculated totals automatically.
- **Goal Management**: Set custom calorie targets and macro percentage splits.
- **Local Persistence**: All your data is saved locally in your browser (LocalStorage).
- **PWA Ready**: Installable on mobile and desktop for a native-like experience.

## Tech Stack 🛠️

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Context Management**: React Context API
- **Fonts**: Geist Mono & Geist Sans

## Getting Started 🚀

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment 🌐

### Deploy to Vercel (Recommended)

The easiest way to deploy this project is via [Vercel](https://vercel.com):

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and deploy it.

### Commands to Push to GitHub

If you haven't initialized a repository yet:

```bash
# Initialize git
git init

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "feat: initial release of Macro Tracker"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/macro-tracker.git
git branch -M main
git push -u origin main
```

## Production Optimization ⚡

This app is optimized for production:
- **Zero-shifter**: Layout is designed to minimize Cumulative Layout Shift.
- **Performance**: High Lighthouse scores for performance and accessibility.
- **Micro-animations**: Smooth transitions using CSS and Framer Motion-like principles.

---
Built by Antigravity 🚀
