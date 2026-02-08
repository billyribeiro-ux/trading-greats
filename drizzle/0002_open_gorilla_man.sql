ALTER TABLE `blog_posts` ADD `trader_id` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `trader_slug` text;--> statement-breakpoint
ALTER TABLE `media` ADD `trader_id` text;--> statement-breakpoint
ALTER TABLE `media` ADD `display_order` integer DEFAULT 0;