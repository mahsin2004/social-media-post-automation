## 1ClikPost

# 1ClikPost is a platform that connects all your social media accounts so you can generate and publish content across multiple platforms with a single click — without opening each social media site.
Start exploring the app at src/app/page.tsx.

Table of contents

What is 1ClikPost

Features

Tech stack

Getting started (local development)

Environment variables

How to use

Deployment

Testing

Security & privacy notes

Contributing

Troubleshooting

License

Contact

What is 1ClikPost

1ClikPost helps creators, marketers, and teams manage multi-platform social publishing by:

Connecting multiple social media accounts (Twitter/X, Facebook, Instagram, LinkedIn, TikTok, etc.)

Generating multi-format social copy (short posts, image captions, threads, link posts) with one action

Publishing to all or a selected subset of connected platforms with a single click

Features

Connect and manage multiple social accounts in one place (via OAuth integrations)

One-click multi-platform content generation (supporting platform-specific formats)

One-click cross-posting: publish the generated content to selected platforms at once

Account-level settings and platform-specific overrides (length, hashtags, mentions)

Scheduled posting (optional setup)

Basic analytics/confirmation of publishing status (success / failure / rate limit)

Tech stack (suggested / typical)

Adjust to your actual stack if different.

Frontend: Next.js (app router) — src/app/page.tsx is the entry page

Styling: Tailwind CSS (optional)

Backend: Node.js / Next.js API routes or separate Express / Fastify service

Auth: OAuth2 for social platforms (platform SDKs)

Database: PostgreSQL / MongoDB for storing accounts, tokens, posts

Worker / Scheduler: BullMQ / Agenda (for queued/scheduled posts)

Optional: OpenAI or other generation API for content generation

Getting started (local development)

Prerequisites:

Node.js 18+ (or your project's required version)

npm or yarn

A database (Postgres / MongoDB) or local dev DB like SQLite if configured

OAuth app credentials for social platforms you want to test (see Environment variables)

Steps:

Clone the repo

git clone <repo-url>
cd 1clikpost


Install dependencies

npm install
# or
yarn


Create .env.local (example variables below)

Run development server

npm run dev
# or
yarn dev


Open http://localhost:3000 and start at src/app/page.tsx.

Environment variables

Add a .env.local file at the project root. Example .env.local values (adapt to your app):

# App
NEXT_PUBLIC_APP_NAME=1ClikPost
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/1clikpost

# Social OAuth (example keys — get these from each platform)
OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACE_API_KEY=hf_xxxYourHuggingFaceApiKeyxxx
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:9002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/api/auth/callback/facebook

# Instagram OAuth Configuration (via Facebook)
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:5000/api/auth/callback/instagram

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/callback/linkedin

# Twitter OAuth Configuration
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=http://localhost:5000/api/auth/callback/twitter

# Content generation (optional)
OPENAI_API_KEY=...

# JWT/Session secret
NEXTAUTH_SECRET=some-long-random-string


Important: Never commit .env.local into version control.

How to use

Connect accounts

Go to Accounts → Connect (or equivalent page in the UI).

Authenticate each social account via the OAuth flow.

Generate content

Use the content generator UI (prompt box / templates).

Choose the tone, platform types (e.g., tweet, Instagram caption, LinkedIn article snippet) and generate.

Preview and edit

Platform-specific previews will show length constraints, captions, and suggested hashtags.

Edit any platform copy independently if you want platform-specific customization.

Publish

Select platforms to publish to and click Publish (one click will push to all selected platforms).

You should see publish status for each platform (Success / Failed / Rate-limited).

Schedule posts (if enabled)

Choose a date/time and create a scheduled post. A worker will send posts at the scheduled time.

Deployment

Typical steps:

Build:

npm run build
npm run start


Environment:

Provide the production-equivalent environment variables.

Providers:

Vercel / Netlify / Render for Next.js frontends

Managed Postgres or MongoDB Atlas for DB

Background worker host (Heroku worker, separate container, or serverless functions)

Ensure OAuth redirect URLs are properly configured with each social provider to match your production origin.

Testing

Unit tests: npm run test (configure Jest / Vitest)

E2E: Playwright / Cypress for flows (connect account, generate, publish)

Run linter & formatter: npm run lint / npm run format

Security & privacy notes

Store OAuth tokens encrypted at rest and rotate tokens/refresh tokens securely.

Use HTTPS in production for all OAuth and API endpoints.

Respect platform terms of service for automated posting and API usage.

Do not log sensitive tokens or secrets.

Implement rate limit handling for each platform and surface meaningful errors to users.

Contributing

Thanks for wanting to contribute!
Suggested workflow:

Fork the repository

Create a feature branch: git checkout -b feat/your-feature

Make changes and add tests

Submit a pull request describing what you changed and why

Please follow common practices: write clear commit messages, keep PRs focused, and add tests for new behaviors.

Troubleshooting

OAuth redirect mismatches: ensure redirect URLs registered with the provider exactly match your app URL.

Post fails with rate limit: inspect platform error messages — implement exponential backoff and retry logic.

Tokens expired: ensure refresh-token logic is implemented and tested.

Local DB connection errors: check DATABASE_URL and whether the DB is running.

Example API endpoints (suggested)

Adapt these to your actual routes.

POST /api/generate — Generate multi-platform content from a prompt
Body: { prompt: "...", platforms: ["twitter","instagram"] }

POST /api/publish — Publish content to selected platforms
Body: { contentId: "abc123", platforms: ["twitter","facebook"] }

GET /api/accounts — List connected accounts

POST /api/accounts/connect/:platform — Start OAuth flow for platform

Roadmap (ideas)

Improved analytics per post and platform performance

Media uploads and platform-specific image sizing

Team workflows & role-based access

Bulk import/export of scheduled posts

Multimedia content generation (images/video captions)

License

This project is available under the MIT License — adapt as needed.

Contact

If you need help or want to contribute:

Open an issue in the repo

Create a PR with proposed changes