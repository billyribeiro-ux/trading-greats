import type { NewTrader } from './schema';

export const seedTraders: NewTrader[] = [
	{
		name: 'Mark Minervini',
		slug: 'mark-minervini',
		photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
		oneLiner: 'U.S. Investing Champion with 220% Annual Returns',
		birthYear: 1960,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$50+ Million',
		bio: `Mark Minervini is a legendary stock trader who turned a few thousand dollars into millions using his proprietary SEPA (Specific Entry Point Analysis) methodology. His journey from a struggling trader to a two-time U.S. Investing Champion is nothing short of remarkable.

## Early Life & Struggles

Mark didn't start as a natural. In fact, he lost money for years before cracking the code. He spent countless hours studying the greatest traders in history, including Jesse Livermore, Nicolas Darvas, and William O'Neil. This obsessive study of market history would become the foundation of his trading approach.

## The SEPA Methodology

Minervini developed SEPA (Specific Entry Point Analysis), a systematic approach to identifying superperformer stocks before they make their biggest moves. The system focuses on:

- **Trend Template**: Only buying stocks in confirmed uptrends
- **Volatility Contraction Pattern (VCP)**: Identifying tight consolidations before breakouts
- **Relative Strength**: Seeking stocks outperforming the market
- **Fundamental Catalysts**: Earnings acceleration and revenue growth

## Championship Performance

Mark won the U.S. Investing Championship in 1997 with a stunning 155% return. He returned to competition in 2021 and won again, proving his methods remain effective across different market cycles. His compound annual growth rate over his career exceeds 30%.

## Teaching & Legacy

Today, Mark is dedicated to teaching his methodology through his books, workshops, and Master Trader Program. He has helped thousands of traders understand that consistent profits come from having a defined strategy and the discipline to execute it.`,
		philosophy: `"The goal of a successful trader is to make the best trades. Money is secondary." Mark believes in cutting losses quickly (typically at 7-8% below purchase price), letting winners run, and only trading stocks that meet all his criteria. He emphasizes that most traders fail because they lack a specific, repeatable methodology.`,
		achievements: [
			'Two-time U.S. Investing Champion (1997, 2021)',
			'155% return in 1997 championship',
			'334.8% return in 2021 championship',
			'Author of multiple bestselling trading books',
			'Founder of Minervini Private Access',
			'Over 30 years of consistent profitability'
		],
		famousTrades: [
			{
				date: '1997',
				asset: 'Multiple Growth Stocks',
				position: 'long',
				outcome: 'Championship Win',
				profitLoss: '+155%',
				description: 'Used SEPA methodology to identify and ride multiple momentum stocks to victory in the U.S. Investing Championship.'
			},
			{
				date: '2021',
				asset: 'Growth & Momentum Plays',
				position: 'long',
				outcome: 'Championship Win',
				profitLoss: '+334.8%',
				description: 'Returned to competition after 24 years and dominated with his refined SEPA system, proving its timeless effectiveness.'
			}
		],
		quotes: [
			{ text: 'The goal of a successful trader is to make the best trades. Money is secondary.', source: 'Trade Like a Stock Market Wizard' },
			{ text: 'Losses are a cost of doing business. Take them quickly and move on.', source: 'Interview' },
			{ text: 'I look for stocks that are acting right, in the right industry groups, at the right time.', source: 'Master Trader Program' },
			{ text: 'Your job as a trader is not to predict. Your job is to react.', source: 'Minervini Private Access' }
		],
		books: [
			{ title: 'Trade Like a Stock Market Wizard', year: 2013, description: 'The definitive guide to the SEPA methodology' },
			{ title: 'Think & Trade Like a Champion', year: 2017, description: 'Advanced strategies and mindset for serious traders' },
			{ title: 'Mindset Secrets for Winning', year: 2019, description: 'The psychological edge needed to succeed' }
		],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/markminervini' },
			{ platform: 'Website', url: 'https://www.minervini.com' }
		],
		status: 'published'
	},
	{
		name: 'Billy Ribeiro',
		slug: 'billy-ribeiro',
		photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
		oneLiner: 'Options Trading Educator & Price Action Specialist',
		birthYear: 1985,
		nationality: 'American',
		tradingStyle: 'Options & Price Action',
		netWorth: '$10+ Million',
		bio: `Billy Ribeiro is a renowned options trader and educator who has built a massive following through his transparent approach to trading and teaching. Known for his focus on price action and options strategies, Billy has helped thousands of traders understand the mechanics of profitable trading.

## Journey to Trading

Billy's path to trading wasn't conventional. Coming from a humble background, he discovered the markets as a way to create financial freedom. After years of trial and error, he developed a systematic approach to reading price action and executing options trades.

## Trading Philosophy

What sets Billy apart is his emphasis on:

- **Price Action Mastery**: Reading the raw story that charts tell
- **Options Strategy**: Using options for defined risk and leveraged returns
- **Risk Management**: Never risking more than you can afford to lose
- **Consistency Over Home Runs**: Building wealth through repeatable setups

## Educational Impact

Billy has become one of the most influential trading educators of his generation. His straightforward teaching style breaks down complex concepts into actionable strategies. He's particularly known for his work with:

- SPY and QQQ options trading
- 0DTE (zero days to expiration) strategies
- Support and resistance trading
- Volume analysis

## Community Building

Beyond trading, Billy has built a thriving community of traders who support each other's growth. His live trading sessions and real-time analysis have set a new standard for transparency in trading education.`,
		philosophy: `"Trade what you see, not what you think." Billy emphasizes that the chart tells you everything you need to know if you learn to read it properly. He believes in keeping strategies simple, managing risk religiously, and focusing on high-probability setups rather than predictions.`,
		achievements: [
			'Built one of the largest options trading communities',
			'Pioneered accessible 0DTE options education',
			'Thousands of students trained worldwide',
			'Consistent documented trading results',
			'Innovative approach to price action trading'
		],
		famousTrades: [
			{
				date: '2023',
				asset: 'SPY 0DTE Options',
				position: 'long',
				outcome: 'Documented Win',
				profitLoss: '+200%+',
				description: 'Multiple documented 0DTE trades using support/resistance levels and volume analysis.'
			}
		],
		quotes: [
			{ text: 'Trade what you see, not what you think.', source: 'Trading Room' },
			{ text: 'The market will always tell you what to do. You just have to listen.', source: 'Educational Content' },
			{ text: 'Risk management is not optional. It is the foundation of everything.', source: 'Course Material' }
		],
		books: [],
		socialLinks: [
			{ platform: 'YouTube', url: 'https://youtube.com/@billyribeiro' },
			{ platform: 'Twitter', url: 'https://twitter.com/billyribeiro' }
		],
		status: 'published'
	},
	{
		name: 'John Carter',
		slug: 'john-carter',
		photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
		oneLiner: 'Squeeze Indicator Creator & Options Trading Legend',
		birthYear: 1969,
		nationality: 'American',
		tradingStyle: 'Options & Technical Analysis',
		netWorth: '$100+ Million',
		bio: `John Carter is a legendary options trader best known for creating the "TTM Squeeze" indicator and building Simpler Trading into one of the most recognized trading education platforms in the world. His massive trades and transparent approach have made him a icon in the retail trading community.

## Background

John comes from a trading family—his father was a Morgan Stanley broker who introduced him to the markets at age 10. After getting degrees from Cambridge and the University of Texas, John initially worked as a financial analyst before going full-time into trading.

## The TTM Squeeze

John's most famous contribution to trading is the TTM (Trade The Markets) Squeeze indicator. This tool identifies periods of low volatility (the "squeeze") that often precede explosive moves. The indicator has become a staple on trading platforms worldwide and is used by hundreds of thousands of traders.

## Trading Style

John is known for:

- **Options on Futures**: Trading options on commodities and index futures
- **Swing Trading**: Holding positions for days to weeks
- **The Squeeze Setup**: Waiting for volatility compression before entering
- **Large Position Sizing**: Taking big swings when conviction is high

## Notable Trades

John has documented numerous seven and eight-figure trades throughout his career. His willingness to share both wins and losses has set him apart in an industry often filled with secrecy.

## Simpler Trading

Through Simpler Trading, John has trained tens of thousands of traders. The platform offers live trading rooms, educational courses, and indicator tools that have helped democratize trading knowledge.`,
		philosophy: `"The squeeze is the setup. The momentum is the trigger." John believes that most traders fail because they trade too much and too small. He advocates for patience—waiting for the highest probability setups—and then trading with conviction when they appear.`,
		achievements: [
			'Created the TTM Squeeze indicator (used by 500,000+ traders)',
			'Founded Simpler Trading',
			'Multiple documented 7 and 8-figure trades',
			'Author of "Mastering the Trade"',
			'Over 25 years of professional trading',
			'Pioneered options on futures education'
		],
		famousTrades: [
			{
				date: '2020',
				asset: 'Tesla Options',
				position: 'long',
				outcome: 'Massive Win',
				profitLoss: '+$16 Million',
				description: 'Famously turned a position in Tesla calls into a $16 million profit during the 2020 rally.'
			},
			{
				date: '2021',
				asset: 'AMC Options',
				position: 'long',
				outcome: 'Major Win',
				profitLoss: '+$11 Million',
				description: 'Captured the meme stock rally with a perfectly timed options play on AMC.'
			}
		],
		quotes: [
			{ text: 'The squeeze is the setup. The momentum is the trigger.', source: 'Simpler Trading' },
			{ text: 'I would rather make 10% on a large position than 100% on a small position.', source: 'Mastering the Trade' },
			{ text: 'Professional traders spend most of their time waiting. Amateurs spend most of their time trading.', source: 'Interview' },
			{ text: 'The markets can remain irrational longer than you can remain solvent.', source: 'Trading Room' }
		],
		books: [
			{ title: 'Mastering the Trade', year: 2006, description: 'The complete guide to day and swing trading' },
			{ title: 'Mastering the Trade (Second Edition)', year: 2012, description: 'Updated strategies for modern markets' },
			{ title: 'Mastering the Trade (Third Edition)', year: 2019, description: 'Latest techniques including options strategies' }
		],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/johncarter' },
			{ platform: 'Website', url: 'https://www.simplertrading.com' }
		],
		status: 'published'
	},
	{
		name: 'George Soros',
		slug: 'george-soros',
		photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
		oneLiner: 'The Man Who Broke the Bank of England',
		birthYear: 1930,
		nationality: 'Hungarian-American',
		tradingStyle: 'Macro & Currency',
		netWorth: '$6.7 Billion',
		bio: `George Soros is widely considered one of the most successful investors in history. His Quantum Fund delivered average annual returns exceeding 30% for decades, and his famous bet against the British pound in 1992 earned him over $1 billion in a single day.

## Early Life

Born in Budapest, Hungary in 1930, Soros survived the Nazi occupation by using forged documents and hiding his Jewish identity. He emigrated to England in 1947, working as a waiter and railway porter while studying at the London School of Economics under philosopher Karl Popper.

## The Theory of Reflexivity

Soros developed his investment philosophy around the concept of "reflexivity"—the idea that market participants' perceptions actively shape market fundamentals, creating feedback loops that can drive prices far from equilibrium. This philosophical framework has guided his trading decisions throughout his career.

## Black Wednesday

On September 16, 1992, Soros made financial history. He bet $10 billion that the British pound was overvalued and would be forced to devalue. When the Bank of England couldn't defend the currency and withdrew from the European Exchange Rate Mechanism, Soros made over $1 billion in a single day. This event became known as "Black Wednesday."

## The Quantum Fund

Soros founded the Quantum Fund in 1969. Over the next several decades, the fund generated:
- Average annual returns of 30%+
- Total gains exceeding $40 billion
- Consistent outperformance of traditional investment strategies

## Philanthropy

Soros has given away over $32 billion to philanthropic causes through his Open Society Foundations, making him one of the most generous philanthropists in history.`,
		philosophy: `"It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong." Soros believes in making asymmetric bets—positions where the potential upside far exceeds the potential downside. He also emphasizes the importance of recognizing and correcting mistakes quickly.`,
		achievements: [
			'Made $1 billion in one day shorting the British pound',
			'Quantum Fund returned 30%+ annually for decades',
			'Donated over $32 billion to charity',
			'Developed the theory of reflexivity',
			'One of the most successful currency traders in history',
			'Built a fortune from nothing as an immigrant'
		],
		famousTrades: [
			{
				date: 'September 16, 1992',
				asset: 'British Pound (GBP)',
				position: 'short',
				outcome: 'Legendary Win',
				profitLoss: '+$1 Billion',
				description: 'Shorted $10 billion worth of British pounds, forcing the UK to withdraw from the ERM. Made over $1 billion in a single day.'
			},
			{
				date: '1997',
				asset: 'Thai Baht & Asian Currencies',
				position: 'short',
				outcome: 'Major Win',
				profitLoss: '+$750 Million',
				description: 'Anticipated and profited from the Asian Financial Crisis by shorting overvalued Asian currencies.'
			}
		],
		quotes: [
			{ text: "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.", source: 'The Alchemy of Finance' },
			{ text: 'The financial markets generally are unpredictable. So that one has to have different scenarios.', source: 'Interview' },
			{ text: 'I am only rich because I know when I am wrong.', source: 'Soros on Soros' },
			{ text: 'Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected.', source: 'The Alchemy of Finance' }
		],
		books: [
			{ title: 'The Alchemy of Finance', year: 1987, description: 'Soros explains his theory of reflexivity and investment philosophy' },
			{ title: 'Soros on Soros', year: 1995, description: 'Autobiography and insights into his thinking process' },
			{ title: 'The New Paradigm for Financial Markets', year: 2008, description: 'Analysis of the 2008 financial crisis' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/George_Soros' },
			{ platform: 'Open Society', url: 'https://www.opensocietyfoundations.org' }
		],
		status: 'published'
	},
	{
		name: 'Warren Buffett',
		slug: 'warren-buffett',
		photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
		oneLiner: 'The Oracle of Omaha',
		birthYear: 1930,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$130+ Billion',
		bio: `Warren Buffett is widely regarded as the most successful investor of all time. Through his company Berkshire Hathaway, he has built one of the largest fortunes in history using a disciplined value investing approach that he learned from Benjamin Graham and refined over seven decades.

## Early Years

Born in Omaha, Nebraska in 1930, Buffett showed an early aptitude for business. He filed his first tax return at age 13 (claiming a $35 deduction for his bicycle used on his paper route) and had already accumulated $9,800 in savings by the time he graduated high school.

## The Graham Influence

At Columbia Business School, Buffett studied under Benjamin Graham, the father of value investing. Graham's philosophy—buying securities for less than their intrinsic value—became the foundation of Buffett's approach, though he later evolved it to include qualitative factors like competitive advantages ("moats") and management quality.

## Berkshire Hathaway

In 1965, Buffett took control of a struggling textile company called Berkshire Hathaway. He transformed it into a holding company that has since delivered:
- 3,787,464% total return (1965-2022)
- 19.8% compound annual growth rate
- A stock price that went from $19 to over $500,000 per share

## Investment Philosophy

Buffett's approach centers on:
- **Circle of Competence**: Only investing in businesses he understands
- **Economic Moats**: Seeking companies with durable competitive advantages
- **Long-term Thinking**: His favorite holding period is "forever"
- **Margin of Safety**: Buying with a significant discount to intrinsic value

## The Buffett Partnership

Before Berkshire, Buffett ran private investment partnerships from 1956 to 1969, generating returns of 29.5% annually (vs. 7.4% for the Dow) with no losing years.`,
		philosophy: `"Be fearful when others are greedy, and greedy when others are fearful." Buffett believes that successful investing is about temperament, not intelligence. He advocates for buying wonderful businesses at fair prices, holding for the long term, and never investing in something you don't understand.`,
		achievements: [
			'Built Berkshire Hathaway into a $780 billion empire',
			'Delivered 3,787,464% total return since 1965',
			'Second richest person in the world for decades',
			'Pledged to give away 99% of wealth to charity',
			'No losing years in his partnership (1956-1969)',
			'Most studied investor in history'
		],
		famousTrades: [
			{
				date: '1988',
				asset: 'Coca-Cola (KO)',
				position: 'long',
				outcome: 'Iconic Investment',
				profitLoss: '+$25 Billion',
				description: 'Invested $1 billion in Coca-Cola, a position now worth over $25 billion. Still held in the portfolio today.'
			},
			{
				date: '2016',
				asset: 'Apple (AAPL)',
				position: 'long',
				outcome: 'Largest Position',
				profitLoss: '+$120 Billion',
				description: 'Began accumulating Apple shares, eventually becoming Berkshire\'s largest position with over $120 billion in unrealized gains.'
			},
			{
				date: '2008',
				asset: 'Goldman Sachs / Bank of America',
				position: 'long',
				outcome: 'Crisis Bargains',
				profitLoss: '+$15 Billion',
				description: 'Invested billions during the financial crisis when others were panicking, securing preferred shares with lucrative terms.'
			}
		],
		quotes: [
			{ text: 'Be fearful when others are greedy, and greedy when others are fearful.', source: 'Shareholder Letter' },
			{ text: 'Price is what you pay. Value is what you get.', source: 'Shareholder Letter' },
			{ text: 'Our favorite holding period is forever.', source: 'Annual Meeting' },
			{ text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.", source: 'Interview' },
			{ text: "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.", source: 'Shareholder Letter' }
		],
		books: [
			{ title: 'The Essays of Warren Buffett', year: 1997, description: 'Collection of his shareholder letters, edited by Lawrence Cunningham' },
			{ title: 'Berkshire Hathaway Letters to Shareholders', year: 2023, description: 'Complete collection of annual letters from 1965-present' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Warren_Buffett' },
			{ platform: 'Berkshire Hathaway', url: 'https://www.berkshirehathaway.com' }
		],
		status: 'published'
	}
];
