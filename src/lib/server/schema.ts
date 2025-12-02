import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ============================================================================
// TRADERS TABLE
// ============================================================================

export const traders = sqliteTable('traders', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	photoUrl: text('photo_url'),
	oneLiner: text('one_liner'),
	birthYear: integer('birth_year'),
	deathYear: integer('death_year'),
	nationality: text('nationality'),
	tradingStyle: text('trading_style'),
	netWorth: text('net_worth'),
	bio: text('bio'),
	philosophy: text('philosophy'),
	achievements: text('achievements', { mode: 'json' }).$type<string[]>(),
	famousTrades: text('famous_trades', { mode: 'json' }).$type<FamousTrade[]>(),
	quotes: text('quotes', { mode: 'json' }).$type<Quote[]>(),
	books: text('books', { mode: 'json' }).$type<Book[]>(),
	socialLinks: text('social_links', { mode: 'json' }).$type<SocialLink[]>(),
	status: text('status').$type<'draft' | 'published'>().default('draft'),
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString())
});

export type Trader = typeof traders.$inferSelect;
export type NewTrader = typeof traders.$inferInsert;

export interface FamousTrade {
	date: string;
	asset: string;
	position: 'long' | 'short';
	outcome: string;
	profitLoss: string;
	description: string;
}

export interface Quote {
	text: string;
	source?: string;
}

export interface Book {
	title: string;
	year?: number;
	description?: string;
}

export interface SocialLink {
	platform: string;
	url: string;
}

// ============================================================================
// BLOG POSTS TABLE
// ============================================================================

export const blogPosts = sqliteTable('blog_posts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

	// Core content
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	excerpt: text('excerpt'),
	content: text('content'), // Markdown content

	// Media
	heroImage: text('hero_image'),
	heroImageAlt: text('hero_image_alt'),
	heroImageCaption: text('hero_image_caption'),

	// Metadata
	author: text('author').default('Trading Greats Team'),
	readingTime: integer('reading_time'), // in minutes

	// Categorization
	category: text('category').$type<BlogCategory>(),
	tags: text('tags', { mode: 'json' }).$type<string[]>(),

	// SEO
	seoTitle: text('seo_title'),
	seoDescription: text('seo_description'),
	ogImage: text('og_image'),

	// Related content
	relatedTraderIds: text('related_trader_ids', { mode: 'json' }).$type<string[]>(),
	relatedPostIds: text('related_post_ids', { mode: 'json' }).$type<string[]>(),

	// Publishing
	status: text('status').$type<'draft' | 'published' | 'archived'>().default('draft'),
	featured: integer('featured', { mode: 'boolean' }).default(false),
	publishedAt: text('published_at'),

	// Timestamps
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString())
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type BlogCategory =
	| 'strategy'
	| 'psychology'
	| 'analysis'
	| 'biography'
	| 'education'
	| 'market-insights'
	| 'book-review';

export const BLOG_CATEGORIES: { value: BlogCategory; label: string; description: string }[] = [
	{ value: 'strategy', label: 'Trading Strategy', description: 'Deep dives into specific trading methodologies' },
	{ value: 'psychology', label: 'Trading Psychology', description: 'Mental frameworks and mindset for success' },
	{ value: 'analysis', label: 'Market Analysis', description: 'Analysis of markets and market movements' },
	{ value: 'biography', label: 'Trader Profiles', description: 'In-depth profiles of legendary traders' },
	{ value: 'education', label: 'Education', description: 'Educational content for traders at all levels' },
	{ value: 'market-insights', label: 'Market Insights', description: 'Timely insights on market conditions' },
	{ value: 'book-review', label: 'Book Reviews', description: 'Reviews of trading and investing books' }
];

// ============================================================================
// ADMIN SESSIONS TABLE (Enhanced Security)
// ============================================================================

export const adminSessions = sqliteTable('admin_sessions', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	token: text('token').notNull().unique(),
	tokenHash: text('token_hash').notNull(), // SHA-256 hash of token for secure lookup
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	expiresAt: text('expires_at').notNull(),
	lastActivityAt: text('last_activity_at').$defaultFn(() => new Date().toISOString()),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	isRevoked: integer('is_revoked', { mode: 'boolean' }).default(false)
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;

// ============================================================================
// LOGIN ATTEMPTS TABLE (Rate Limiting & Brute Force Protection)
// ============================================================================

export const loginAttempts = sqliteTable('login_attempts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	ipAddress: text('ip_address').notNull(),
	attemptedAt: text('attempted_at').$defaultFn(() => new Date().toISOString()),
	successful: integer('successful', { mode: 'boolean' }).default(false),
	userAgent: text('user_agent')
});

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type NewLoginAttempt = typeof loginAttempts.$inferInsert;

// ============================================================================
// IP BLOCKLIST TABLE (Auto-block malicious IPs)
// ============================================================================

export const ipBlocklist = sqliteTable('ip_blocklist', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	ipAddress: text('ip_address').notNull().unique(),
	reason: text('reason').notNull(),
	blockedAt: text('blocked_at').$defaultFn(() => new Date().toISOString()),
	expiresAt: text('expires_at'), // null = permanent
	failedAttempts: integer('failed_attempts').default(0)
});

export type IpBlock = typeof ipBlocklist.$inferSelect;
export type NewIpBlock = typeof ipBlocklist.$inferInsert;

// ============================================================================
// SECURITY AUDIT LOG TABLE
// ============================================================================

export const securityAuditLog = sqliteTable('security_audit_log', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	action: text('action').notNull(), // login, logout, failed_login, session_revoked, etc.
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	details: text('details', { mode: 'json' }).$type<Record<string, unknown>>(),
	timestamp: text('timestamp').$defaultFn(() => new Date().toISOString())
});

export type SecurityAuditLog = typeof securityAuditLog.$inferSelect;
export type NewSecurityAuditLog = typeof securityAuditLog.$inferInsert;
