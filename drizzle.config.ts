import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.TURSO_DATABASE_URL || 'file:local.db';

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dialect: dbUrl.startsWith('file:') ? 'sqlite' : 'turso',
	dbCredentials: dbUrl.startsWith('file:')
		? { url: dbUrl }
		: {
				url: dbUrl,
				authToken: process.env.TURSO_AUTH_TOKEN
			}
});