import type { PageServerLoad } from "./$types";
import { db } from "#lib/server/db.ts";
import { traders as tradersTable } from "#lib/server/schema.ts";
import { eq } from "drizzle-orm";
import { traderPhoto } from "#lib/server/trader-portraits.ts";
import { selectDailyQuote } from "#lib/utils/daily-quote.ts";

// ============================================================================
// RENDERING CONFIGURATION
// ============================================================================
export const ssr = true; // SEO enabled
export const csr = true; // Hydration enabled for interactions

// ============================================================================
// TYPES
// ============================================================================
interface TraderProfile {
  name: string;
  slug: string;
  tradingStyle: string;
  oneLiner: string;
  photoUrl: string | null;
}

// ============================================================================
// DATA LOADING
// ============================================================================
export const load: PageServerLoad = async () => {
  const featuredOrder = [
    "mark-minervini",
    "george-soros",
    "billy-ribeiro",
    "warren-buffett",
    "paul-tudor-jones",
    "ray-dalio",
    "jesse-livermore",
    "peter-lynch",
  ];
  const excludeSlugs = ["john-carter"];

  const allTraders = await db
    .select({
      name: tradersTable.name,
      slug: tradersTable.slug,
      tradingStyle: tradersTable.tradingStyle,
      oneLiner: tradersTable.oneLiner,
      photoUrl: tradersTable.photoUrl,
      quotes: tradersTable.quotes,
    })
    .from(tradersTable)
    .where(eq(tradersTable.status, "published"));

  const orderedTraders = allTraders
    .filter((t) => !excludeSlugs.includes(t.slug))
    .sort((a, b) => {
      const aIndex = featuredOrder.indexOf(a.slug);
      const bIndex = featuredOrder.indexOf(b.slug);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

  const traders: TraderProfile[] = orderedTraders.slice(0, 8).map((t) => ({
    name: t.name,
    slug: t.slug,
    tradingStyle: t.tradingStyle || "Trading",
    oneLiner: t.oneLiner || "Legendary Trader",
    photoUrl: traderPhoto(t.slug, t.photoUrl),
  }));

  const dailyQuote = selectDailyQuote(allTraders, new Date());

  const meta = {
    title: "Trading Greats - Study Strategies From The World's Greatest Traders",
    description:
      "Master proven trading methodologies from legendary investors. Study value investing from Buffett, momentum trading from Minervini, and macro strategies from Soros.",
    canonical: "https://tradinggreats.com",
  };

  return { traders, dailyQuote, meta };
};
