# 📝 Lifeline

During times of crisis, staying connected with loved ones becomes crucial. Lifeline was created to provide a simple, reliable way to broadcast your status and updates when direct communication might be challenging.

## Example Scenario

Imagine you're in a situation where:

- You want to let your friends and family know you're safe
- You don't have time or energy for individual messages
- You need a reliable way to broadcast updates
- You want to maintain complete anonymity while keeping people informed

With Lifeline, you can:

1. Create your personal timeline (no authentication required)
2. Share the RSS feed link with your trusted circle
3. Post quick updates like "I'm safe" or "Moving to a new location"
4. Your loved ones can subscribe to your feed and get instant notifications

No need for complex messaging or social media. Just simple, reliable status updates that reach everyone who needs to know. Your identity remains completely private - no one knows who you are or who's following your updates.

---

A personal timeline feed application built with Cloudflare Workers that lets you create and share your life updates via RSS. Share your moments, thoughts, and updates in a simple, chronological feed that others can subscribe to.

## Features

- Create a personal timeline with unique identifiers (fully anonymous)
- Post short messages (up to 255 characters)
- Generate and manage RSS feeds for your updates
- Clean and minimal interface
- No authentication required - complete privacy
- No tracking of followers or subscribers

## Quick Start

1. Install dependencies:

```bash
yarn install
```

2. Set up Cloudflare:

```bash
wrangler login
wrangler d1 create lifeline-db
```

3. Update `wrangler.jsonc` with your database ID

4. Deploy:

```bash
yarn deploy
```

## Development

Run locally:

```bash
yarn dev
```

Visit `http://localhost:8787` to test the application.

## Deployment

Deploy to Cloudflare:

```bash
yarn deploy
```

Your timeline will be available at your Cloudflare Workers domain.
