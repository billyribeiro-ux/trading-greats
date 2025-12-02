import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
