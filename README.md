# CSpirantS

![CSpirantS](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444.svg)
![Fastify](https://img.shields.io/badge/Fastify-API-20232A.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791.svg)

**CSpirantS** (formerly CSS/PMS Exam Platform) is a comprehensive, highly scalable monorepo application designed to help aspirants prepare for the CSS (Central Superior Services) and PMS (Provincial Management Service) exams. 

It leverages advanced scraping capabilities, Large Language Models (LLMs), and background task processing to aggregate, analyze, and present relevant current affairs and preparatory materials.

---

## 🏗 Architecture

The project is structured as a **Turborepo Monorepo**, ensuring efficient builds, high modularity, and shared code across applications and packages.

### Technologies
- **API**: Fastify (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Queue/Workers**: BullMQ & Redis for robust background job processing
- **AI/LLM Core**: Integration with Google Gemini, Grok, and manual fallback mechanisms
- **Scraping Core**: Automated data aggregation tools (e.g., Dawn News articles)
- **Language**: Strictly typed with TypeScript

## 📦 Project Structure

```text
CSpirantS/
├── apps/
│   └── api/                # Fastify REST API and BullMQ worker pipelines
├── packages/
│   ├── db/                 # Prisma schema, migrations, and database client
│   ├── llm-core/           # AI provider integrations (Gemini, Grok) and prompt management
│   ├── scraper-core/       # Scraping logic for news and exam resources
│   ├── types/              # Shared TypeScript definitions and interfaces
│   └── ts-config/          # Shared TypeScript configurations
├── Helpers/                # Internal task trackers, plans, and architectural blueprints
└── turbo.json              # Turborepo configuration
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9.0.0+)
- [Docker & Docker Compose](https://www.docker.com/) (for Redis & PostgreSQL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd CSpirantS
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` in the root and configure your database, Redis, and LLM API keys.
   ```bash
   cp .env.example .env
   ```

4. **Start local services (DB & Redis):**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations:**
   ```bash
   pnpm --filter @repo/db run db:push
   # or prisma migrate dev
   ```

### Running the Application

To start the development server for all apps and packages:
```bash
pnpm dev
```

To build for production:
```bash
pnpm build
```

## 🧠 Core Features

- **Automated Article Scraping**: Aggregates editorials, opinions, and current affairs essential for competitive exams.
- **AI-Powered Evaluation**: Analyzes and summarizes content using dynamically configured LLMs (Gemini as primary, Grok as fallback).
- **Resilient Pipelines**: Uses Redis-backed BullMQ for processing high-volume tasks like scraping and AI evaluation without blocking the main API thread.
- **RESTful API Delivery**: Fastify endpoints structured to serve parsed and evaluated content efficiently to the frontend clients.

## 🛠 Development Commands

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint across the workspace
- `pnpm typecheck` - Run TypeScript compiler checks

## 📄 License

This project is proprietary and confidential. Unauthorized copying of files, via any medium, is strictly prohibited.
