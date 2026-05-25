import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { traders as tradersTable } from '../src/lib/server/schema';
import { seedTraders } from '../src/lib/server/seed';
import { eq } from 'drizzle-orm';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client);

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: pnpm db:update-trader <slug>');
	process.exit(1);
}

const trader = seedTraders.find(t => t.slug === slug);
if (!trader) {
	console.error(`No seed entry found for slug: ${slug}`);
	process.exit(1);
}

await db
	.update(tradersTable)
	.set({
		name: trader.name,
		photoUrl: trader.photoUrl,
		oneLiner: trader.oneLiner,
		birthYear: trader.birthYear,
		deathYear: trader.deathYear,
		nationality: trader.nationality,
		tradingStyle: trader.tradingStyle,
		netWorth: trader.netWorth,
		bio: trader.bio,
		philosophy: trader.philosophy,
		achievements: trader.achievements,
		famousTrades: trader.famousTrades as any,
		quotes: trader.quotes as any,
		books: trader.books as any,
		socialLinks: trader.socialLinks as any,
		status: trader.status,
		updatedAt: new Date().toISOString()
	})
	.where(eq(tradersTable.slug, slug));

console.log(`✅ Updated trader: ${trader.name}`);
process.exit(0);
