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

// ============================================================================
// NEWSLETTER SUBSCRIBERS TABLE
// ============================================================================

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: text('email').notNull().unique(),

	// Status management
	status: text('status').$type<SubscriberStatus>().default('pending'),

	// Verification
	verificationToken: text('verification_token'),
	verifiedAt: text('verified_at'),

	// Unsubscribe
	unsubscribeToken: text('unsubscribe_token').$defaultFn(() => crypto.randomUUID()),
	unsubscribedAt: text('unsubscribed_at'),
	unsubscribeReason: text('unsubscribe_reason'),

	// Preferences
	preferences: text('preferences', { mode: 'json' }).$type<SubscriberPreferences>(),

	// Source tracking
	source: text('source'), // blog, homepage, footer, etc.
	referrer: text('referrer'), // URL they came from

	// Engagement metrics
	totalEmailsSent: integer('total_emails_sent').default(0),
	totalOpens: integer('total_opens').default(0),
	totalClicks: integer('total_clicks').default(0),
	lastOpenedAt: text('last_opened_at'),
	lastClickedAt: text('last_clicked_at'),

	// Metadata
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),

	// Timestamps
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString())
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export type SubscriberStatus = 'pending' | 'verified' | 'unsubscribed' | 'bounced' | 'complained';

export interface SubscriberPreferences {
	weeklyDigest: boolean;
	newTraderAlerts: boolean;
	blogPostAlerts: boolean;
	marketInsights: boolean;
}

export const DEFAULT_SUBSCRIBER_PREFERENCES: SubscriberPreferences = {
	weeklyDigest: true,
	newTraderAlerts: true,
	blogPostAlerts: true,
	marketInsights: false
};

// ============================================================================
// NEWSLETTER CAMPAIGNS TABLE
// ============================================================================

export const newsletterCampaigns = sqliteTable('newsletter_campaigns', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

	// Content
	subject: text('subject').notNull(),
	previewText: text('preview_text'),
	content: text('content').notNull(), // HTML content
	contentText: text('content_text'), // Plain text version

	// Campaign type
	type: text('type').$type<CampaignType>().default('manual'),

	// Status
	status: text('status').$type<CampaignStatus>().default('draft'),

	// Scheduling
	scheduledFor: text('scheduled_for'),
	sentAt: text('sent_at'),
	completedAt: text('completed_at'),

	// Targeting
	targetPreferences: text('target_preferences', { mode: 'json' }).$type<Partial<SubscriberPreferences>>(),

	// Stats (updated in real-time)
	totalRecipients: integer('total_recipients').default(0),
	totalSent: integer('total_sent').default(0),
	totalDelivered: integer('total_delivered').default(0),
	totalOpens: integer('total_opens').default(0),
	uniqueOpens: integer('unique_opens').default(0),
	totalClicks: integer('total_clicks').default(0),
	uniqueClicks: integer('unique_clicks').default(0),
	totalUnsubscribes: integer('total_unsubscribes').default(0),
	totalBounces: integer('total_bounces').default(0),
	totalComplaints: integer('total_complaints').default(0),

	// Timestamps
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
	updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString())
});

export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
export type NewNewsletterCampaign = typeof newsletterCampaigns.$inferInsert;

export type CampaignType = 'manual' | 'weekly_digest' | 'new_trader' | 'blog_post';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

// ============================================================================
// NEWSLETTER EVENTS TABLE (Tracking opens, clicks, etc.)
// ============================================================================

export const newsletterEvents = sqliteTable('newsletter_events', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

	// Foreign keys
	subscriberId: text('subscriber_id').notNull(),
	campaignId: text('campaign_id').notNull(),

	// Event type
	eventType: text('event_type').$type<NewsletterEventType>().notNull(),

	// Event details
	linkUrl: text('link_url'), // For click events
	linkText: text('link_text'), // For click events

	// Metadata
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	country: text('country'),
	city: text('city'),
	device: text('device'), // mobile, desktop, tablet
	emailClient: text('email_client'), // gmail, outlook, apple mail, etc.

	// Timestamp
	timestamp: text('timestamp').$defaultFn(() => new Date().toISOString())
});

export type NewsletterEvent = typeof newsletterEvents.$inferSelect;
export type NewNewsletterEvent = typeof newsletterEvents.$inferInsert;

export type NewsletterEventType =
	| 'sent'
	| 'delivered'
	| 'opened'
	| 'clicked'
	| 'unsubscribed'
	| 'bounced'
	| 'complained';

// ============================================================================
// NEWSLETTER SEND LOG TABLE (Individual email tracking)
// ============================================================================

export const newsletterSendLog = sqliteTable('newsletter_send_log', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),

	// Foreign keys
	subscriberId: text('subscriber_id').notNull(),
	campaignId: text('campaign_id').notNull(),

	// Email provider tracking
	providerMessageId: text('provider_message_id'), // Resend message ID

	// Status
	status: text('status').$type<SendStatus>().default('pending'),

	// Tracking flags (for unique counts)
	hasOpened: integer('has_opened', { mode: 'boolean' }).default(false),
	hasClicked: integer('has_clicked', { mode: 'boolean' }).default(false),

	// Error tracking
	errorMessage: text('error_message'),
	errorCode: text('error_code'),

	// Timestamps
	sentAt: text('sent_at'),
	deliveredAt: text('delivered_at'),
	openedAt: text('opened_at'),
	clickedAt: text('clicked_at'),
	createdAt: text('created_at').$defaultFn(() => new Date().toISOString())
});

export type NewsletterSendLog = typeof newsletterSendLog.$inferSelect;
export type NewNewsletterSendLog = typeof newsletterSendLog.$inferInsert;

export type SendStatus = 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
