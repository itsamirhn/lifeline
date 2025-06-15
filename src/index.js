/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { v4 as uuidv4 } from 'uuid';

// List of adjectives and nouns for generating usernames
const adjectives = ['happy', 'brave', 'clever', 'swift', 'bright', 'calm', 'eager', 'fierce', 'gentle', 'kind'];
const nouns = ['panda', 'tiger', 'eagle', 'dolphin', 'wolf', 'fox', 'bear', 'lion', 'hawk', 'deer'];

function generateUsername() {
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
}

function generateRssToken() {
	return uuidv4();
}

async function handleHomePage() {
	const html = `
		<!DOCTYPE html>
		<html>
			<head>
				<title>Lifeline - Create Your Timeline</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					* { box-sizing: border-box; }
					body { 
						font-family: system-ui, -apple-system, sans-serif; 
						max-width: 800px; 
						margin: 0 auto; 
						padding: 20px; 
						line-height: 1.6;
					}
					.container { text-align: center; width: 100%; }
					button { 
						padding: 12px 24px; 
						font-size: 16px; 
						cursor: pointer; 
						background: #0070f3; 
						color: white; 
						border: none; 
						border-radius: 5px;
						transition: background-color 0.2s;
						min-width: 200px;
					}
					button:hover { background: #0051a2; }
					h1 { margin-bottom: 10px; }
					p { margin-bottom: 30px; color: #666; }
					
					/* Mobile styles */
					@media (max-width: 768px) {
						body { padding: 15px; }
						h1 { font-size: 24px; }
						button { 
							width: 100%; 
							min-width: unset;
							padding: 14px 20px;
						}
					}
					
					/* Small mobile styles */
					@media (max-width: 480px) {
						body { padding: 10px; }
						h1 { font-size: 20px; }
						button { font-size: 14px; }
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Welcome to Lifeline</h1>
					<p>Create your personal timeline and share it with friends via RSS.</p>
					<button onclick="createTimeline()">Create My Timeline</button>
				</div>
				<script>
					async function createTimeline() {
						const response = await fetch('/create', { method: 'POST' });
						const data = await response.json();
						window.location.href = '/' + data.uuid;
					}
				</script>
			</body>
		</html>
	`;
	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

async function handleTimelinePage(uuid, env) {
	const user = await env.DB.prepare('SELECT * FROM users WHERE uuid = ?').bind(uuid).first();
	if (!user) return new Response('Not Found', { status: 404 });

	const posts = await env.DB.prepare('SELECT * FROM posts WHERE user_uuid = ? ORDER BY created_at DESC').bind(uuid).all();

	const html = `
		<!DOCTYPE html>
		<html>
			<head>
				<title>${user.username}'s Timeline</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					* { box-sizing: border-box; }
					body { 
						font-family: system-ui, -apple-system, sans-serif; 
						max-width: 800px; 
						margin: 0 auto; 
						padding: 20px; 
						line-height: 1.6;
					}
					.container { text-align: center; width: 100%; }
					.post-form { margin: 20px 0; width: 100%; }
					textarea { 
						width: 100%; 
						height: 100px; 
						margin: 10px 0; 
						padding: 12px; 
						border: 1px solid #ddd;
						border-radius: 5px;
						font-family: inherit;
						resize: vertical;
						font-size: 16px;
					}
					button { 
						padding: 12px 20px; 
						font-size: 16px; 
						cursor: pointer; 
						border: none; 
						border-radius: 5px; 
						margin: 5px;
						transition: background-color 0.2s;
						min-width: 140px;
					}
					.blue-button { background: #0070f3; color: white; }
					.blue-button:hover { background: #0051a2; }
					.yellow-button { background: #f3d700; color: black; }
					.yellow-button:hover { background: #d4bc00; }
					.red-button { background: #ff4444; color: white; }
					.red-button:hover { background: #cc0000; }
					.button-group { 
						display: flex; 
						justify-content: center; 
						align-items: center; 
						margin: 20px 0;
						flex-wrap: wrap;
						gap: 10px;
					}
					.posts { text-align: left; margin-top: 30px; width: 100%; }
					.post { 
						border: 1px solid #eee; 
						padding: 15px; 
						margin: 15px 0; 
						border-radius: 8px;
						background: #fafafa;
						word-wrap: break-word;
						overflow-wrap: break-word;
					}
					h1 { margin-bottom: 10px; }
					
					/* Mobile styles */
					@media (max-width: 768px) {
						body { padding: 15px; }
						h1 { font-size: 24px; }
						.button-group { 
							flex-direction: column; 
							width: 100%; 
						}
						button { 
							width: 100%; 
							margin: 5px 0;
							min-width: unset;
						}
						textarea { 
							height: 80px; 
							font-size: 16px; /* Prevents zoom on iOS */
						}
						.post { padding: 12px; margin: 10px 0; }
					}
					
					/* Small mobile styles */
					@media (max-width: 480px) {
						body { padding: 10px; }
						h1 { font-size: 20px; }
						button { padding: 10px 16px; font-size: 14px; }
						textarea { padding: 10px; }
						.post { padding: 10px; }
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>${user.username}'s Timeline</h1>
					<div class="post-form">
						<textarea id="content" maxlength="255" placeholder="What's happening? (max 255 characters)"></textarea>
						<div class="button-group">
							<button class="blue-button" onclick="postUpdate()">Post Update</button>
							<button class="yellow-button" onclick="copyRssUrl()">Copy RSS Feed URL</button>
							<button class="red-button" onclick="regenerateRss()">Regenerate RSS URL</button>
						</div>
					</div>
				</div>
				<script>
					async function postUpdate() {
						const content = document.getElementById('content').value;
						if (!content) return;
						
						await fetch('/${uuid}/post', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ content })
						});
						
						window.location.reload();
					}
					
					async function regenerateRss() {
						if (!confirm('Warning: Regenerating your RSS URL will invalidate your previous RSS feed. Anyone following your previous feed will no longer receive updates. You will need to share your new RSS URL with your followers. Are you sure you want to continue?')) {
							return;
						}
						await fetch('/${uuid}/regenerate-rss', { method: 'POST' });
						window.location.reload();
					}

					function copyRssUrl() {
						const rssUrl = window.location.origin + '/feed/${user.rss_token}';
						navigator.clipboard.writeText(rssUrl).then(() => {
							alert('RSS Feed URL copied to clipboard!');
						}).catch(err => {
							console.error('Failed to copy URL:', err);
						});
					}
				</script>
			</body>
		</html>
	`;
	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}

async function handleRssFeed(token, env) {
	const user = await env.DB.prepare('SELECT * FROM users WHERE rss_token = ?').bind(token).first();
	if (!user) return new Response('Not Found', { status: 404 });

	const posts = await env.DB.prepare('SELECT * FROM posts WHERE user_uuid = ? ORDER BY created_at DESC').bind(user.uuid).all();

	const rss = `<?xml version="1.0" encoding="UTF-8" ?>
		<rss version="2.0">
			<channel>
				<title>${user.username}'s Timeline Updates</title>
				<description>Personal timeline updates from ${user.username}</description>
				<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
				${posts.results.map(post => `
					<item>
						<description>${post.content}</description>
						<pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
					</item>
				`).join('')}
			</channel>
		</rss>`;

	return new Response(rss, {
		headers: { 'Content-Type': 'application/xml' },
	});
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;

		// Home page
		if (path === '/') {
			return handleHomePage();
		}

		// Create new timeline
		if (path === '/create' && request.method === 'POST') {
			const uuid = uuidv4();
			const username = generateUsername();
			const rssToken = generateRssToken();
			await env.DB.prepare('INSERT INTO users (uuid, username, rss_token) VALUES (?, ?, ?)').bind(uuid, username, rssToken).run();
			return new Response(JSON.stringify({ uuid }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Timeline page
		if (path.match(/^\/[0-9a-f-]+\/?$/)) {
			const uuid = path.split('/')[1];
			return handleTimelinePage(uuid, env);
		}

		// RSS feed
		if (path.match(/^\/feed\/[0-9a-f-]+$/)) {
			const token = path.split('/')[2];
			return handleRssFeed(token, env);
		}

		// Post new update
		if (path.match(/^\/[0-9a-f-]+\/post$/) && request.method === 'POST') {
			const uuid = path.split('/')[1];
			const { content } = await request.json();

			if (!content || content.length > 255) {
				return new Response('Invalid content', { status: 400 });
			}

			await env.DB.prepare('INSERT INTO posts (user_uuid, content) VALUES (?, ?)').bind(uuid, content).run();
			return new Response('OK', { status: 200 });
		}

		// Regenerate RSS token
		if (path.match(/^\/[0-9a-f-]+\/regenerate-rss$/) && request.method === 'POST') {
			const uuid = path.split('/')[1];
			const newToken = generateRssToken();
			await env.DB.prepare('UPDATE users SET rss_token = ? WHERE uuid = ?').bind(newToken, uuid).run();
			return new Response('OK', { status: 200 });
		}

		return new Response('Not Found', { status: 404 });
	},
};
