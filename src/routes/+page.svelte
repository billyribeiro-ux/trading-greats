<script lang="ts">
    import { slide } from 'svelte/transition';
    import SEO from '#lib/components/SEO.svelte';
    import QuoteOfTheDay from '#lib/components/QuoteOfTheDay.svelte';
    import { Icon, type IconName } from '#lib/components/icons/index.ts';
    import JsonLdScript from '#lib/components/JsonLdScript.svelte';
    import { PUBLIC_SITE_URL as configuredSiteUrl } from '$app/env/public';
    import type { PageData } from './$types';

    const PUBLIC_SITE_URL = configuredSiteUrl || 'https://tradinggreats.com';

    let { data }: { data: PageData } = $props();

    let openFaq = $state<number | null>(null);

    // ============================================================================
    // DERIVED DATA
    // ============================================================================
    const displayTraders = $derived(data.traders.slice(0, 8).map((t) => ({
        name: t.name,
        style: t.tradingStyle || 'Trading',
        knownFor: t.oneLiner || 'Legendary Trader',
        returns: t.netWorth || 'Exceptional',
        slug: t.slug,
        photoUrl: t.photoUrl
        }))
    );

    // ============================================================================
    // STATIC DATA CONSTANTS
    // ============================================================================
    const strategies = [
        {
            name: 'Value Investing',
            icon: 'trending-up' as IconName,
            color: 'text-emerald-400',
            traders: ['Warren Buffett', 'Benjamin Graham', 'Carl Icahn'],
            description: 'Build lasting wealth through disciplined analysis of intrinsic value.'
        },
        {
            name: 'Momentum Growth',
            icon: 'zap' as IconName,
            color: 'text-violet-400',
            traders: ['Mark Minervini', 'William O\'Neil', 'Jesse Livermore'],
            description: 'Capture explosive moves with precision timing and trend analysis.'
        },
        {
            name: 'Macro & Currency',
            icon: 'globe' as IconName,
            color: 'text-sky-400',
            traders: ['George Soros', 'Ray Dalio', 'Paul Tudor Jones'],
            description: 'Navigate global markets through economic and geopolitical insight.'
        },
        {
            name: 'Options & Technical',
            filter: 'Options',
            icon: 'line-chart' as IconName,
            color: 'text-amber-400',
            traders: ['John Carter', 'Linda Raschke', 'Larry Williams'],
            description: 'Master chart patterns and derivatives for consistent edge.'
        }
    ];

    const faqItems = [
        {
            question: 'Is Trading Greats free to use?',
            answer: 'Yes. All trader profiles, strategies, and educational content are completely free to access. Our mission is to democratize access to world-class trading education.'
        },
        {
            question: 'How do you select which traders to feature?',
            answer: 'We feature traders with documented, verifiable track records spanning multiple market cycles. Each profile represents decades of proven methodology, not short-term luck.'
        },
        {
            question: 'Can I suggest a trader to be featured?',
            answer: 'You can email a suggestion to hello@tradinggreats.com.'
        },
        {
            question: 'Is this financial advice?',
            answer: 'No. Trading Greats is educational content only. All trading involves risk, and past performance does not guarantee future results. Always do your own research and consult with a financial advisor.'
        },
        {
            question: 'How often do you add new traders?',
            answer: 'The library grows as new profiles and material become available.'
        },
        {
            question: 'Can I compare different trading strategies?',
            answer: 'Yes! Our Compare feature allows you to view up to 4 traders side-by-side, comparing their trading styles, philosophies, net worth, and key achievements.'
        },
        {
            question: 'Do you cover modern traders or just historical figures?',
            answer: 'We cover both. Our library includes historical legends like Jesse Livermore and Benjamin Graham, as well as contemporary masters like Billy Ribeiro, Mark Minervini, and Ray Dalio.'
        },
        {
            question: 'How can I apply these strategies to my own trading?',
            answer: 'Each trader profile includes actionable lessons and key principles. Start by identifying a trading style that matches your personality, then study the specific methodologies and risk management approaches used by masters of that style.'
        }
    ];

    // ============================================================================
    // JSON-LD CONSTRUCTION (Reactive to data changes)
    // ============================================================================
    const schemaOrg = $derived({
        faq: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map((item) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        },
        list: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "@id": `${PUBLIC_SITE_URL}/#featured-traders`,
            "name": "Featured Trading Legends",
            "description": "Profiles of the worlds greatest traders and their proven strategies",
            "numberOfItems": data.traders.length,
            "isPartOf": { "@id": `${PUBLIC_SITE_URL}/#website` },
            "itemListElement": data.traders.map((t, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": t.name,
                "url": `${PUBLIC_SITE_URL}/traders/${t.slug}`
            }))
        }
    });
