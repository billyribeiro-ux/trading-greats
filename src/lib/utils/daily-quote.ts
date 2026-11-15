/** A stable, equal-turn rotation across published traders with usable quotes. */
export interface QuoteTrader {
  name: string;
  slug: string;
  quotes: { text: string; source?: string }[] | null;
}

export interface DailyQuote {
  text: string;
  source?: string;
  traderName: string;
  traderSlug: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function selectDailyQuote(traders: QuoteTrader[], date: Date): DailyQuote | null {
  const eligible = traders
    .map((trader) => ({
      ...trader,
      quotes: (trader.quotes ?? []).filter((quote) => quote.text?.trim()),
    }))
    .filter((trader) => trader.quotes.length > 0)
    .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  if (!eligible.length) return null;

  // UTC days keep the server-rendered result consistent for visitors worldwide.
  const day = Math.floor(date.getTime() / DAY_MS);
  const positiveModulo = (value: number, size: number) => ((value % size) + size) % size;
  const trader = eligible[positiveModulo(day, eligible.length)];
  const cycle = Math.floor(day / eligible.length);
  const quote = trader.quotes[positiveModulo(cycle, trader.quotes.length)];
  return {
    text: quote.text,
    source: quote.source,
    traderName: trader.name,
    traderSlug: trader.slug,
  };
}
