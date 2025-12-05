import type { NewTrader } from './schema';

export const seedTraders: NewTrader[] = [
	{
		name: 'Mark Minervini',
		slug: 'mark-minervini',
		photoUrl: null,
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
		photoUrl: null,
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
		photoUrl: null,
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
		photoUrl: null,
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
		photoUrl: null,
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
	},
	{
		name: 'Paul Tudor Jones',
		slug: 'paul-tudor-jones',
		photoUrl: null,
		oneLiner: 'Predicted the 1987 Crash & Macro Trading Pioneer',
		birthYear: 1954,
		nationality: 'American',
		tradingStyle: 'Macro & Currency',
		netWorth: '$7.5 Billion',
		bio: `Paul Tudor Jones II is one of the most successful macro traders in history. He is best known for predicting and profiting from the 1987 stock market crash, tripling his money while the market collapsed. His hedge fund, Tudor Investment Corp., has been one of the most consistently profitable funds for over four decades.

## Early Career

After graduating from the University of Virginia, Jones worked as a clerk on the trading floor before becoming a commodities broker. He founded Tudor Investment Corp. in 1980 at age 26.

## The 1987 Crash

Jones' most famous call was predicting Black Monday in 1987. Using technical analysis and pattern recognition, he identified similarities to the 1929 crash and positioned accordingly. While the Dow Jones fell 22% in a single day, Jones' fund reportedly made 62% that month alone.

## Trading Philosophy

Jones is known for his:
- **Risk Management**: Never risking more than 1% on any trade
- **Technical Analysis**: Using charts to time entries and exits
- **Macro Approach**: Trading based on global economic themes
- **Psychological Discipline**: Cutting losses quickly and letting winners run`,
		philosophy: `"The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge." Jones emphasizes risk management above all, famously saying he's always thinking about losing money, not making it.`,
		achievements: [
			'Made 62% return during 1987 crash',
			'Tudor Investment Corp manages $11+ billion',
			'Consistent 20%+ annual returns for decades',
			'Founder of Robin Hood Foundation',
			'Featured in "Market Wizards"',
			'One of the most respected macro traders alive'
		],
		famousTrades: [
			{
				date: 'October 1987',
				asset: 'S&P 500 Futures',
				position: 'short',
				outcome: 'Legendary Call',
				profitLoss: '+200%',
				description: 'Predicted and profited massively from Black Monday crash, reportedly tripling his fund.'
			}
		],
		quotes: [
			{ text: 'The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge.', source: 'Market Wizards' },
			{ text: "Don't focus on making money; focus on protecting what you have.", source: 'Interview' },
			{ text: 'Losers average losers.', source: 'Trading Wisdom' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Paul_Tudor_Jones' },
			{ platform: 'Tudor Investment Corp', url: 'https://www.tudorinvestmentcorp.com' }
		],
		status: 'published'
	},
	{
		name: 'Ray Dalio',
		slug: 'ray-dalio',
		photoUrl: null,
		oneLiner: 'Founder of World\'s Largest Hedge Fund',
		birthYear: 1949,
		nationality: 'American',
		tradingStyle: 'Macro & Currency',
		netWorth: '$19.1 Billion',
		bio: `Ray Dalio is the founder of Bridgewater Associates, the world's largest hedge fund with over $150 billion in assets under management. His "All Weather" portfolio strategy and principles-based approach to management have made him one of the most influential figures in finance.

## Building Bridgewater

Dalio founded Bridgewater Associates in 1975 from his two-bedroom apartment. Through his systematic, principles-based approach, he grew it into the largest hedge fund in the world.

## The All Weather Strategy

Dalio developed the "All Weather" portfolio, designed to perform well across all economic environments:
- Rising growth
- Falling growth
- Rising inflation
- Falling inflation

## Principles

Dalio is famous for his company culture based on "radical transparency" and "radical truth," documented in his bestselling book "Principles."`,
		philosophy: `"He who lives by the crystal ball will eat shattered glass." Dalio believes in systematic, rules-based investing and radical transparency in all aspects of life and business.`,
		achievements: [
			'Founded world\'s largest hedge fund ($150B+ AUM)',
			'Pioneer of risk parity investing',
			'Author of bestselling "Principles"',
			'All Weather portfolio strategy',
			'Predicted 2008 financial crisis',
			'Built systematic trading culture at Bridgewater'
		],
		famousTrades: [
			{
				date: '2008',
				asset: 'Credit Default Swaps',
				position: 'long',
				outcome: 'Crisis Profit',
				profitLoss: '+9.5%',
				description: 'Bridgewater\'s Pure Alpha fund gained 9.5% in 2008 while most funds lost heavily.'
			}
		],
		quotes: [
			{ text: 'He who lives by the crystal ball will eat shattered glass.', source: 'Principles' },
			{ text: 'Pain + Reflection = Progress', source: 'Principles' },
			{ text: 'Embrace reality and deal with it.', source: 'Principles' }
		],
		books: [
			{ title: 'Principles: Life and Work', year: 2017, description: 'Dalio\'s framework for decision-making and management' },
			{ title: 'Principles for Dealing with the Changing World Order', year: 2021, description: 'Analysis of empire cycles and economic patterns' }
		],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/raydalio' },
			{ platform: 'LinkedIn', url: 'https://www.linkedin.com/in/raydalio' }
		],
		status: 'published'
	},
	{
		name: 'Stanley Druckenmiller',
		slug: 'stanley-druckenmiller',
		photoUrl: null,
		oneLiner: 'Soros\'s Right Hand with 30% Annual Returns',
		birthYear: 1953,
		nationality: 'American',
		tradingStyle: 'Macro & Currency',
		netWorth: '$6.4 Billion',
		bio: `Stanley Druckenmiller is considered one of the greatest money managers in history. He managed money for George Soros's Quantum Fund from 1988 to 2000, achieving an average annual return of 30% with no losing years. He was the strategist behind the famous British pound trade.

## The Soros Partnership

Druckenmiller joined Soros Fund Management in 1988. Together, they executed some of the most profitable trades in history, including the famous bet against the British pound in 1992.

## Duquesne Capital

Before and after his time with Soros, Druckenmiller ran Duquesne Capital Management, which never had a down year in its 30-year history and averaged returns above 30%.

## Investment Approach

Druckenmiller is known for:
- **Concentration**: Making big bets when conviction is high
- **Flexibility**: Changing positions rapidly based on new information
- **Top-down macro**: Starting with the big picture and working down`,
		philosophy: `"The way to build long-term returns is through preservation of capital and home runs... When you have tremendous conviction on a trade, you have to go for the jugular."`,
		achievements: [
			'30% average annual returns for 30 years',
			'No losing years at Duquesne Capital',
			'Co-architected £10B pound short with Soros',
			'Managed Quantum Fund 1988-2000',
			'One of the most consistent track records ever',
			'Returned all outside capital in 2010'
		],
		famousTrades: [
			{
				date: '1992',
				asset: 'British Pound',
				position: 'short',
				outcome: 'Historic Trade',
				profitLoss: '+$1 Billion',
				description: 'Urged Soros to increase the pound short position, co-architecting the trade that broke the Bank of England.'
			}
		],
		quotes: [
			{ text: 'The way to build long-term returns is through preservation of capital and home runs.', source: 'Interview' },
			{ text: 'When you have tremendous conviction on a trade, you have to go for the jugular.', source: 'The New Market Wizards' },
			{ text: 'I\'ve learned many things from George Soros, but perhaps the most significant is that it\'s not whether you\'re right or wrong that\'s important, but how much money you make when you\'re right.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Stanley_Druckenmiller' }
		],
		status: 'published'
	},
	{
		name: 'Jesse Livermore',
		slug: 'jesse-livermore',
		photoUrl: null,
		oneLiner: 'The Greatest Stock Speculator Who Ever Lived',
		birthYear: 1877,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$100 Million (1929)',
		bio: `Jesse Lauriston Livermore is considered by many to be the greatest stock trader who ever lived. Starting with nothing, he made and lost several fortunes, with his peak net worth of $100 million in 1929 (equivalent to $1.5 billion today). His trading rules and psychology insights remain relevant nearly a century later.

## The Boy Plunger

Livermore began trading at age 14 in bucket shops (off-track betting parlors for stocks). By 15, he had made his first $1,000. His uncanny ability to predict price movements earned him the nickname "The Boy Plunger."

## Famous Calls

- **1907 Panic**: Shorted the market before the crash, making $1 million in one day
- **1929 Crash**: His greatest triumph, making $100 million shorting stocks before Black Tuesday

## Trading Rules

Livermore pioneered many concepts still used today:
- Trading in the direction of the overall market
- Using pivot points
- Adding to winning positions
- Cutting losses quickly`,
		philosophy: `"There is nothing new in Wall Street. There can't be because speculation is as old as the hills. Whatever happens in the stock market today has happened before and will happen again."`,
		achievements: [
			'Made $100 million in the 1929 crash',
			'Called both the 1907 and 1929 crashes',
			'Pioneer of technical analysis',
			'Trading rules still used today',
			'Subject of "Reminiscences of a Stock Operator"',
			'Made and lost fortunes multiple times'
		],
		famousTrades: [
			{
				date: '1929',
				asset: 'US Stocks',
				position: 'short',
				outcome: 'Greatest Trade',
				profitLoss: '+$100 Million',
				description: 'Shorted the entire market before the 1929 crash, making the equivalent of over $1.5 billion in today\'s money.'
			},
			{
				date: '1907',
				asset: 'Union Pacific',
				position: 'short',
				outcome: 'Major Win',
				profitLoss: '+$1 Million',
				description: 'Made $1 million in a single day during the Panic of 1907.'
			}
		],
		quotes: [
			{ text: 'There is nothing new in Wall Street. There can\'t be because speculation is as old as the hills.', source: 'Reminiscences of a Stock Operator' },
			{ text: 'The market is never wrong. Opinions often are.', source: 'How to Trade in Stocks' },
			{ text: 'It never was my thinking that made the big money for me. It always was my sitting.', source: 'Reminiscences of a Stock Operator' }
		],
		books: [
			{ title: 'How to Trade in Stocks', year: 1940, description: 'Livermore\'s own trading methodology' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jesse_Livermore' }
		],
		status: 'published'
	},
	{
		name: 'Peter Lynch',
		slug: 'peter-lynch',
		photoUrl: null,
		oneLiner: 'Grew Fidelity Magellan Fund from $18M to $14B',
		birthYear: 1944,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$450 Million',
		bio: `Peter Lynch is one of the most successful mutual fund managers in history. During his tenure at Fidelity Magellan Fund from 1977 to 1990, he achieved an average annual return of 29.2%, making it the best-performing mutual fund in the world.

## Fidelity Magellan

Lynch took over Fidelity Magellan in 1977 when it had $18 million in assets. By the time he retired in 1990, the fund had grown to over $14 billion—a testament to both his investment returns and the investor capital he attracted.

## Investment Philosophy

Lynch popularized the concept of "invest in what you know":
- **GARP**: Growth at a Reasonable Price
- **Ten Bagger**: Stocks that increase 10x in value
- **Stalwarts vs. Fast Growers**: Different strategies for different company types
- **Do Your Homework**: Thoroughly research every investment`,
		philosophy: `"Know what you own, and know why you own it." Lynch believes individual investors have advantages over professionals if they stick to what they know and do their research.`,
		achievements: [
			'29.2% average annual returns for 13 years',
			'Grew Magellan from $18M to $14B',
			'Best-performing mutual fund in the world',
			'Coined the term "ten bagger"',
			'Bestselling author on investing',
			'Made investing accessible to everyday people'
		],
		famousTrades: [
			{
				date: '1980s',
				asset: 'Dunkin\' Donuts',
				position: 'long',
				outcome: 'Ten Bagger',
				profitLoss: '+1000%',
				description: 'Lynch\'s classic "invest in what you know" pick—he noticed the long lines at Dunkin\' Donuts.'
			}
		],
		quotes: [
			{ text: 'Know what you own, and know why you own it.', source: 'One Up On Wall Street' },
			{ text: 'Go for a business that any idiot can run – because sooner or later, any idiot is probably going to run it.', source: 'One Up On Wall Street' },
			{ text: 'In the long run, it\'s not just how much money you make that will determine your future prosperity. It\'s how much of that money you put to work.', source: 'Learn to Earn' }
		],
		books: [
			{ title: 'One Up On Wall Street', year: 1989, description: 'How to use what you already know to make money in the market' },
			{ title: 'Beating the Street', year: 1993, description: 'More insights on stock picking' },
			{ title: 'Learn to Earn', year: 1995, description: 'Introduction to investing for beginners' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Peter_Lynch' }
		],
		status: 'published'
	},
	{
		name: 'Jim Simons',
		slug: 'jim-simons',
		photoUrl: null,
		oneLiner: 'Mathematician Who Built the Most Profitable Hedge Fund Ever',
		birthYear: 1938,
		nationality: 'American',
		tradingStyle: 'Quantitative Trading',
		netWorth: '$28.1 Billion',
		bio: `James Harris Simons is a mathematician and hedge fund manager who founded Renaissance Technologies, arguably the most successful hedge fund in history. His Medallion Fund has generated average annual returns of 66% before fees since 1988—an unprecedented track record.

## From Academia to Trading

Simons was an award-winning mathematician who helped crack codes for the NSA during the Cold War. He chaired the mathematics department at Stony Brook University before founding Renaissance Technologies in 1982.

## The Medallion Fund

Renaissance's flagship Medallion Fund is legendary:
- 66% average annual returns before fees (39% after)
- Has never had a losing year
- Uses purely quantitative strategies
- Employs mathematicians and scientists, not traditional traders

## Quantitative Revolution

Simons pioneered the use of:
- Machine learning in trading
- Pattern recognition
- Statistical arbitrage
- High-frequency trading strategies`,
		philosophy: `"We don't start with models. We start with data. We don't have any theories. We look for things that can be replicated thousands of times."`,
		achievements: [
			'66% average annual returns (Medallion Fund)',
			'Created the most profitable hedge fund ever',
			'Revolutionized quantitative trading',
			'Donated billions to mathematics and science',
			'Never had a losing year in Medallion',
			'Hired scientists instead of Wall Street traders'
		],
		famousTrades: [
			{
				date: '1988-Present',
				asset: 'Multiple Markets',
				position: 'long',
				outcome: 'Consistent Alpha',
				profitLoss: '+66% annually',
				description: 'Medallion Fund has generated unmatched returns using quantitative strategies across markets.'
			}
		],
		quotes: [
			{ text: 'We don\'t start with models. We start with data.', source: 'Interview' },
			{ text: 'Past performance is the best predictor of future success.', source: 'TED Talk' },
			{ text: 'Great scientists are skeptical. Period.', source: 'The Man Who Solved the Market' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jim_Simons_(mathematician)' }
		],
		status: 'published'
	},
	{
		name: 'Carl Icahn',
		slug: 'carl-icahn',
		photoUrl: null,
		oneLiner: 'The Most Feared Activist Investor on Wall Street',
		birthYear: 1936,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$24 Billion',
		bio: `Carl Icahn is a legendary activist investor known for taking large stakes in companies and pushing for changes to unlock shareholder value. His aggressive tactics have earned him billions and made him one of the most feared names in corporate boardrooms.

## Investment Style

Icahn typically:
- Takes large positions in undervalued companies
- Pushes for management changes or corporate restructuring
- Advocates for spinoffs, buybacks, or asset sales
- Sometimes launches proxy fights for board control

## Major Campaigns

Some of his most notable activist investments include:
- TWA (1985)
- Texaco (1988)
- Apple (2013-2016)
- Netflix (2012)
- eBay/PayPal (2014)`,
		philosophy: `"In life and business, there are two cardinal sins. The first is to act precipitously without thought and the second is to not act at all."`,
		achievements: [
			'Built $24 billion fortune through activism',
			'Transformed corporate governance in America',
			'Major wins at Apple, Netflix, eBay',
			'Pioneered hostile takeover strategies',
			'Has influenced hundreds of companies',
			'One of the most successful investors ever'
		],
		famousTrades: [
			{
				date: '2013-2016',
				asset: 'Apple (AAPL)',
				position: 'long',
				outcome: 'Major Win',
				profitLoss: '+$2 Billion',
				description: 'Pushed for buybacks and dividends, making roughly $2 billion on Apple shares.'
			}
		],
		quotes: [
			{ text: 'In life and business, there are two cardinal sins. The first is to act precipitously without thought and the second is to not act at all.', source: 'Interview' },
			{ text: 'I\'m not the type of person that does well in a company structure, where I\'m given an office and have to knock on the door of the guy with the bigger office.', source: 'Biography' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/carlicahn' },
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Carl_Icahn' }
		],
		status: 'published'
	},
	{
		name: 'Benjamin Graham',
		slug: 'benjamin-graham',
		photoUrl: null,
		oneLiner: 'The Father of Value Investing',
		birthYear: 1894,
		nationality: 'British-American',
		tradingStyle: 'Value Investing',
		netWorth: '$10 Million (1976)',
		bio: `Benjamin Graham is universally regarded as the father of value investing and security analysis. His teachings at Columbia Business School and his writings shaped the investment philosophy of Warren Buffett, among many others.

## The Graham Approach

Graham developed the fundamental framework for value investing:
- **Margin of Safety**: Always buy with a discount to intrinsic value
- **Mr. Market**: View the market as an emotional partner
- **Quantitative Analysis**: Use financial statements to determine value
- **Net-Net Investing**: Buy companies trading below net current asset value

## Columbia & Mentorship

Graham taught at Columbia Business School for nearly three decades, where his students included Warren Buffett. His courses on security analysis became legendary.`,
		philosophy: `"The intelligent investor is a realist who sells to optimists and buys from pessimists."`,
		achievements: [
			'Father of value investing',
			'Mentored Warren Buffett',
			'Wrote the "bible" of investing',
			'Created security analysis framework',
			'Graham-Newman Corp achieved 20% annual returns',
			'Influenced generations of investors'
		],
		famousTrades: [
			{
				date: '1948',
				asset: 'GEICO',
				position: 'long',
				outcome: 'Legendary Investment',
				profitLoss: '+5000%',
				description: 'Graham\'s partnership purchased a large stake in GEICO for $712,000, eventually worth over $400 million.'
			}
		],
		quotes: [
			{ text: 'The intelligent investor is a realist who sells to optimists and buys from pessimists.', source: 'The Intelligent Investor' },
			{ text: 'In the short run, the market is a voting machine but in the long run, it is a weighing machine.', source: 'Security Analysis' },
			{ text: 'The essence of investment management is the management of risks, not the management of returns.', source: 'Lectures' }
		],
		books: [
			{ title: 'Security Analysis', year: 1934, description: 'The foundational text on fundamental analysis' },
			{ title: 'The Intelligent Investor', year: 1949, description: 'The definitive book on value investing for individuals' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Benjamin_Graham' }
		],
		status: 'published'
	},
	{
		name: 'William O\'Neil',
		slug: 'william-oneil',
		photoUrl: null,
		oneLiner: 'Creator of CANSLIM & Investor\'s Business Daily',
		birthYear: 1933,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$500 Million',
		bio: `William J. O'Neil is the founder of Investor's Business Daily and creator of the CAN SLIM investment strategy. His systematic approach to growth stock investing has influenced millions of traders worldwide.

## CAN SLIM

O'Neil developed the CAN SLIM system after studying every great stock of the 20th century:
- **C**: Current quarterly earnings per share
- **A**: Annual earnings growth
- **N**: New products, new management, new highs
- **S**: Supply and demand
- **L**: Leader or laggard
- **I**: Institutional sponsorship
- **M**: Market direction

## Investor's Business Daily

In 1984, O'Neil founded Investor's Business Daily to compete with The Wall Street Journal, focusing on growth investing and technical analysis.`,
		philosophy: `"What seems too high and risky to the majority generally goes higher and what seems low and cheap generally goes lower."`,
		achievements: [
			'Created CAN SLIM methodology',
			'Founded Investor\'s Business Daily',
			'First to use computer databases for stock analysis',
			'Made 5,000% in 1962-1963',
			'Bought seat on NYSE at age 30',
			'Trained thousands of successful investors'
		],
		famousTrades: [
			{
				date: '1962-1963',
				asset: 'Syntex',
				position: 'long',
				outcome: 'Early Career Win',
				profitLoss: '+5000%',
				description: 'O\'Neil\'s early massive winner that helped develop his CAN SLIM methodology.'
			}
		],
		quotes: [
			{ text: 'What seems too high and risky to the majority generally goes higher and what seems low and cheap generally goes lower.', source: 'How to Make Money in Stocks' },
			{ text: 'The whole secret to winning in the stock market is to lose the least amount possible when you\'re not right.', source: 'Interview' }
		],
		books: [
			{ title: 'How to Make Money in Stocks', year: 1988, description: 'The complete guide to CAN SLIM investing' },
			{ title: '24 Essential Lessons for Investment Success', year: 2000, description: 'Condensed wisdom on growth investing' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/William_O%27Neil' },
			{ platform: 'IBD', url: 'https://www.investors.com' }
		],
		status: 'published'
	},
	{
		name: 'Linda Raschke',
		slug: 'linda-raschke',
		photoUrl: null,
		oneLiner: 'Champion Day Trader & Pattern Recognition Expert',
		birthYear: 1959,
		nationality: 'American',
		tradingStyle: 'Options & Technical Analysis',
		netWorth: '$50+ Million',
		bio: `Linda Bradford Raschke is one of the most respected short-term traders in the world. Featured in Jack Schwager's "The New Market Wizards," she has been trading professionally since 1981 and is known for her systematic approach to pattern recognition.

## Trading Career

Linda started as a floor trader on the Pacific Coast Stock Exchange before transitioning to electronic trading. She has been consistently profitable for over 40 years.

## Trading Style

Raschke is known for:
- Short-term swing trading and day trading
- Pattern recognition and classic chart patterns
- Mean reversion strategies
- Market breadth analysis

## Education

Linda runs LBR Group, teaching traders her systematic approach to the markets. She is known for making complex concepts accessible.`,
		philosophy: `"Trading is not about being right. It's about making money when you're right and losing small when you're wrong."`,
		achievements: [
			'Featured in "The New Market Wizards"',
			'Over 40 years of profitable trading',
			'Pioneered systematic short-term trading',
			'Former floor trader',
			'Respected trading educator',
			'One of the most successful female traders'
		],
		famousTrades: [],
		quotes: [
			{ text: 'Trading is not about being right. It\'s about making money when you\'re right and losing small when you\'re wrong.', source: 'The New Market Wizards' },
			{ text: 'Most traders never get past the starting gate because they\'re too busy looking for the Holy Grail.', source: 'Interview' }
		],
		books: [
			{ title: 'Street Smarts: High Probability Short-Term Trading Strategies', year: 1995, description: 'Co-authored with Laurence Connors' }
		],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/lindaraschke' },
			{ platform: 'Website', url: 'https://www.lbrgroup.com' }
		],
		status: 'published'
	},
	{
		name: 'Ed Seykota',
		slug: 'ed-seykota',
		photoUrl: null,
		oneLiner: 'Trend Following Pioneer with 250,000% Returns',
		birthYear: 1946,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$100+ Million',
		bio: `Ed Seykota is a pioneer of computerized trading systems and trend following. He reportedly turned $5,000 into $15,000,000 over a 12-year period—a return of approximately 250,000%.

## Computerized Trading Pioneer

In the early 1970s, Seykota was one of the first traders to develop and test computerized trading systems. He created mechanical trend-following strategies that removed emotion from trading.

## The Trading Tribe

Seykota is also known for his work on trading psychology through "The Trading Tribe" process, which helps traders identify and resolve emotional issues that interfere with their trading.

## Influence

Ed has mentored many successful traders, including Michael Marcus, who went on to make legendary returns himself.`,
		philosophy: `"Win or lose, everybody gets what they want out of the market. Some people seem to like to lose, so they win by losing money."`,
		achievements: [
			'250,000% returns over 12 years',
			'Pioneer of computerized trading',
			'Developed trend following systems',
			'Mentored Michael Marcus and others',
			'Featured in original "Market Wizards"',
			'Created "The Trading Tribe" methodology'
		],
		famousTrades: [
			{
				date: '1972-1984',
				asset: 'Commodities',
				position: 'long',
				outcome: 'Legendary Returns',
				profitLoss: '+250,000%',
				description: 'Turned $5,000 into $15 million using systematic trend following strategies.'
			}
		],
		quotes: [
			{ text: 'Win or lose, everybody gets what they want out of the market. Some people seem to like to lose, so they win by losing money.', source: 'Market Wizards' },
			{ text: 'The elements of good trading are: (1) cutting losses, (2) cutting losses, and (3) cutting losses.', source: 'Market Wizards' },
			{ text: 'Fundamentals that you read about are typically useless as the market has already discounted the price.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Website', url: 'https://www.seykota.com' },
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ed_Seykota' }
		],
		status: 'published'
	},
	{
		name: 'Richard Dennis',
		slug: 'richard-dennis',
		photoUrl: null,
		oneLiner: 'The Prince of the Pit & Creator of the Turtle Traders',
		birthYear: 1949,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$300 Million',
		bio: `Richard Dennis, known as the "Prince of the Pit," is a legendary commodities trader who reportedly turned $400 into $200 million. He is famous for the "Turtle Trading" experiment, which proved that trading could be taught.

## The Prince of the Pit

Dennis started trading at the Chicago Mercantile Exchange in his early twenties. His aggressive trend-following approach earned him the nickname "Prince of the Pit."

## The Turtle Experiment

In 1983, Dennis made a bet with partner William Eckhardt: could trading be taught? He recruited 23 people and taught them his trading system. The "Turtles" collectively earned over $175 million over five years, proving Dennis right.

## Trading Philosophy

Dennis's system was based on:
- Breakout trading
- Strict position sizing
- Pyramiding into winners
- Quick loss cutting`,
		philosophy: `"I always say you could publish trading rules in the newspaper and no one would follow them. The key is consistency and discipline."`,
		achievements: [
			'Turned $400 into $200 million',
			'Created the famous Turtle Trading experiment',
			'Proved trading can be taught',
			'Trained traders who made $175 million',
			'Pioneer of systematic trend following',
			'One of the youngest traders on CME'
		],
		famousTrades: [
			{
				date: '1970s-1980s',
				asset: 'Commodities',
				position: 'long',
				outcome: 'Career Returns',
				profitLoss: '+50,000,000%',
				description: 'Built a fortune from almost nothing using trend following breakout strategies.'
			}
		],
		quotes: [
			{ text: 'I always say you could publish trading rules in the newspaper and no one would follow them. The key is consistency and discipline.', source: 'Market Wizards' },
			{ text: 'Whatever method you use to enter trades, the most critical thing is that if there is a major trend, your approach should assure that you get in that trend.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Richard_Dennis' }
		],
		status: 'published'
	},
	{
		name: 'Michael Steinhardt',
		slug: 'michael-steinhardt',
		photoUrl: null,
		oneLiner: 'Hedge Fund Pioneer with 24% Average Returns',
		birthYear: 1940,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$1.2 Billion',
		bio: `Michael Steinhardt is a hedge fund pioneer who delivered an average annual return of 24% over a 28-year period. His fund, Steinhardt Partners, was one of the most successful hedge funds of its era.

## Steinhardt Partners

From 1967 to 1995, Steinhardt managed money with extraordinary results. A dollar invested at the start would have grown to $462, compared to $19 in the S&P 500.

## Investment Style

Steinhardt was known for:
- Variant perception (different views than consensus)
- Aggressive trading
- Both long and short positions
- Macro and micro analysis combined`,
		philosophy: `"The hardest thing over the years has been having the courage to go against the dominant wisdom of the time."`,
		achievements: [
			'24% annual returns for 28 years',
			'Pioneer of modern hedge fund industry',
			'$462 vs $19 S&P 500 dollar-for-dollar comparison',
			'Successful philanthropy after retirement',
			'Influenced generation of fund managers',
			'Closed fund in 1995 after stellar career'
		],
		famousTrades: [],
		quotes: [
			{ text: 'The hardest thing over the years has been having the courage to go against the dominant wisdom of the time.', source: 'No Bull' },
			{ text: 'Good trading is a peculiar balance between the conviction to follow your ideas and the flexibility to recognize when you have made a mistake.', source: 'Interview' }
		],
		books: [
			{ title: 'No Bull: My Life In and Out of Markets', year: 2001, description: 'Autobiography and investment insights' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Michael_Steinhardt' }
		],
		status: 'published'
	},
	{
		name: 'Julian Robertson',
		slug: 'julian-robertson',
		photoUrl: null,
		oneLiner: 'Legendary Tiger Management Founder',
		birthYear: 1932,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$4.8 Billion',
		bio: `Julian Hart Robertson Jr. founded Tiger Management, which became one of the earliest and most successful hedge funds. His disciples, known as "Tiger Cubs," have gone on to manage hundreds of billions of dollars.

## Tiger Management

Founded in 1980, Tiger Management grew from $8 million to over $22 billion at its peak, delivering average annual returns of 32%.

## The Tiger Cubs

Robertson is perhaps best known for mentoring the next generation of hedge fund managers. "Tiger Cubs" include:
- Chase Coleman (Tiger Global)
- John Griffin (Blue Ridge Capital)
- Lee Ainslie (Maverick Capital)
- Andreas Halvorsen (Viking Global)

## Investment Approach

Robertson combined deep fundamental research with macro awareness, going long best-in-class companies while shorting weak competitors.`,
		philosophy: `"Our mandate is to find the 200 best companies in the world and invest in them, and find the 200 worst companies in the world and go short on them."`,
		achievements: [
			'32% annual returns at Tiger Management',
			'Grew fund from $8 million to $22 billion',
			'Mentored "Tiger Cubs" who manage $200B+',
			'Pioneer of long/short equity strategy',
			'Created a dynasty of successful managers',
			'Influenced modern hedge fund industry'
		],
		famousTrades: [],
		quotes: [
			{ text: 'Our mandate is to find the 200 best companies in the world and invest in them, and find the 200 worst companies in the world and go short on them.', source: 'Interview' },
			{ text: 'I\'m looking for people who are passionate about what they do and have the ability to focus.', source: 'On hiring' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Julian_Robertson' }
		],
		status: 'published'
	},
	{
		name: 'David Tepper',
		slug: 'david-tepper',
		photoUrl: null,
		oneLiner: 'Distressed Debt King with 40% Annual Returns',
		birthYear: 1957,
		nationality: 'American',
		tradingStyle: 'Value Investing',
		netWorth: '$20.6 Billion',
		bio: `David Tepper is the founder of Appaloosa Management, one of the most successful hedge funds in history. He is known for his aggressive bets on distressed assets and financial stocks during crises.

## Appaloosa Management

Tepper founded Appaloosa in 1993 after leaving Goldman Sachs. The fund has generated average annual returns of approximately 40%, making it one of the best track records in hedge fund history.

## Crisis Investing

Tepper made his biggest gains during financial crises:
- 2009: Made $7 billion betting on bank stocks
- 2010: Earned $2.2 billion personally
- Consistently profits by buying when others panic

## Investment Style

Tepper combines macro views with deep research on individual securities, often taking large, concentrated positions.`,
		philosophy: `"The key is to wait. Sometimes the hardest thing to do is to do nothing."`,
		achievements: [
			'40% average annual returns',
			'Made $7 billion in 2009 crisis bet',
			'One of the highest-paid fund managers ever',
			'Owner of Carolina Panthers NFL team',
			'Consistently successful for 30+ years',
			'Known for massive returns during panics'
		],
		famousTrades: [
			{
				date: '2009',
				asset: 'Bank of America, Citigroup',
				position: 'long',
				outcome: 'Crisis Profits',
				profitLoss: '+$7 Billion',
				description: 'Bought bank stocks when everyone was panicking about financial system collapse.'
			}
		],
		quotes: [
			{ text: 'The key is to wait. Sometimes the hardest thing to do is to do nothing.', source: 'Interview' },
			{ text: 'I\'m telling you, this is a really simple thing. You know, the markets adapt. Humans adapt. Don\'t listen to all the crap out there.', source: 'CNBC Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/David_Tepper' }
		],
		status: 'published'
	},
	{
		name: 'Ken Griffin',
		slug: 'ken-griffin',
		photoUrl: null,
		oneLiner: 'Citadel Founder & Highest Paid Hedge Fund Manager',
		birthYear: 1968,
		nationality: 'American',
		tradingStyle: 'Quantitative Trading',
		netWorth: '$35 Billion',
		bio: `Kenneth Griffin is the founder and CEO of Citadel, one of the world's largest and most successful hedge funds. He started trading from his Harvard dorm room and built a financial empire that includes both Citadel the hedge fund and Citadel Securities, a major market maker.

## From Dorm Room to Empire

Griffin started trading convertible bonds from his Harvard dormitory in 1987. He founded Citadel in 1990 at age 22 with $4.6 million.

## Citadel

Today, Citadel manages over $60 billion and Citadel Securities handles roughly 25% of all U.S. equity trades. The flagship fund has returned 19% annually since inception.

## Investment Approach

Citadel employs:
- Multiple trading strategies
- World-class technology infrastructure
- Quantitative and fundamental analysis
- Global macro and equity market making`,
		philosophy: `"I know the markets are very hard to time. But if you're an investor, you can do quite well in periods of uncertainty."`,
		achievements: [
			'Built Citadel into $60 billion fund',
			'Citadel Securities handles 25% of US equity trades',
			'Started trading in Harvard dorm room',
			'19% annual returns since inception',
			'Highest-paid hedge fund manager multiple years',
			'Major philanthropist in education'
		],
		famousTrades: [
			{
				date: '2022',
				asset: 'Multiple strategies',
				position: 'long',
				outcome: 'Record Year',
				profitLoss: '+38%',
				description: 'Citadel\'s flagship fund returned 38% in 2022 while most funds struggled.'
			}
		],
		quotes: [
			{ text: 'I know the markets are very hard to time. But if you\'re an investor, you can do quite well in periods of uncertainty.', source: 'Interview' },
			{ text: 'Success is the product of hard work, talent, and luck.', source: 'Commencement Speech' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kenneth_C._Griffin' },
			{ platform: 'Citadel', url: 'https://www.citadel.com' }
		],
		status: 'published'
	},
	{
		name: 'Steve Cohen',
		slug: 'steve-cohen',
		photoUrl: null,
		oneLiner: 'SAC Capital Legend & Point72 Founder',
		birthYear: 1956,
		nationality: 'American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$17.5 Billion',
		bio: `Steven A. Cohen is one of the most successful traders in Wall Street history. He founded SAC Capital, which became legendary for its trading prowess and information edge. He now runs Point72 Asset Management.

## SAC Capital

SAC Capital was known for:
- Aggressive short-term trading
- Exceptional information gathering
- High portfolio turnover
- Attracting top trading talent

The fund generated average annual returns of around 30% for over two decades.

## Point72

After SAC, Cohen launched Point72, which manages over $30 billion. He also owns the New York Mets.

## Trading Style

Cohen is known for his ability to:
- Process information quickly
- Make rapid trading decisions
- Manage multiple portfolio managers
- Identify market-moving catalysts`,
		philosophy: `"I don't like to lose. I'm not good at losing. When I lose, I learn from it."`,
		achievements: [
			'30% annual returns at SAC Capital',
			'Built SAC into $14 billion fund',
			'Point72 manages $30+ billion',
			'Owner of New York Mets',
			'One of the great tape readers',
			'Known for exceptional trading instincts'
		],
		famousTrades: [],
		quotes: [
			{ text: 'I don\'t like to lose. I\'m not good at losing. When I lose, I learn from it.', source: 'Interview' },
			{ text: 'I look for situations that have a high probability of being right.', source: '60 Minutes' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Steve_Cohen_(businessman)' },
			{ platform: 'Twitter', url: 'https://twitter.com/StevenACohen2' }
		],
		status: 'published'
	},
	{
		name: 'Nicolas Darvas',
		slug: 'nicolas-darvas',
		photoUrl: null,
		oneLiner: 'Dancer Who Made $2 Million with the Box System',
		birthYear: 1920,
		nationality: 'Hungarian-American',
		tradingStyle: 'Momentum Growth',
		netWorth: '$2 Million (1959)',
		bio: `Nicolas Darvas was a world-famous dancer who turned $25,000 into over $2 million in the stock market while touring the world. His "Darvas Box" system became one of the most influential technical trading methods ever developed.

## The Dancing Trader

Darvas couldn't watch the market during trading hours due to his dance performances across the globe. He developed a system based on weekly telegram updates of stock prices.

## The Darvas Box

His method identified stocks making new highs and forming "boxes" (trading ranges). He would buy when a stock broke out of its box to new highs and sell when it fell below the box.

## Remarkable Results

Between 1957 and 1958, Darvas turned $25,000 into over $2 million—equivalent to about $20 million today.`,
		philosophy: `"I was never afraid of buying high and selling low. I was afraid of buying too low and being stopped out."`,
		achievements: [
			'Turned $25,000 into $2+ million',
			'Developed the Darvas Box system',
			'Traded while touring as a dancer',
			'Wrote bestselling trading book',
			'Pioneer of momentum/breakout trading',
			'Inspired generations of traders'
		],
		famousTrades: [
			{
				date: '1957-1958',
				asset: 'Various Growth Stocks',
				position: 'long',
				outcome: 'Life-Changing',
				profitLoss: '+$2 Million',
				description: 'Used his box system to ride momentum stocks to massive gains while touring as a dancer.'
			}
		],
		quotes: [
			{ text: 'I was never afraid of buying high and selling low. I was afraid of buying too low and being stopped out.', source: 'How I Made $2,000,000 in the Stock Market' },
			{ text: 'There are no good or bad stocks, there are only rising and falling stocks.', source: 'Book' }
		],
		books: [
			{ title: 'How I Made $2,000,000 in the Stock Market', year: 1960, description: 'The classic account of his trading journey' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Nicolas_Darvas' }
		],
		status: 'published'
	},
	{
		name: 'Larry Williams',
		slug: 'larry-williams',
		photoUrl: null,
		oneLiner: 'World Cup Trading Champion with 11,376% Return',
		birthYear: 1942,
		nationality: 'American',
		tradingStyle: 'Options & Technical Analysis',
		netWorth: '$50+ Million',
		bio: `Larry Williams is a legendary futures trader best known for winning the World Cup Championship of Futures Trading in 1987 with an astounding 11,376% return, turning $10,000 into over $1.1 million in just 12 months.

## World Cup Victory

In 1987, Williams entered the Robbins World Cup with $10,000. By year's end, his account had grown to $1,147,607—a return that still stands as one of the most impressive in competition history.

## Technical Indicators

Williams developed several widely-used indicators:
- Williams %R
- Ultimate Oscillator
- Commitment of Traders analysis
- Various cycle indicators

## Trading Career

Larry has been trading since the 1960s and continues to trade and teach today. His daughter, actress Michelle Williams, also briefly competed in the World Cup.`,
		philosophy: `"You make money in the markets by capturing the big move. You have to be willing to let profits run."`,
		achievements: [
			'11,376% return in World Cup 1987',
			'Created Williams %R indicator',
			'Over 50 years of trading',
			'Multiple bestselling books',
			'Developed COT analysis techniques',
			'Continues trading and teaching'
		],
		famousTrades: [
			{
				date: '1987',
				asset: 'Futures',
				position: 'long',
				outcome: 'World Cup Win',
				profitLoss: '+11,376%',
				description: 'Turned $10,000 into $1.1 million in the Robbins World Cup Championship.'
			}
		],
		quotes: [
			{ text: 'You make money in the markets by capturing the big move. You have to be willing to let profits run.', source: 'Interview' },
			{ text: 'The market is always right. The trader who argues with the market will always lose.', source: 'Book' }
		],
		books: [
			{ title: 'Long-Term Secrets to Short-Term Trading', year: 1999, description: 'Comprehensive guide to short-term trading' },
			{ title: 'Trade Stocks & Commodities with the Insiders', year: 2005, description: 'Using COT data for trading edge' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Larry_Williams_(trader)' },
			{ platform: 'Website', url: 'https://www.ireallytrade.com' }
		],
		status: 'published'
	},
	{
		name: 'Victor Sperandeo',
		slug: 'victor-sperandeo',
		photoUrl: null,
		oneLiner: 'Trader Vic - 18 Consecutive Profitable Years',
		birthYear: 1945,
		nationality: 'American',
		tradingStyle: 'Options & Technical Analysis',
		netWorth: '$100+ Million',
		bio: `Victor Sperandeo, known as "Trader Vic," is a Wall Street legend who achieved 18 consecutive profitable years with an average annual return of 72%. His work on trend analysis and market psychology has influenced countless traders.

## Remarkable Consistency

Sperandeo's track record is remarkable for its consistency—18 straight years without a loss. His average annual return of 72% puts him among the most successful traders ever.

## Technical Expertise

Trader Vic is known for:
- 1-2-3 trend reversal pattern
- Trend-following methodology
- Volatility analysis
- Market psychology insights

## Beyond Trading

Sperandeo has worked as a trader, fund manager, and consultant. He is also known for his libertarian economic views and analysis of government policy impacts on markets.`,
		philosophy: `"The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading."`,
		achievements: [
			'18 consecutive profitable years',
			'72% average annual return',
			'Developed 1-2-3 reversal pattern',
			'Author of "Trader Vic" books',
			'Respected technical analyst',
			'Featured in trading publications'
		],
		famousTrades: [],
		quotes: [
			{ text: 'The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading.', source: 'Trader Vic - Methods of a Wall Street Master' },
			{ text: 'The most important rule of trading is to play great defense, not great offense.', source: 'Book' }
		],
		books: [
			{ title: 'Trader Vic - Methods of a Wall Street Master', year: 1991, description: 'His complete trading methodology' },
			{ title: 'Trader Vic II - Principles of Professional Speculation', year: 1994, description: 'Advanced trading concepts' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Victor_Sperandeo' }
		],
		status: 'published'
	},
	{
		name: 'Bill Lipschutz',
		slug: 'bill-lipschutz',
		photoUrl: null,
		oneLiner: 'The Sultan of Currencies - Turned $12,000 into $250 Million',
		birthYear: 1956,
		nationality: 'American',
		tradingStyle: 'Forex & Macro',
		netWorth: '$2+ Billion',
		bio: `Bill Lipschutz is one of the most successful forex traders in history. While still a student at Cornell, he turned a $12,000 inheritance into $250,000, then lost it all—a lesson that shaped his risk management philosophy forever.

## The Cornell Years

Lipschutz inherited $12,000 worth of stock from his grandmother and turned it into $250,000 while studying architecture at Cornell. However, one bad decision wiped out his entire portfolio. This devastating loss taught him the importance of risk management.

## Salomon Brothers

After graduating, Lipschutz joined Salomon Brothers' newly formed forex department. Within a few years, he was generating $300 million per year in profits for the firm—an extraordinary achievement that earned him the nickname "The Sultan of Currencies."

## Trading Philosophy

Lipschutz is known for his ability to synthesize vast amounts of information and his willingness to take large positions when conviction is high. He emphasizes the importance of understanding market psychology and maintaining emotional discipline.`,
		philosophy: `"When you have a position, you put it on for a reason, and you've got to keep it until the reason no longer exists."`,
		achievements: [
			'Generated $300M annually at Salomon Brothers',
			'Turned $12,000 into $250,000 as a student',
			'Co-founder of Hathersage Capital',
			'Featured in "The New Market Wizards"',
			'One of the most successful forex traders ever',
			'Pioneer in institutional forex trading'
		],
		famousTrades: [
			{
				date: '1980s',
				asset: 'Currency Pairs',
				position: 'long',
				outcome: 'Consistent Profits',
				profitLoss: '+$300M/year',
				description: 'Generated approximately $300 million per year for Salomon Brothers through forex trading.'
			}
		],
		quotes: [
			{ text: 'When you have a position, you put it on for a reason, and you\'ve got to keep it until the reason no longer exists.', source: 'The New Market Wizards' },
			{ text: 'I don\'t think you can consistently be a winning trader if you\'re banking on being right more than 50% of the time.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bill_Lipschutz' }
		],
		status: 'published'
	},
	{
		name: 'Jim Rogers',
		slug: 'jim-rogers',
		photoUrl: null,
		oneLiner: 'Co-founder of Quantum Fund with 4,200% Returns',
		birthYear: 1942,
		nationality: 'American',
		tradingStyle: 'Macro & Commodities',
		netWorth: '$300+ Million',
		bio: `Jim Rogers is a legendary investor who co-founded the Quantum Fund with George Soros. The fund returned an astounding 4,200% over 10 years while the S&P 500 rose only 47%. Rogers retired at 37 and has since become famous for his global investment adventures.

## The Quantum Fund

Rogers and Soros founded the Quantum Fund in 1973. Their partnership produced one of the most successful hedge fund track records in history. Rogers handled the research while Soros executed the trades.

## Global Adventures

After retiring, Rogers embarked on two record-setting trips around the world—once by motorcycle and once by car—to research investment opportunities firsthand. These journeys resulted in bestselling books and unique investment insights.

## Commodities Bull

Rogers has been one of the most vocal advocates for commodities investing. He created the Rogers International Commodity Index and has consistently predicted major moves in agricultural and energy markets.`,
		philosophy: `"I just wait until there is money lying in the corner, and all I have to do is go over there and pick it up. I do nothing in the meantime."`,
		achievements: [
			'Co-founded Quantum Fund with Soros',
			'4,200% returns over 10 years',
			'Retired at age 37',
			'Created Rogers International Commodity Index',
			'Two Guinness World Record trips',
			'Bestselling author'
		],
		famousTrades: [
			{
				date: '1973-1980',
				asset: 'Quantum Fund',
				position: 'long',
				outcome: 'Legendary Returns',
				profitLoss: '+4,200%',
				description: 'Co-managed Quantum Fund to extraordinary returns while S&P 500 gained only 47%.'
			}
		],
		quotes: [
			{ text: 'I just wait until there is money lying in the corner, and all I have to do is go over there and pick it up.', source: 'Interview' },
			{ text: 'If you want to be rich, you must learn to be patient.', source: 'Investment Biker' }
		],
		books: [
			{ title: 'Investment Biker', year: 1994, description: 'Around the world on a motorcycle' },
			{ title: 'Adventure Capitalist', year: 2003, description: 'The ultimate road trip' },
			{ title: 'Hot Commodities', year: 2004, description: 'How anyone can invest profitably in commodities' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jim_Rogers' }
		],
		status: 'published'
	},
	{
		name: 'John Paulson',
		slug: 'john-paulson',
		photoUrl: null,
		oneLiner: 'Made $15 Billion Betting Against Subprime Mortgages',
		birthYear: 1955,
		nationality: 'American',
		tradingStyle: 'Event-Driven & Macro',
		netWorth: '$3+ Billion',
		bio: `John Paulson made the greatest trade in financial history by betting against subprime mortgages before the 2008 financial crisis. His fund made $15 billion in profits, with Paulson personally earning $4 billion in a single year.

## The Greatest Trade Ever

In 2005-2006, Paulson recognized that the housing market was a bubble built on unsustainable subprime lending. He created a fund specifically to short subprime mortgage securities through credit default swaps.

## Historic Profits

When the housing market collapsed in 2007-2008, Paulson's bet paid off spectacularly. His funds gained $15 billion, making it the largest one-year profit in financial history. The trade was chronicled in Gregory Zuckerman's book "The Greatest Trade Ever."

## Investment Philosophy

Paulson's approach combines deep fundamental research with the patience to wait for asymmetric opportunities. He looks for situations where the downside is limited but the upside is enormous.`,
		philosophy: `"Many investors make the mistake of buying high and selling low while the exact opposite is the right strategy."`,
		achievements: [
			'$15 billion profit from subprime short',
			'$4 billion personal earnings in 2007',
			'Subject of "The Greatest Trade Ever"',
			'Founded Paulson & Co. in 1994',
			'Peak AUM of $38 billion',
			'One of the most successful macro trades ever'
		],
		famousTrades: [
			{
				date: '2007-2008',
				asset: 'Subprime Mortgages (CDS)',
				position: 'short',
				outcome: 'Historic Profit',
				profitLoss: '+$15 Billion',
				description: 'Shorted subprime mortgage securities through credit default swaps, generating the largest single-year profit in hedge fund history.'
			}
		],
		quotes: [
			{ text: 'Many investors make the mistake of buying high and selling low while the exact opposite is the right strategy.', source: 'Interview' },
			{ text: 'The key to success is to identify trends early and position yourself accordingly.', source: 'Conference' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/John_Paulson' }
		],
		status: 'published'
	},
	{
		name: 'Michael Marcus',
		slug: 'michael-marcus',
		photoUrl: null,
		oneLiner: 'Turned $30,000 into $80 Million in 20 Years',
		birthYear: 1949,
		nationality: 'American',
		tradingStyle: 'Commodities & Futures',
		netWorth: '$100+ Million',
		bio: `Michael Marcus is a legendary commodities trader who turned $30,000 into $80 million over a 20-year period. He was one of the original "Market Wizards" and mentored many successful traders including Bruce Kovner.

## Early Career

Marcus started trading while working as an analyst at a commodities research firm. His early years were marked by both spectacular gains and devastating losses, teaching him crucial lessons about risk management.

## Commodities Corporation

Marcus joined Commodities Corporation, a legendary trading firm that incubated many future trading stars. There, he developed his approach to trend following and position sizing.

## Mentorship Legacy

Beyond his own trading success, Marcus is known for mentoring Bruce Kovner, who went on to become one of the world's most successful macro traders. This mentorship chain demonstrates the importance of learning from experienced traders.`,
		philosophy: `"Every trader has strengths and weaknesses. Some are good holders of winners but may hold their losers a little too long. Others may cut their losses well but sell their winners too quickly."`,
		achievements: [
			'Turned $30,000 into $80 million',
			'Featured in original "Market Wizards"',
			'Mentored Bruce Kovner',
			'Pioneer at Commodities Corporation',
			'20+ years of successful trading',
			'Influential in commodities trading'
		],
		famousTrades: [
			{
				date: '1970s-1990s',
				asset: 'Commodities',
				position: 'long',
				outcome: 'Exceptional Returns',
				profitLoss: '+$80 Million',
				description: 'Built $30,000 into $80 million through disciplined commodities trading over two decades.'
			}
		],
		quotes: [
			{ text: 'Every trader has strengths and weaknesses. Some are good holders of winners but may hold their losers a little too long.', source: 'Market Wizards' },
			{ text: 'The best trades are the ones in which you have all three things going for you: fundamentals, technicals, and market tone.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Michael_Marcus_(trader)' }
		],
		status: 'published'
	},
	{
		name: 'Andy Krieger',
		slug: 'andy-krieger',
		photoUrl: null,
		oneLiner: 'Made $300 Million Shorting the New Zealand Dollar',
		birthYear: 1956,
		nationality: 'American',
		tradingStyle: 'Forex & Macro',
		netWorth: '$100+ Million',
		bio: `Andy Krieger is famous for one of the most aggressive currency trades in history. In 1987, he shorted the New Zealand dollar with such size that his position exceeded New Zealand's entire money supply.

## The Kiwi Trade

After the 1987 stock market crash, Krieger identified the New Zealand dollar as overvalued. Working at Bankers Trust, he took a massive short position using options—reportedly worth more than New Zealand's entire money supply.

## Legendary Profits

The trade generated approximately $300 million in profits for Bankers Trust. Krieger's bonus of $3 million was considered inadequate given his contribution, leading him to leave the firm.

## Trading Approach

Krieger is known for his aggressive use of leverage and options to express macro views. His willingness to take enormous positions when conviction is high sets him apart from more conservative traders.`,
		philosophy: `"When you see an opportunity, you have to be willing to bet big. The biggest mistake is not sizing up when you're right."`,
		achievements: [
			'$300 million profit on NZD short',
			'Position exceeded NZ money supply',
			'Worked at Bankers Trust and Soros Fund',
			'Pioneer in currency options trading',
			'One of the most aggressive forex trades ever',
			'Featured in trading literature'
		],
		famousTrades: [
			{
				date: '1987',
				asset: 'New Zealand Dollar',
				position: 'short',
				outcome: 'Massive Profit',
				profitLoss: '+$300 Million',
				description: 'Shorted the New Zealand dollar with a position larger than the country\'s entire money supply after the 1987 crash.'
			}
		],
		quotes: [
			{ text: 'When you see an opportunity, you have to be willing to bet big.', source: 'Interview' },
			{ text: 'The currency markets are the most efficient way to express a macro view.', source: 'Trading Conference' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Andy_Krieger' }
		],
		status: 'published'
	},
	{
		name: 'Bruce Kovner',
		slug: 'bruce-kovner',
		photoUrl: null,
		oneLiner: 'From Taxi Driver to Billionaire Macro Trader',
		birthYear: 1945,
		nationality: 'American',
		tradingStyle: 'Macro & Forex',
		netWorth: '$6.6 Billion',
		bio: `Bruce Kovner went from driving a taxi to becoming one of the world's most successful macro traders. He founded Caxton Associates, which at its peak managed over $14 billion and generated average annual returns of 21% over 28 years.

## Humble Beginnings

Kovner was driving a taxi and taking odd jobs when he made his first trade—a soybean futures contract purchased with a $3,000 cash advance on his credit card. That trade eventually turned into $45,000.

## Caxton Associates

In 1983, Kovner founded Caxton Associates. The fund became one of the most successful macro hedge funds in history, known for its ability to profit in any market environment through currency, interest rate, and commodity trades.

## Mentorship

Kovner was mentored by Michael Marcus at Commodities Corporation. He has since become a mentor himself and is known for his analytical approach to global macro trading.`,
		philosophy: `"Undertake each trade with a clear plan for getting out if you're wrong. The inability to deal with losses is the most common cause of trading failure."`,
		achievements: [
			'Founded Caxton Associates',
			'21% average annual returns over 28 years',
			'Peak AUM of $14 billion',
			'Turned $3,000 into billions',
			'Featured in "Market Wizards"',
			'Major philanthropist'
		],
		famousTrades: [
			{
				date: '1977',
				asset: 'Soybean Futures',
				position: 'long',
				outcome: 'First Big Win',
				profitLoss: '+$45,000',
				description: 'First trade using $3,000 credit card advance eventually grew to $45,000, launching his trading career.'
			}
		],
		quotes: [
			{ text: 'Undertake each trade with a clear plan for getting out if you\'re wrong.', source: 'Market Wizards' },
			{ text: 'The inability to deal with losses is the most common cause of trading failure.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bruce_Kovner' }
		],
		status: 'published'
	},
	{
		name: 'Nick Leeson',
		slug: 'nick-leeson',
		photoUrl: null,
		oneLiner: 'The Rogue Trader Who Broke Barings Bank',
		birthYear: 1967,
		nationality: 'British',
		tradingStyle: 'Derivatives & Arbitrage',
		netWorth: 'N/A',
		bio: `Nick Leeson is the infamous trader whose unauthorized speculative trades caused the collapse of Barings Bank, Britain's oldest merchant bank. His story serves as a cautionary tale about risk management and oversight failures.

## Rise at Barings

Leeson joined Barings Bank and was sent to Singapore to manage arbitrage operations. Initially successful, he began hiding losses in a secret account numbered 88888.

## The Collapse

After the 1995 Kobe earthquake, Leeson's hidden losses spiraled out of control. His positions lost £827 million ($1.3 billion), exceeding Barings' entire capital and causing the 233-year-old bank to collapse.

## Lessons Learned

Leeson's story highlights the dangers of inadequate risk controls, the importance of separating trading from back-office functions, and how small losses can compound into catastrophic ones when hidden.`,
		philosophy: `"I was gambling, not trading. The moment you start hiding losses, you've already lost."`,
		achievements: [
			'Cautionary tale in risk management',
			'Subject of book and film "Rogue Trader"',
			'Caused collapse of 233-year-old bank',
			'£827 million in losses',
			'Changed banking risk management globally',
			'Now a speaker on risk and ethics'
		],
		famousTrades: [
			{
				date: '1995',
				asset: 'Nikkei Futures',
				position: 'long',
				outcome: 'Catastrophic Loss',
				profitLoss: '-£827 Million',
				description: 'Unauthorized positions in Nikkei futures collapsed after the Kobe earthquake, destroying Barings Bank.'
			}
		],
		quotes: [
			{ text: 'I was gambling, not trading. The moment you start hiding losses, you\'ve already lost.', source: 'Rogue Trader' },
			{ text: 'The physical act of hiding the losses was easy. Living with it was the hard part.', source: 'Interview' }
		],
		books: [
			{ title: 'Rogue Trader', year: 1996, description: 'His account of the Barings collapse' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Nick_Leeson' }
		],
		status: 'published'
	},
	{
		name: 'Bill Gross',
		slug: 'bill-gross',
		photoUrl: null,
		oneLiner: 'The Bond King - Built PIMCO into $2 Trillion Giant',
		birthYear: 1944,
		nationality: 'American',
		tradingStyle: 'Fixed Income & Bonds',
		netWorth: '$1.5 Billion',
		bio: `Bill Gross is known as "The Bond King" for his unparalleled success in fixed income investing. He co-founded PIMCO and built it into the world's largest bond fund manager with over $2 trillion in assets.

## PIMCO Years

Gross co-founded Pacific Investment Management Company (PIMCO) in 1971. Under his leadership, the PIMCO Total Return Fund became the world's largest mutual fund, and Gross became the most influential voice in bond markets.

## Investment Approach

Gross pioneered "total return" bond investing, which focuses on capital appreciation in addition to yield. His monthly investment outlooks became required reading for fixed income investors worldwide.

## Later Career

After leaving PIMCO in 2014, Gross joined Janus Henderson. He retired from active fund management in 2019, leaving behind a legacy as the most successful bond investor in history.`,
		philosophy: `"Finding the best person or the best organization to invest your money is one of the most important financial decisions you'll ever make."`,
		achievements: [
			'Co-founded PIMCO',
			'Built largest bond fund ($2T+ AUM)',
			'Known as "The Bond King"',
			'Pioneered total return investing',
			'Morningstar Fixed Income Manager of Decade',
			'Influential market commentator'
		],
		famousTrades: [
			{
				date: '2011',
				asset: 'US Treasuries',
				position: 'short',
				outcome: 'Missed Rally',
				profitLoss: 'Underperformed',
				description: 'Famously bet against US Treasuries expecting rates to rise, but QE2 pushed bonds higher.'
			}
		],
		quotes: [
			{ text: 'Finding the best person or the best organization to invest your money is one of the most important financial decisions you\'ll ever make.', source: 'Investment Outlook' },
			{ text: 'The bond market is far more important than the stock market.', source: 'Interview' }
		],
		books: [
			{ title: 'Bill Gross on Investing', year: 1998, description: 'His approach to bond investing' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bill_Gross' }
		],
		status: 'published'
	},
	{
		name: 'Joe Lewis',
		slug: 'joe-lewis',
		photoUrl: null,
		oneLiner: 'Partnered with Soros to Break the Bank of England',
		birthYear: 1937,
		nationality: 'British',
		tradingStyle: 'Forex & Macro',
		netWorth: '$6+ Billion',
		bio: `Joe Lewis is a British businessman and currency trader who partnered with George Soros in the famous 1992 trade that broke the Bank of England. He built his fortune through currency trading and has since diversified into numerous businesses.

## Black Wednesday

In 1992, Lewis worked alongside George Soros to short the British pound. When the UK was forced to withdraw from the European Exchange Rate Mechanism, Lewis reportedly made over $1 billion in profits.

## Business Empire

Lewis has used his trading profits to build a diverse business empire including the Tavistock Group, which owns hotels, restaurants, and sports teams including Tottenham Hotspur Football Club.

## Private Trader

Unlike many famous traders, Lewis maintains an extremely low profile. He conducts most of his trading from his yacht and rarely gives interviews.`,
		philosophy: `"Stay patient, stay private, and strike when the opportunity is overwhelming."`,
		achievements: [
			'Partnered with Soros on pound short',
			'$1+ billion from Black Wednesday',
			'Owner of Tottenham Hotspur',
			'Built Tavistock Group empire',
			'One of UK\'s wealthiest individuals',
			'Successful currency trader for decades'
		],
		famousTrades: [
			{
				date: '1992',
				asset: 'British Pound',
				position: 'short',
				outcome: 'Massive Profit',
				profitLoss: '+$1 Billion',
				description: 'Partnered with George Soros to short the British pound on Black Wednesday.'
			}
		],
		quotes: [
			{ text: 'Stay patient, stay private, and strike when the opportunity is overwhelming.', source: 'Attributed' },
			{ text: 'The best trades are the ones where the risk-reward is so obvious that you have to act.', source: 'Interview' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Joe_Lewis_(businessman)' }
		],
		status: 'published'
	},
	{
		name: 'Michael Burry',
		slug: 'michael-burry',
		photoUrl: null,
		oneLiner: 'The Big Short - Predicted the 2008 Housing Crash',
		birthYear: 1971,
		nationality: 'American',
		tradingStyle: 'Value Investing & Macro',
		netWorth: '$300+ Million',
		bio: `Michael Burry is the hedge fund manager who famously predicted and profited from the 2008 subprime mortgage crisis. His story was chronicled in Michael Lewis's book "The Big Short" and the subsequent Academy Award-winning film.

## Scion Capital

Burry founded Scion Capital in 2000 after working as a physician. His deep-value investing approach and independent research led him to discover the housing bubble before almost anyone else.

## The Big Short

Starting in 2005, Burry began purchasing credit default swaps against subprime mortgage bonds. Despite pressure from investors to abandon the trade, he held firm. When the housing market collapsed, Scion Capital's returns exceeded 489%.

## Unique Perspective

Burry has Asperger's syndrome, which he credits for his ability to focus intensely on data and see patterns others miss. He continues to make contrarian calls that often prove prescient.`,
		philosophy: `"I look for value wherever it can be found. I don't care what the crowd thinks."`,
		achievements: [
			'489% returns from subprime short',
			'Subject of "The Big Short"',
			'Founded Scion Capital',
			'Predicted 2008 financial crisis',
			'Pioneered CDS against mortgage bonds',
			'Continues making prescient calls'
		],
		famousTrades: [
			{
				date: '2005-2008',
				asset: 'Subprime Mortgage CDS',
				position: 'short',
				outcome: 'Legendary Profit',
				profitLoss: '+489%',
				description: 'Purchased credit default swaps against subprime mortgages years before the housing crash, generating extraordinary returns.'
			}
		],
		quotes: [
			{ text: 'I look for value wherever it can be found. I don\'t care what the crowd thinks.', source: 'Interview' },
			{ text: 'The late 90s almost forced me to identify myself as a value investor.', source: 'Letter to Investors' }
		],
		books: [],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/michaeljburry' },
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Michael_Burry' }
		],
		status: 'published'
	},
	{
		name: 'Peter Schiff',
		slug: 'peter-schiff',
		photoUrl: null,
		oneLiner: 'Predicted 2008 Crisis - Gold Bug & Austrian Economist',
		birthYear: 1963,
		nationality: 'American',
		tradingStyle: 'Macro & Commodities',
		netWorth: '$70+ Million',
		bio: `Peter Schiff is an economist, financial commentator, and CEO of Euro Pacific Capital. He gained fame for accurately predicting the 2008 financial crisis and is known for his bearish views on the US dollar and bullish stance on gold.

## Prescient Predictions

Schiff became famous for his appearances on financial television in 2006-2007 where he predicted the housing bubble and subsequent financial crisis. His warnings were often mocked by other commentators who later proved wrong.

## Investment Philosophy

Schiff advocates for Austrian economics and believes in hard assets like gold and foreign stocks over US dollar-denominated assets. He has consistently warned about US debt levels and monetary policy.

## Media Presence

Through his podcast, books, and frequent media appearances, Schiff has become one of the most recognized voices in contrarian investing and sound money advocacy.`,
		philosophy: `"The government can't give you anything it doesn't first take from someone else."`,
		achievements: [
			'Predicted 2008 financial crisis',
			'CEO of Euro Pacific Capital',
			'Bestselling author',
			'Popular financial commentator',
			'Advocate for sound money',
			'Ran for US Senate in 2010'
		],
		famousTrades: [
			{
				date: '2006-2008',
				asset: 'Gold & Foreign Stocks',
				position: 'long',
				outcome: 'Crisis Protection',
				profitLoss: 'Outperformed',
				description: 'Positioned clients in gold and foreign assets ahead of the 2008 crisis, protecting against dollar weakness.'
			}
		],
		quotes: [
			{ text: 'The government can\'t give you anything it doesn\'t first take from someone else.', source: 'The Peter Schiff Show' },
			{ text: 'Gold is money. Everything else is credit.', source: 'Interview' }
		],
		books: [
			{ title: 'Crash Proof', year: 2007, description: 'How to profit from the coming economic collapse' },
			{ title: 'The Real Crash', year: 2012, description: 'America\'s coming bankruptcy' }
		],
		socialLinks: [
			{ platform: 'Twitter', url: 'https://twitter.com/PeterSchiff' },
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Peter_Schiff' }
		],
		status: 'published'
	},
	{
		name: 'Simon Cawkwell',
		slug: 'simon-cawkwell',
		photoUrl: null,
		oneLiner: 'Evil Knievil - Britain\'s Most Famous Short Seller',
		birthYear: 1946,
		nationality: 'British',
		tradingStyle: 'Short Selling',
		netWorth: '$50+ Million',
		bio: `Simon Cawkwell, known by his trading pseudonym "Evil Knievil," is Britain's most famous short seller. He has made millions by identifying overvalued and fraudulent companies, often facing legal threats and public criticism for his bearish calls.

## The Evil Knievil Persona

Cawkwell adopted the "Evil Knievil" moniker as a play on the famous stuntman's name. The persona reflects his willingness to take dangerous positions against popular stocks and face the wrath of company management.

## Famous Shorts

Cawkwell has successfully shorted numerous companies that later collapsed, including Northern Rock before the 2008 crisis. His research often uncovers accounting irregularities and business model flaws.

## Controversial Figure

Short sellers are often vilified, and Cawkwell has faced his share of criticism. However, he argues that short sellers perform a valuable service by identifying overvalued and fraudulent companies.`,
		philosophy: `"The market is full of overvalued rubbish. My job is to find it and profit when reality catches up."`,
		achievements: [
			'Britain\'s most famous short seller',
			'Shorted Northern Rock before collapse',
			'Decades of successful short selling',
			'Uncovered numerous frauds',
			'Known as "Evil Knievil"',
			'Influential market commentator'
		],
		famousTrades: [
			{
				date: '2007',
				asset: 'Northern Rock',
				position: 'short',
				outcome: 'Major Profit',
				profitLoss: 'Significant',
				description: 'Shorted Northern Rock before its collapse and subsequent nationalization during the financial crisis.'
			}
		],
		quotes: [
			{ text: 'The market is full of overvalued rubbish. My job is to find it and profit when reality catches up.', source: 'Interview' },
			{ text: 'Short sellers are the market\'s immune system.', source: 'Financial Times' }
		],
		books: [
			{ title: 'Evil\'s Good: A Worse-Selling Book', year: 2012, description: 'His approach to short selling' }
		],
		socialLinks: [
			{ platform: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Simon_Cawkwell' }
		],
		status: 'published'
	}
];
