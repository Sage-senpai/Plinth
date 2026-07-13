import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Plinth runs in two modes.
 *
 * With DATABASE_URL set, every read and write goes to Neon.
 * Without it (DEMO_MODE), the repository layer in ./repo falls back to the
 * seeded in-memory store so the product is fully explorable with no
 * infrastructure. `db` is null in that case and callers must not touch it
 * directly — go through ./repo.
 */
const url = process.env.DATABASE_URL;

export const db = url ? drizzle(neon(url), { schema }) : null;

export const isLive = Boolean(url);

export { schema };
