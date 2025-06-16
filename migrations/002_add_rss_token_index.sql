-- Add unique index on rss_token
CREATE UNIQUE INDEX idx_users_rss_token ON users(rss_token); 