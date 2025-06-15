# Lifeline

A simple Cloudflare Worker application that allows users to create a personal timeline feed that can be shared via RSS.

## Features

- Generate unique user identifiers with random meaningful names
- Post short messages (up to 255 characters)
- Generate and manage RSS feeds for timeline updates
- Minimal and clean interface

## Setup

1. Install Wrangler CLI:

```bash
yarn global add wrangler
```

2. Login to Cloudflare:

```bash
wrangler login
```

3. Create a D1 database:

```bash
wrangler d1 create lifeline-db
```

4. Update the `wrangler.toml` file with your database ID

5. Initialize the database schema:

```bash
wrangler d1 execute lifeline-db --file=./schema.sql
```

6. Deploy the worker:

```bash
yarn deploy
```

## Database Schema

The application uses Cloudflare D1 with the following schema:

```sql
CREATE TABLE users (
    uuid TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_uuid TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);

CREATE TABLE rss_tokens (
    user_uuid TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid)
);
```

## Development

1. Start the development server:

```bash
yarn dev
```

2. Test the application locally at `http://localhost:8787`

## Deployment

To deploy the worker to Cloudflare:

1. Make sure you have the correct database ID in `wrangler.toml`
2. Run:

```bash
yarn deploy
```

The worker will be available at your Cloudflare Workers domain.
