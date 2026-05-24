import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { traders as tradersTable } from '../src/lib/server/schema';
import { seedTraders } from '../src/lib/server/seed';
import { seedBlogPosts } from '../src/lib/server/seedBlog';
import { blogPosts as blogPostsTable } from '../src/lib/server/schema';

const client = createClient({
	url: process.env.TURSO_DATABASE_URL || 'file:local.db',
	authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client);

async function seed() {
	console.log('🌱 Seeding traders...');
	for (const trader of seedTraders) {
		await db.insert(tradersTable).values(trader).onConflictDoNothing();
	}
	console.log(`✅ Inserted ${seedTraders.length} traders`);

	if (seedBlogPosts.length > 0) {
		console.log('🌱 Seeding blog posts...');
		for (const post of seedBlogPosts) {
			await db.insert(blogPostsTable).values(post as any).onConflictDoNothing();
		}
		console.log(`✅ Inserted ${seedBlogPosts.length} blog posts`);
	}

	console.log('✅ Seed complete');
	process.exit(0);
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