</script>

<SEO
    title={data.meta.title}
    description={data.meta.description}
    keywords={['trading strategies', 'Warren Buffett', 'value investing', 'momentum trading', 'George Soros', 'trading education', 'stock market', 'investment strategies', 'legendary traders', 'trading methodology']}
/>

<svelte:head>
    <JsonLdScript data={schemaOrg.faq} />
    <JsonLdScript data={schemaOrg.list} />
</svelte:head>

<div class="home-page">
    <section class="hero" aria-labelledby="hero-title">
        <div class="home-container hero-grid">
            <div class="hero-copy">
                <p class="eyebrow"><span></span> An independent trading library</p>
                <h1 id="hero-title">Study the people<br />behind the <em>markets.</em></h1>
                <p class="hero-intro">Explore the ideas, decisions, and disciplines of the traders and investors who shaped the way we understand markets.</p>
                <div class="hero-actions">
                    <a class="action action-primary" href="/traders">Explore the library <Icon name="arrow-right" class="h-4 w-4" /></a>
                    <a class="action action-secondary" href="/compare">Compare traders <Icon name="arrow-right" class="h-4 w-4" /></a>
                </div>
                <div class="hero-note"><span>01 / THE LIBRARY</span><p>People. Principles. Perspective.</p></div>
            </div>
            <div class="hero-visual" aria-label="Featured traders">
                <div class="visual-top"><span>TRADING GREATS</span><span>THE PEOPLE BEHIND THE MARKETS</span></div>
                <div class="hero-portraits">
                    {#each displayTraders.slice(0, 3) as trader, i (trader.slug)}
                        <a href="/traders/{trader.slug}" class="hero-person" aria-label="Explore {trader.name}'s profile">
                            {#if trader.photoUrl}<img src={trader.photoUrl} alt="" loading={i === 0 ? 'eager' : 'lazy'} />{/if}
                            <span class="person-index">0{i + 1}</span>
                            <span class="person-label">{trader.name}<small>{trader.style}</small></span>
                        </a>
                    {/each}
                </div>
                <div class="visual-bottom"><span>A REFERENCE FOR CURIOUS MINDS</span><span>FOR THE LONG VIEW</span></div>
            </div>
        </div>
    </section>

    <section class="intro-section" aria-labelledby="intro-title">
        <div class="home-container intro-grid">
            <div><p class="eyebrow">THE PURPOSE</p><h2 id="intro-title">Perspective built<br /><em>over time.</em></h2></div>
            <div class="intro-copy"><p>Markets change. The value of understanding how great traders think does not.</p><p>Go beyond the headlines and explore the people, approaches, and defining decisions behind a range of market philosophies.</p></div>
        </div>
        <div class="home-container principles">
            <article><span>01</span><h3>Know the person</h3><p>Explore the experiences that shaped each trader’s approach.</p></article>
            <article><span>02</span><h3>Understand the process</h3><p>Study the ideas, methods, and decisions behind their work.</p></article>
            <article><span>03</span><h3>Find perspective</h3><p>Compare different schools of thought and draw your own lessons.</p></article>
        </div>
    </section>

    <section class="featured-section" aria-labelledby="featured-title">
        <div class="home-container">
            <div class="section-heading"><div><p class="eyebrow">SELECTED PROFILES <span>/ 01</span></p><h2 id="featured-title">Meet the <em>greats.</em></h2><p>Get to know the people and principles behind the trades.</p></div><a class="text-link" href="/traders">View all profiles <Icon name="arrow-right" class="h-4 w-4" /></a></div>
            <div class="featured-grid">
                {#each displayTraders.slice(0, 4) as trader, i (trader.slug)}
                    <a class="featured-card" href="/traders/{trader.slug}">
                        <div class="featured-image"><span class="image-number">0{i + 1}</span>{#if trader.photoUrl}<img src={trader.photoUrl} alt="" loading="lazy" onerror={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} />{:else}<span class="image-initials">{trader.name.split(' ').map((n: string) => n[0]).join('')}</span>{/if}</div>
                        <div class="featured-details"><span class="card-type">{trader.style}</span><h3>{trader.name}</h3><p>{trader.knownFor}</p><span class="card-arrow" aria-hidden="true">↗</span></div>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <QuoteOfTheDay quotes={data.allQuotes} />

    <section class="approaches-section" id="how-it-works" aria-labelledby="approaches-title">
        <div class="home-container">
            <div class="section-heading"><div><p class="eyebrow">A WORLD OF APPROACHES <span>/ 02</span></p><h2 id="approaches-title">Different paths.<br /><em>Enduring ideas.</em></h2><p>Find an approach that speaks to the way you think about markets.</p></div><a class="text-link" href="/traders">Explore all traders <Icon name="arrow-right" class="h-4 w-4" /></a></div>
            <div class="approach-grid">
                {#each strategies as strategy, i (strategy.name)}
                    <a class="approach-card" href="/traders?style={encodeURIComponent(strategy.filter || strategy.name)}"><div class="approach-top"><span>0{i + 1}</span><span aria-hidden="true">↗</span></div><h3>{strategy.name}</h3><p>{strategy.description}</p><div class="approach-names">{strategy.traders.slice(0, 2).join('  /  ')}</div></a>
                {/each}
            </div>
        </div>
    </section>

    <section class="library-section" aria-labelledby="library-title">
        <div class="home-container">
            <div class="section-heading"><div><p class="eyebrow">THE LIBRARY <span>/ 03</span></p><h2 id="library-title">Decades of <em>market wisdom.</em></h2><p>Every profile is a starting point for a deeper study.</p></div><a class="text-link" href="/traders">View the complete library <Icon name="arrow-right" class="h-4 w-4" /></a></div>
            <div class="library-grid">
                {#each displayTraders as trader (trader.slug)}
                    <a href="/traders/{trader.slug}" class="library-card">
                        <div class="library-avatar"><span>{trader.name.split(' ').map((n: string) => n[0]).join('')}</span>{#if trader.photoUrl}<img src={trader.photoUrl} alt="" loading="lazy" onerror={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} />{/if}</div>
                        <div class="library-info"><h3>{trader.name}</h3><p>{trader.style}</p></div><span class="library-arrow" aria-hidden="true">↗</span>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <section class="questions-section" aria-labelledby="questions-title">
        <div class="home-container questions-grid"><div><p class="eyebrow">GETTING STARTED</p><h2 id="questions-title">A few good<br /><em>questions.</em></h2><p>Everything you need to begin exploring the library.</p></div>
            <div class="questions-list">
                {#each faqItems as faq, i (faq.question)}
                    <div class="question"><button type="button" aria-expanded={openFaq === i} onclick={() => { openFaq = openFaq === i ? null : i; }}><span>{faq.question}</span><span aria-hidden="true">{openFaq === i ? '−' : '+'}</span></button>{#if openFaq === i}<p transition:slide={{ duration: 180 }}>{faq.answer}</p>{/if}</div>
                {/each}
            </div>
        </div>
    </section>
    <section class="closing-section"><div class="home-container closing-inner"><div><p class="eyebrow">THE LONG VIEW</p><h2>There is always<br /><em>more to learn.</em></h2><p>Start with a profile. Follow an idea. Build your perspective.</p></div><a class="action action-primary" href="/traders">Explore the library <Icon name="arrow-right" class="h-4 w-4" /></a></div></section>
</div>

<style>
.home-page { --page-bg: #0b121b; --page-panel: #101b27; --page-line: rgba(218, 222, 219, .14); --page-text: #f3f1eb; --page-muted: #aeb9c0; --page-gold: #c9ad7d; background: var(--page-bg); color: var(--page-text); }
.home-page :global(a) { text-decoration: none; }
.home-container { width: min(100% - 3rem, var(--layout-max, 99rem)); margin-inline: auto; }
.hero { position: relative; overflow: hidden; padding: clamp(8rem, 13vw, 12rem) 0 clamp(4.5rem, 8vw, 8rem); background: radial-gradient(ellipse at 75% 10%, #1d2b36 0, #0d1721 38%, #0b121b 72%); }
.hero-grid { display: grid; gap: 4rem; align-items: center; }
.eyebrow { display: flex; align-items: center; gap: .75rem; color: var(--page-gold); font-size: .7rem; font-weight: 700; letter-spacing: .17em; text-transform: uppercase; }
.eyebrow span { color: var(--page-muted); } .hero-copy .eyebrow span { width: 2rem; height: 1px; background: var(--page-gold); }
h1,h2,h3,p { margin: 0; } h1,h2 { font-family: 'Playfair Display', Georgia, serif; font-weight: 400; letter-spacing: -.04em; }
h1 { margin-top: 1.7rem; font-size: clamp(2.9rem, 5.8vw + 1rem, 6rem); line-height: 1.06; }
em { color: var(--page-gold); font-weight: 400; }
.hero-intro { max-width: 35rem; margin-top: 1.7rem; color: #b7c1c7; font-size: clamp(1.05rem, .45vw + 1rem, 1.2rem); line-height: 1.75; }
.hero-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2.2rem; }
.action { min-height: 3.35rem; display: inline-flex; align-items: center; justify-content: center; gap: 1.25rem; padding: .85rem 1.3rem; border: 1px solid #c9ad7d; font-size: .875rem; font-weight: 700; transition: background .2s, color .2s, border-color .2s; }
.action-primary { background: #c9ad7d; color: #111b23; } .action-primary:hover { background: #e0c99e; border-color: #e0c99e; } .action-secondary { color: #e7e9e7; border-color: #52606a; } .action-secondary:hover { border-color: #c9ad7d; }
.hero-note { display: flex; gap: 1.5rem; align-items: center; margin-top: 3.5rem; border-top: 1px solid var(--page-line); padding-top: 1.2rem; font-size: .7rem; letter-spacing: .13em; color: #c9ad7d; } .hero-note p { color: #9aa8af; letter-spacing: .02em; }
.hero-visual { border: 1px solid rgba(201, 173, 125, .3); background: #101d27; padding: .85rem; box-shadow: 0 30px 80px rgba(0,0,0,.2); }
.visual-top,.visual-bottom { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem .25rem .85rem; color: #c2ad8b; font-size: .57rem; font-weight: 700; letter-spacing: .13em; } .visual-bottom { padding: .85rem .25rem .4rem; color: #84939a; }
.hero-portraits { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: .25rem; }
.hero-person { position: relative; min-width: 0; aspect-ratio: 3 / 5; overflow: hidden; background: linear-gradient(160deg,#36454e,#172631); }
.hero-person:after { content: ''; position: absolute; inset: 35% 0 0; background: linear-gradient(transparent, rgba(8,16,23,.93)); pointer-events: none; }
.hero-person img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform .4s ease; } .hero-person:hover img { transform: scale(1.025); }
.person-index { position: absolute; z-index: 1; top: .8rem; left: .8rem; color: #e2d8c8; font-size: .65rem; letter-spacing: .15em; }.person-label { position: absolute; z-index: 1; bottom: 1rem; left: .8rem; right: .5rem; color: white; font-size: clamp(.72rem, 1vw, 1rem); font-weight: 600; line-height: 1.25; }.person-label small { display: block; margin-top: .35rem; color: #c2c6c3; font-size: .64rem; font-weight: 400; }
.intro-section,.featured-section,.approaches-section,.library-section,.questions-section { padding: clamp(4.5rem, 8vw, 8rem) 0; }
.intro-grid,.questions-grid { display: grid; gap: 2rem; } h2 { font-size: clamp(2.25rem, 2.8vw + 1rem, 4rem); line-height: 1.12; margin-top: 1.2rem; } .intro-copy { color: var(--page-muted); max-width: 39rem; font-size: 1rem; line-height: 1.8; } .intro-copy p + p { margin-top: 1rem; }.intro-copy p:first-child { font-size: 1.25rem; color: var(--page-text); line-height: 1.5; }
.principles { display: grid; margin-top: 3.5rem; border-top: 1px solid var(--page-line); }.principles article { padding: 1.6rem 0; border-bottom: 1px solid var(--page-line); }.principles span,.approach-top { color: var(--page-gold); font-size: .75rem; letter-spacing: .13em; }.principles h3 { margin-top: 1.3rem; font-size: 1.05rem; font-weight: 600; }.principles p { max-width: 23rem; margin-top: .6rem; color: var(--page-muted); font-size: .9rem; line-height: 1.7; }
.featured-section,.library-section { background: var(--page-panel); }.section-heading { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1.5rem; align-items: end; margin-bottom: 2.4rem; }.section-heading h2 { margin-top: 1rem; }.section-heading div > p:last-child { margin-top: .9rem; color: var(--page-muted); line-height: 1.65; }.text-link { display: inline-flex; align-items: center; gap: .8rem; padding-bottom: .45rem; color: var(--page-gold); border-bottom: 1px solid rgba(201,173,125,.5); font-size: .85rem; font-weight: 600; }.text-link:hover { color: var(--page-text); }
.featured-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 1rem; }.featured-card { min-width: 0; border: 1px solid var(--page-line); background: #111d27; color: var(--page-text); transition: border-color .2s; }.featured-card:hover { border-color: #af9976; }.featured-image { position: relative; overflow: hidden; aspect-ratio: 4 / 4.2; background: linear-gradient(145deg,#31414c,#172530); }.featured-image img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .35s; }.featured-card:hover img { transform: scale(1.025); }.image-number { position: absolute; z-index: 1; top: .9rem; left: .9rem; color: #ecdfc8; font-size: .68rem; letter-spacing: .13em; }.image-initials { position: absolute; inset: 0; display: grid; place-items: center; font-family: Georgia,serif; font-size: 3rem; color: #70828d; }.featured-details { position: relative; padding: 1.1rem; }.card-type { color: var(--page-gold); font-size: .65rem; letter-spacing: .09em; text-transform: uppercase; }.featured-details h3 { margin-top: .6rem; font-size: 1.05rem; font-weight: 600; }.featured-details p { margin-top: .45rem; color: var(--page-muted); font-size: .78rem; line-height: 1.55; }.card-arrow { display: none; position: absolute; right: 1.2rem; top: 1.2rem; color: var(--page-gold); }
.approach-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border-top: 1px solid var(--page-line); border-left: 1px solid var(--page-line); }.approach-card { display: flex; flex-direction: column; min-height: 15rem; padding: 1.25rem; border-right: 1px solid var(--page-line); border-bottom: 1px solid var(--page-line); color: var(--page-text); transition: background .2s; }.approach-card:hover { background: rgba(201,173,125,.06); }.approach-top { display: flex; justify-content: space-between; }.approach-card h3 { margin-top: 2rem; font-family: Georgia,serif; font-size: clamp(1.2rem,1.3vw,1.55rem); line-height: 1.2; font-weight: 400; }.approach-card p { margin-top: .8rem; color: var(--page-muted); font-size: .85rem; line-height: 1.65; }.approach-names { margin-top: auto; padding-top: 1.5rem; color: #c4b59d; font-size: .7rem; line-height: 1.5; }
.library-grid { display: grid; gap: 0 1.5rem; }.library-card { display: flex; align-items: center; min-width: 0; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--page-line); color: var(--page-text); }.library-avatar { position: relative; width: 3.5rem; height: 3.5rem; flex: none; display: grid; place-items: center; overflow: hidden; background: #2b3b45; color: #b5c1c5; font-size: .8rem; }.library-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top; }.library-info { min-width: 0; flex: 1; }.library-info h3 { font-size: .95rem; font-weight: 600; }.library-info p { margin-top: .3rem; color: var(--page-muted); font-size: .78rem; }.library-arrow { color: var(--page-gold); transition: transform .2s; }.library-card:hover .library-arrow { transform: translate(3px,-3px); }
.questions-grid > div:first-child > p:last-child { margin-top: 1rem; color: var(--page-muted); line-height: 1.7; }.question { border-top: 1px solid var(--page-line); }.question:last-child { border-bottom: 1px solid var(--page-line); }.question button { width: 100%; display: flex; justify-content: space-between; gap: 1rem; padding: 1.25rem 0; text-align: left; font-size: .95rem; font-weight: 600; cursor: pointer; }.question button span:last-child { color: var(--page-gold); font-size: 1.3rem; }.question p { padding: 0 2rem 1.25rem 0; color: var(--page-muted); font-size: .9rem; line-height: 1.75; }
.closing-section { padding: 0 0 clamp(4.5rem,8vw,8rem); }.closing-inner { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 2rem; padding: clamp(2rem,5vw,5rem); border: 1px solid rgba(201,173,125,.25); background: #15232d; }.closing-inner p:last-child { margin-top: 1rem; color: #bdc8ca; line-height: 1.6; }
:global(html:not(.dark)) .home-page { --page-bg:#f7f5f0; --page-panel:#eeece6; --page-line:rgba(18,30,37,.16); --page-text:#17232b; --page-muted:#53636c; --page-gold:#806336; }
:global(html:not(.dark)) .hero { background: linear-gradient(135deg,#e9e6dd,#d4dbd8); }:global(html:not(.dark)) .hero-intro { color:#40535c; }:global(html:not(.dark)) .hero-note p { color:#4c5e65; }:global(html:not(.dark)) .action-secondary { color:#263941; border-color:#8a999b; }:global(html:not(.dark)) .featured-card { background:#f8f6f0; }:global(html:not(.dark)) .closing-inner { background:#e6e9e4; }:global(html:not(.dark)) .closing-inner p:last-child { color:#53636c; }
@media (min-width: 48rem) { .home-container { width: min(100% - 5rem,var(--layout-max,99rem)); }.principles { grid-template-columns: repeat(3,1fr); }.principles article { padding: 1.8rem 2rem 1.8rem 0; }.principles article + article { padding-left: 2rem; border-left: 1px solid var(--page-line); }.featured-grid { grid-template-columns: repeat(4,minmax(0,1fr)); }.library-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }.approach-card { padding: 1.8rem; }.card-arrow { display:block; } }
@media (min-width: 64rem) { .hero-grid { grid-template-columns: 1fr 1.05fr; gap: clamp(3rem,6vw,7rem); }.intro-grid { grid-template-columns: 1fr 1fr; align-items: end; }.questions-grid { grid-template-columns: .8fr 1.2fr; gap: 5rem; }.approach-grid { grid-template-columns: repeat(4,minmax(0,1fr)); }.featured-details { padding: 1.4rem; } }
@media (max-width: 25rem) { .home-container { width: calc(100% - 2rem); }.hero { padding-top: 7rem; }.hero-grid { gap: 2.5rem; }.hero-actions .action { width: 100%; }.visual-top span:last-child,.visual-bottom span:last-child { display: none; }.person-label { font-size: .65rem; }.person-label small { font-size: .58rem; }.approach-grid { grid-template-columns: 1fr; }.approach-card { min-height: 12rem; } }
@media (prefers-reduced-motion: reduce) { .home-page * { transition-duration: .01ms !important; } }
</style>
