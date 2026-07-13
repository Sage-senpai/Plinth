import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { comparables } from '../lib/db/schema';
import { DEMO_COMPARABLES } from '../lib/demo/seed';

/**
 * Load the comparable sales corpus into Neon.
 *
 * Without this, a freshly pushed schema has no comparables, and every valuation
 * silently falls back to the area land rate — a number that is a starting point
 * for a conversation, not a valuation. A live database with an empty
 * comparables table is worse than demo mode, because it looks real.
 *
 *   npm run db:seed
 */
async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error(
      'DATABASE_URL is not set. In demo mode the comparables are served from\n' +
        'the in-memory store and there is nothing to seed.',
    );
    process.exit(1);
  }

  const db = drizzle(neon(url));

  const existing = await db.select({ id: comparables.id }).from(comparables);
  if (existing.length > 0) {
    console.log(
      `${existing.length} comparables already recorded. Nothing to do.`,
    );
    return;
  }

  const rows = DEMO_COMPARABLES.map((c) => ({
    address: c.address,
    state: c.state,
    lga: c.lga,
    areaCode: c.areaCode,
    type: c.type,
    sizeSqm: c.sizeSqm,
    salePrice: c.salePrice,
    saleDate: c.saleDate,
    source: c.source,
  }));

  await db.insert(comparables).values(rows);

  console.log(`Seeded ${rows.length} comparable sales.`);
  console.log(
    'These are the sales Plinth has been given. They are not the market —\n' +
      'every valuation widens its range to say so.',
  );
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
