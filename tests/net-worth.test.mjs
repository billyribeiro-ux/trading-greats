import test from "node:test";
import assert from "node:assert/strict";
import { withNetWorthEstimate } from "../src/lib/server/net-worth.ts";

test("replaces an unsourced database figure with a dated, linked estimate", () => {
  const result = withNetWorthEstimate({ slug: "david-tepper", netWorth: "$20.6 Billion" });
  assert.equal(result.netWorth, "$28.5 billion");
  assert.equal(result.netWorthEstimate.date, "September 2026");
  assert.match(result.netWorthEstimate.url, /^https:\/\/www\.forbes\.com\//);
});

test("does not expose unsupported or missing net worth values", () => {
  for (const netWorth of ["$450 Million", "Private", null]) {
    const result = withNetWorthEstimate({ slug: "peter-lynch", netWorth });
    assert.equal(result.netWorth, null);
    assert.equal(result.netWorthEstimate, null);
  }
});

test("removes the unsupported Livermore wealth claim from public biography data", () => {
  const result = withNetWorthEstimate({
    slug: "jesse-livermore",
    netWorth: "$100 Million",
    bio: "Starting with nothing, he made and lost several fortunes, with his peak net worth of $100 million in 1929 (equivalent to $1.5 billion today).",
  });
  assert.doesNotMatch(result.bio, /net worth|\$100 million/);
});
