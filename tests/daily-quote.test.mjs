import { test } from "node:test";
import assert from "node:assert/strict";
import { selectDailyQuote } from "../src/lib/utils/daily-quote.ts";

const traders = [
  { name: "Beta", slug: "beta", quotes: [{ text: "B1" }] },
  { name: "Alpha", slug: "alpha", quotes: [{ text: "A1", source: "Book" }, { text: "A2" }] },
  { name: "Empty", slug: "empty", quotes: [{ text: " " }] },
];
const date = (day) => new Date(day * 86_400_000);

test("gives each eligible trader a turn regardless of quote count or input order", () => {
  const first = selectDailyQuote(traders, date(20));
  const second = selectDailyQuote(traders, date(21));
  assert.equal(first?.traderSlug, "alpha");
  assert.equal(second?.traderSlug, "beta");
  assert.deepEqual(selectDailyQuote([...traders].reverse(), date(20)), first);
  assert.equal(selectDailyQuote(traders, date(22))?.traderSlug, "alpha");
  assert.notEqual(selectDailyQuote(traders, date(22))?.text, first?.text);
});

test("uses the same UTC date across a day and handles empty libraries", () => {
  assert.deepEqual(
    selectDailyQuote(traders, new Date("2026-12-31T00:00:00Z")),
    selectDailyQuote(traders, new Date("2026-12-31T23:59:59Z")),
  );
  assert.notEqual(
    selectDailyQuote(traders, new Date("2026-12-31T23:59:59Z"))?.traderSlug,
    selectDailyQuote(traders, new Date("2027-01-01T00:00:00Z"))?.traderSlug,
  );
  assert.equal(selectDailyQuote([], date(0)), null);
  assert.equal(selectDailyQuote([{ name: "Empty", slug: "empty", quotes: null }], date(0)), null);
});
