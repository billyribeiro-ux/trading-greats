/**
 * Blog Posts Seed Data
 * 
 * Sample blog posts for the Trading Greats blog section.
 * These posts cover various trading topics and are linked to trader profiles.
 */

import type { NewBlogPost, BlogCategory } from './schema';

export const seedBlogPosts: NewBlogPost[] = [
	// ============================================================================
	// STRATEGY POSTS
	// ============================================================================
	{
		title: 'The CANSLIM Method: How William O\'Neil Built a Trading Empire',
		slug: 'canslim-method-william-oneil',
		excerpt: 'Discover the systematic approach that helped William O\'Neil identify winning stocks and build Investor\'s Business Daily into a financial media powerhouse.',
		content: `# The CANSLIM Method: A Systematic Approach to Stock Selection

William O'Neil developed CANSLIM after studying every winning stock in the market from 1880 to 2009. This wasn't theoretical—it was backed by over a century of real market data.

## What is CANSLIM?

CANSLIM is an acronym that represents seven key characteristics of winning stocks:

### C - Current Quarterly Earnings
Look for stocks showing strong current quarterly earnings per share growth. O'Neil found that 75% of the biggest winners had earnings growth of at least 70% in the quarter before their major price move.

### A - Annual Earnings Growth
The best stocks show a consistent pattern of annual earnings growth over at least 5 years. Look for 25%+ annual growth.

### N - New Products, New Management, New Highs
Great stocks often have something "new" driving their business. And contrary to popular belief, you should buy stocks making new highs, not new lows.

### S - Supply and Demand
Look for stocks with relatively small supply (fewer shares outstanding) and heavy trading volume on up days.

### L - Leader or Laggard
Buy the market leaders in strong industry groups, not the sympathy plays or laggards.

### I - Institutional Sponsorship
You want quality institutional ownership—not too much, not too little.

### M - Market Direction
Even the best stocks struggle in bear markets. Always trade with the trend.

## Why CANSLIM Works

The genius of CANSLIM is that it's not based on theory or gut feelings. It's a rules-based system derived from studying what actually worked historically.

> "The whole secret to winning in the stock market is to lose the least amount possible when you're not right." — William O'Neil

## Implementing CANSLIM Today

Modern traders can apply CANSLIM using stock screeners, IBD ratings, and technical analysis tools. The key is discipline—following the rules even when it's uncomfortable.`,
		heroImage: null,
		heroImageAlt: 'Stock trading chart analysis',
		author: 'Trading Greats Team',
		readingTime: 8,
		category: 'strategy' as BlogCategory,
		tags: ['CANSLIM', 'William O\'Neil', 'Growth Investing', 'Stock Screening'],
		seoTitle: 'CANSLIM Method Explained: William O\'Neil\'s Stock Selection Strategy',
		seoDescription: 'Learn the CANSLIM method developed by William O\'Neil. Discover how this systematic approach identifies winning stocks using 7 key criteria.',
		status: 'published',
		featured: true,
		publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
	},
	{
		title: 'Position Sizing: The Secret Weapon of Professional Traders',
		slug: 'position-sizing-professional-traders',
		excerpt: 'Why the amount you bet matters more than what you bet on. Learn the position sizing strategies used by legendary traders to manage risk.',
		content: `# Position Sizing: The Secret Weapon of Professional Traders

Ask any legendary trader what separates winners from losers, and they'll tell you it's not about picking stocks—it's about position sizing.

## The 2% Rule

Ed Seykota, one of the most successful traders in history, never risked more than 2% of his portfolio on any single trade. This simple rule allowed him to survive inevitable losing streaks while capitalizing on his winners.

### How to Calculate Position Size

\`\`\`
Position Size = (Account Size × Risk %) / (Entry Price - Stop Loss)
\`\`\`

For example, if you have a $100,000 account and want to risk 2% on a trade where your entry is $50 and stop loss is $45:

\`\`\`
Position Size = ($100,000 × 0.02) / ($50 - $45)
Position Size = $2,000 / $5 = 400 shares
\`\`\`

## The Kelly Criterion

Developed by mathematician John Kelly, this formula helps determine the optimal bet size to maximize long-term growth:

\`\`\`
Kelly % = W - [(1 - W) / R]
\`\`\`

Where:
- W = Win probability
- R = Win/Loss ratio

## Real-World Application

Paul Tudor Jones famously said: "The most important rule of trading is to play great defense, not great offense."

He never lets a losing position get out of control. His max drawdown on any single trade is strictly limited.

## Common Position Sizing Mistakes

1. **Betting too big after wins** - Overconfidence leads to oversized positions
2. **Averaging down** - Adding to losers is a recipe for disaster
3. **Ignoring correlation** - Multiple correlated positions = one big position
4. **Not adjusting for volatility** - A volatile stock needs smaller position size

## The Math of Ruin

Here's why position sizing matters:

| Loss | Gain Needed to Recover |
|------|------------------------|
| 10%  | 11%                    |
| 25%  | 33%                    |
| 50%  | 100%                   |
| 75%  | 300%                   |

A 50% loss requires a 100% gain just to break even. This is why preservation of capital is paramount.`,
		heroImage: null,
		heroImageAlt: 'Trading risk management charts',
		author: 'Trading Greats Team',
		readingTime: 6,
		category: 'strategy' as BlogCategory,
		tags: ['Position Sizing', 'Risk Management', 'Kelly Criterion', 'Trading Rules'],
		seoTitle: 'Position Sizing Strategies: How Professional Traders Manage Risk',
		seoDescription: 'Master position sizing techniques used by legendary traders. Learn the 2% rule, Kelly Criterion, and how to calculate optimal position sizes.',
		status: 'published',
		featured: false,
		publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
	},

	// ============================================================================
	// PSYCHOLOGY POSTS
	// ============================================================================
	{
		title: 'The Psychology of Market Wizards: What Separates Winners from Losers',
		slug: 'psychology-market-wizards',
		excerpt: 'After interviewing dozens of legendary traders, Jack Schwager discovered common psychological traits that separate consistent winners from everyone else.',
		content: `# The Psychology of Market Wizards

Jack Schwager spent decades interviewing the world's greatest traders for his Market Wizards series. While their strategies varied wildly, their psychological traits were remarkably consistent.

## The Common Thread

> "I've learned that good traders are winners, but not necessarily because they have great systems. They're winners because they have winning attitudes." — Jack Schwager

## Key Psychological Traits of Market Wizards

### 1. Extreme Discipline

Every successful trader Schwager interviewed emphasized discipline as the single most important trait. They follow their rules religiously, regardless of how they feel.

Paul Tudor Jones: "I'm always thinking about losing money as opposed to making money."

### 2. Emotional Detachment

Winners don't get attached to positions. They can be flat wrong and exit immediately without ego damage.

Ed Seykota: "Win or lose, everybody gets what they want out of the market."

### 3. Total Responsibility

Market Wizards never blame the market, the Fed, or anyone else. They take complete responsibility for their results.

### 4. Patience

Great traders wait for the perfect setup. They don't force trades out of boredom or FOMO.

Jesse Livermore: "It was never my thinking that made the big money for me. It was always my sitting."

### 5. Confidence Without Arrogance

They trust their analysis and execution, but remain humble enough to admit when they're wrong.

## The Losing Mindset

In contrast, losing traders typically:

- **Trade for excitement** rather than profit
- **Blame external factors** for losses
- **Chase trades** after missing initial entries
- **Hold losers** hoping they'll recover
- **Take profits too quickly** while letting losses run

## How to Develop a Winning Psychology

1. **Keep a trading journal** - Review your emotional state during each trade
2. **Meditate** - Many top traders meditate to maintain emotional equilibrium
3. **Trade small** - Emotions decrease as position size decreases
4. **Accept uncertainty** - You can't control the market, only your response

## The Ultimate Test

Mark Douglas wrote: "The best traders have evolved to the point where they believe, without a shred of doubt or internal conflict, that anything can happen."

Can you truly accept that anything can happen on any trade? That's the goal.`,
		heroImage: null,
		heroImageAlt: 'Trader analyzing market psychology',
		author: 'Trading Greats Team',
		readingTime: 7,
		category: 'psychology' as BlogCategory,
		tags: ['Trading Psychology', 'Market Wizards', 'Jack Schwager', 'Mindset'],
		seoTitle: 'Trading Psychology: What Makes Market Wizards Different',
		seoDescription: 'Discover the psychological traits shared by legendary traders interviewed in Market Wizards. Learn what separates consistent winners from losers.',
		status: 'published',
		featured: false,
		publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
	},

	// ============================================================================
	// BIOGRAPHY POSTS
	// ============================================================================
	{
		title: 'George Soros: The Man Who Broke the Bank of England',
		slug: 'george-soros-broke-bank-of-england',
		excerpt: 'The inside story of how George Soros made $1 billion in a single day by betting against the British pound on Black Wednesday.',
		content: `# George Soros: The Man Who Broke the Bank of England

On September 16, 1992—a day that would become known as "Black Wednesday"—George Soros made $1 billion by betting against the British pound. It remains one of the most legendary trades in financial history.

## The Setup

In 1992, Britain was part of the European Exchange Rate Mechanism (ERM), which required it to maintain the pound within a certain band against other European currencies.

But there was a problem: Britain's economy was struggling, and the pound was overvalued. The Bank of England was spending billions to prop up the currency.

## Soros's Thesis

Soros saw a massive asymmetric opportunity. The Bank of England couldn't defend the pound forever. Either:

1. They would devalue the pound (profit for shorts)
2. They would maintain the peg (small loss for shorts)

The risk/reward was incredibly favorable.

## The Trade

Soros, through his Quantum Fund, built a position worth approximately **$10 billion** against the pound. This wasn't a small bet—it was larger than the GDP of many countries.

> "I'm only rich because I know when I'm wrong." — George Soros

## Black Wednesday

On September 16, 1992, the Bank of England made its last stand:

- **Morning:** Raised interest rates from 10% to 12%
- **Afternoon:** Raised rates again to 15%
- **Evening:** Admitted defeat and withdrew from the ERM

The pound collapsed 15% against the Deutsche Mark.

## The Aftermath

- **Soros's profit:** Approximately $1 billion in a single day
- **Bank of England losses:** £3.4 billion of taxpayer money
- **Lasting impact:** Britain never joined the Euro

## Lessons from the Trade

### 1. Reflexivity in Action

This trade exemplified Soros's theory of reflexivity—the idea that market participants' perceptions can fundamentally change reality. As more traders joined Soros in shorting the pound, it became a self-fulfilling prophecy.

### 2. Conviction

Soros wasn't afraid to "go for the jugular" when he saw a clear opportunity. He sized the trade appropriately for the asymmetric payoff.

### 3. Timing

He waited for the right moment. The fundamentals had been misaligned for months, but Soros struck when the technical picture confirmed his thesis.

## The Philosophy Behind the Trade

What made Soros unique wasn't just his capital—it was his intellectual framework. He approached markets as a student of human fallibility:

"Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected."`,
		heroImage: null,
		heroImageAlt: 'British pound sterling currency',
		author: 'Trading Greats Team',
		readingTime: 9,
		category: 'biography' as BlogCategory,
		tags: ['George Soros', 'Black Wednesday', 'Currency Trading', 'Macro Trading'],
		seoTitle: 'George Soros Black Wednesday: How He Made $1 Billion in One Day',
		seoDescription: 'The complete story of George Soros breaking the Bank of England. Learn how he made $1 billion betting against the British pound on Black Wednesday 1992.',
		status: 'published',
		featured: false,
		publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
	},

	// ============================================================================
	// EDUCATION POSTS
	// ============================================================================
	{
		title: 'Understanding Market Cycles: A Guide for Every Trader',
		slug: 'understanding-market-cycles',
		excerpt: 'Learn how to identify where we are in the market cycle and position your portfolio accordingly. The same patterns have repeated for over 100 years.',
		content: `# Understanding Market Cycles: A Guide for Every Trader

Howard Marks has written extensively about market cycles, calling them "the most important thing" in investing. Understanding where we are in the cycle is crucial for long-term success.

## The Four Stages of Market Cycles

### Stage 1: Accumulation

**Characteristics:**
- Markets have bottomed after a major decline
- Sentiment is extremely negative
- "Smart money" begins buying
- Media is full of doom and gloom
- Valuations are historically cheap

**What to do:** This is when legendary investors like Warren Buffett get greedy while others are fearful.

### Stage 2: Mark-Up (Bull Market)

**Characteristics:**
- Prices begin to rise consistently
- Economic data improves
- Retail investors start participating
- Media becomes cautiously optimistic
- New all-time highs are made

**What to do:** Stay invested, follow the trend, but begin raising stop losses.

### Stage 3: Distribution

**Characteristics:**
- Market makes little progress despite positive news
- Valuations become stretched
- "Smart money" begins selling to retail
- IPO activity increases dramatically
- Everyone is talking about stocks at parties

**What to do:** Reduce position sizes, tighten stops, raise cash.

### Stage 4: Mark-Down (Bear Market)

**Characteristics:**
- Prices decline, often rapidly
- Economic data weakens
- Panic selling accelerates
- Media turns extremely negative
- "It's different this time" becomes "It was obvious in hindsight"

**What to do:** Preserve capital, build watchlists, prepare for Stage 1.

## Historical Cycles

| Cycle | Bull Market | Bear Market |
|-------|-------------|-------------|
| 1980s-1990s | 1982-2000 | 2000-2002 |
| 2000s | 2003-2007 | 2007-2009 |
| 2010s | 2009-2020 | 2020 (brief) |
| 2020s | 2020-2021 | 2022 |

## Indicators to Watch

1. **Valuation metrics** - CAPE ratio, Price/Sales
2. **Sentiment indicators** - VIX, Put/Call ratio
3. **Breadth** - Advance/Decline line
4. **Credit spreads** - High yield vs. Treasuries
5. **Yield curve** - Inversions signal recession

## The Most Important Lesson

> "There is no way to know what cycle you are in while you are in it. You can only know what cycle you were in after the fact." — Howard Marks

This is why you must have a plan for every stage. Position sizing and risk management matter more than perfect timing.`,
		heroImage: null,
		heroImageAlt: 'Market cycle chart analysis',
		author: 'Trading Greats Team',
		readingTime: 7,
		category: 'education' as BlogCategory,
		tags: ['Market Cycles', 'Howard Marks', 'Bull Market', 'Bear Market', 'Technical Analysis'],
		seoTitle: 'Market Cycles Explained: 4 Stages Every Trader Must Understand',
		seoDescription: 'Master market cycles with this comprehensive guide. Learn to identify accumulation, mark-up, distribution, and mark-down phases.',
		status: 'published',
		featured: false,
		publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
	},

	// ============================================================================
	// BOOK REVIEW POST
	// ============================================================================
	{
		title: 'Book Review: Reminiscences of a Stock Operator',
		slug: 'book-review-reminiscences-stock-operator',
		excerpt: 'Why every serious trader should read this 100-year-old classic about Jesse Livermore. The lessons on speculation are timeless.',
		content: `# Book Review: Reminiscences of a Stock Operator

**Author:** Edwin Lefèvre
**First Published:** 1923
**Rating:** ★★★★★ Essential Reading

## Overview

"Reminiscences of a Stock Operator" is a thinly veiled biography of Jesse Livermore, one of the greatest speculators who ever lived. Written in 1923, it remains the most important book on trading psychology ever written.

## Why It Matters 100 Years Later

The markets have changed dramatically since 1923—we've gone from ticker tape to algorithmic trading. But human psychology hasn't changed at all. Every mistake Livermore made, traders still make today.

## Key Lessons

### 1. "It was never my thinking that made the big money for me. It was always my sitting."

The hardest part of trading isn't entering—it's holding through volatility. Livermore's biggest wins came from sitting on positions that went his way for months or years.

### 2. "The market is never wrong. Opinions often are."

Stop arguing with the tape. If you're losing money, you're wrong. It doesn't matter how good your thesis is.

### 3. "There is only one side of the market, and it is not the bull side or the bear side, but the right side."

Don't marry your bias. Be willing to go long or short depending on market conditions.

### 4. "The desire for constant action irrespective of underlying conditions is responsible for many losses."

Most traders trade too much. The best trades are often the ones you don't make.

## Memorable Quotes

> "The game of speculation is the most uniformly fascinating game in the world. But it is not a game for the stupid, the mentally lazy, the person of inferior emotional balance, or the get-rich-quick adventurer."

> "A man must believe in himself and his judgment if he expects to make a living at this game."

> "The stock market is never obvious. It is designed to fool most of the people, most of the time."

## Who Should Read This

- Every trader, regardless of experience level
- Anyone struggling with trading psychology
- Students of market history
- Those who think "it's different this time"

## Final Verdict

This book should be on every trader's shelf. Read it once a year. Each time you'll discover new insights that apply to your current situation.

The prose is beautiful, the stories are gripping, and the lessons are eternal. There's a reason this book has been in print for 100 years.

**Essential reading. No exceptions.**`,
		heroImage: null,
		heroImageAlt: 'Classic trading book on desk',
		author: 'Trading Greats Team',
		readingTime: 5,
		category: 'book-review' as BlogCategory,
		tags: ['Book Review', 'Jesse Livermore', 'Trading Classics', 'Trading Psychology'],
		seoTitle: 'Reminiscences of a Stock Operator Review: Why Every Trader Must Read It',
		seoDescription: 'Our in-depth review of Reminiscences of a Stock Operator by Edwin Lefèvre. Discover why this 100-year-old book remains essential for traders.',
		status: 'published',
		featured: false,
		publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
	}
];

