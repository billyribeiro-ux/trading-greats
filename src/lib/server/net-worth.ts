/** Dated third-party estimates, not audited statements of personal wealth. */
export interface NetWorthEstimate {
  amount: string;
  date: string;
  source: string;
  url: string;
}

const estimates: Partial<Record<string, NetWorthEstimate>> = {
  "david-tepper": {
    amount: "$28.5 billion",
    date: "September 2026",
    source: "Forbes 400",
    url: "https://www.forbes.com/profile/david-tepper/?list=forbes-400",
  },
  "ken-griffin": {
    amount: "$60.5 billion",
    date: "September 2026",
    source: "Forbes 400",
    url: "https://www.forbes.com/profile/ken-griffin/?list=forbes-400",
  },
  "paul-tudor-jones": {
    amount: "$8.1 billion",
    date: "September 2026",
    source: "Forbes 400",
    url: "https://www.forbes.com/profile/paul-tudor-jones-ii/?list=forbes-400",
  },
  "bruce-kovner": {
    amount: "$10.4 billion",
    date: "September 2026",
    source: "Forbes 400",
    url: "https://www.forbes.com/profile/bruce-kovner/?list=forbes-400",
  },
  "warren-buffett": {
    amount: "$149 billion",
    date: "March 2026",
    source: "Forbes",
    url: "https://www.forbes.com/sites/chasewithorn/2026/03/10/forbes-worlds-billionaires-list-2026-the-top-200/",
  },
};

/** Never pass an unsourced database value through to a public page. */
export function withNetWorthEstimate<T extends { slug: string; netWorth: string | null }>(
  trader: T,
) {
  const netWorthEstimate = estimates[trader.slug] ?? null;
  const cleaned = { ...trader };
  if ("bio" in cleaned && typeof cleaned.bio === "string") {
    cleaned.bio = cleaned.bio.replace(
      "Starting with nothing, he made and lost several fortunes, with his peak net worth of $100 million in 1929 (equivalent to $1.5 billion today).",
      "Starting with nothing, he made and lost several fortunes over his career.",
    );
  }
  return { ...cleaned, netWorth: netWorthEstimate?.amount ?? null, netWorthEstimate };
}
