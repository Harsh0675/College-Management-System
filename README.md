# College Management System

A modern **React + TypeScript** college management interface built with Vite. The project combines a component-based frontend with an interactive academic-management experience and optional AI capabilities through the Google GenAI SDK.

## ✨ Highlights

- College-focused management dashboard
- React 19 component architecture
- TypeScript development workflow
- Vite-powered development and production builds
- Tailwind CSS integration
- Lucide icon system
- Motion-based interface interactions
- Canvas-based visual effects
- Optional Google GenAI integration
- GitHub Pages deployment support via `gh-pages`

## 🧱 Application Stack

```text
React + TypeScript UI
        ↓
Reusable components / client state
        ↓
Vite build pipeline
        ↓
Static production bundle
        ↓
GitHub Pages or other static hosting
```

The repository is primarily a frontend application. Any server-side or secret-dependent integration should be configured separately rather than exposing credentials in browser code.

## 🛠️ Technology Stack

| Technology | Purpose |
| --- | --- |
| React 19 | UI and component architecture |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Utility-first styling |
| Lucide React | Interface icons |
| Motion | UI animations |
| Canvas Confetti | Celebration effects |
| Google GenAI SDK | AI integration capability |
| gh-pages | GitHub Pages deployment |

## 🚀 Getting Started

### Requirements

- Node.js
- npm
- A modern browser

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The Vite development server is configured to use port **3000**.

### Create a production build

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

### Type-check the project

```bash
npm run lint
```

## 🌐 Deploy to GitHub Pages

The project includes `gh-pages` deployment scripts:

```bash
npm run build
npm run deploy
```

The deployment command publishes the generated `dist` directory.

## 📁 Project Structure

```text
College-Management-System/
├── src/                 # React/TypeScript application source
├── public/              # Static assets
├── index.html           # Vite application entry document
├── package.json         # Scripts and dependencies
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment configuration template
└── README.md            # Project documentation
```

## 🔐 Configuration & security

The repository contains an `.env.example` template for environment-specific configuration. Do not commit real API keys or other secrets. Browser-exposed variables should never be treated as private credentials.

## 🎯 Portfolio value

This project demonstrates practical frontend engineering with a modern React stack, TypeScript, responsive UI tooling, animation, build automation, and static deployment workflows. It is also a useful foundation for expanding college operations into richer modules and data-backed services.

## 📄 License

See the repository for the applicable license information.

## 👤 Author

**Harsh0675** — https://github.com/Harsh0675
