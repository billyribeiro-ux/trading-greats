import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$app/env/private';

const client = createClient({
	url: TURSO_DATABASE_URL || 'file:local.db',
	authToken: TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
