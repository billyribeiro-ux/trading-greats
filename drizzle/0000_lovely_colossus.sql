CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`token_hash` text NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	`last_activity_at` text,
	`ip_address` text,
	`user_agent` text,
	`is_revoked` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_sessions_token_unique` ON `admin_sessions` (`token`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text,
	`hero_image` text,
	`hero_image_alt` text,
	`hero_image_caption` text,
	`author` text DEFAULT 'Trading Greats Team',
	`reading_time` integer,
	`category` text,
	`tags` text,
	`seo_title` text,
	`seo_description` text,
	`og_image` text,
	`related_trader_ids` text,
	`related_post_ids` text,
	`status` text DEFAULT 'draft',
	`featured` integer DEFAULT false,
	`published_at` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `ip_blocklist` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text NOT NULL,
	`reason` text NOT NULL,
	`blocked_at` text,
	`expires_at` text,
	`failed_attempts` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ip_blocklist_ip_address_unique` ON `ip_blocklist` (`ip_address`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text NOT NULL,
	`attempted_at` text,
	`successful` integer DEFAULT false,
	`user_agent` text
);
--> statement-breakpoint
CREATE TABLE `security_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`details` text,
	`timestamp` text
);
--> statement-breakpoint
CREATE TABLE `traders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`photo_url` text,
	`one_liner` text,
	`birth_year` integer,
	`death_year` integer,
	`nationality` text,
	`trading_style` text,
	`net_worth` text,
	`bio` text,
	`philosophy` text,
	`achievements` text,
	`famous_trades` text,
	`quotes` text,
	`books` text,
	`social_links` text,
	`status` text DEFAULT 'draft',
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `traders_slug_unique` ON `traders` (`slug`);