<script lang="ts">
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';
    import { slide } from 'svelte/transition';
    import SEO from '$lib/components/SEO.svelte';
    import { Icon, type IconName } from '$lib/components/icons';
    import type { PageData } from './$types';

    // ============================================================================
    // PROPS (Svelte 5)
    // ============================================================================
    let { data }: { data: PageData } = $props();

    // ============================================================================
    // STATE (Svelte 5 Runes)
    // ============================================================================
    let openFaq = $state<number | null>(null);
    let mounted = $state(false);
    let heroRef: HTMLElement;

    // ============================================================================
    // DERIVED DATA
    // ============================================================================
    const displayTraders = $derived(
        data.traders.slice(0, 8).map(t => ({
            name: t.name,
            style: t.tradingStyle || 'Trading',
            knownFor: t.oneLiner || 'Legendary Trader',
            returns: t.netWorth || 'Exceptional',
            slug: t.slug
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
            icon: 'line-chart' as IconName,
            color: 'text-amber-400',
            traders: ['John Carter', 'Linda Raschke', 'Larry Williams'],
            description: 'Master chart patterns and derivatives for consistent edge.'
        }
    ];

    const valueProps: { icon: IconName; title: string; description: string }[] = [
        {
            icon: 'brain',
            title: 'Battle-Tested Frameworks',
            description: 'Every strategy profiled has survived multiple market cycles, bear markets, and black swan events.'
        },
        {
            icon: 'bar-chart',
            title: 'Real Performance Data',
            description: 'Documented returns, famous trades, and the specific conditions that led to success.'
        },
        {
            icon: 'graduation-cap',
            title: 'Actionable Lessons',
            description: 'Go beyond theory—extract principles you can apply to your own trading today.'
        }
    ];

    const howItWorksSteps: { step: string; title: string; description: string; icon: IconName }[] = [
        {
            step: '01',
            title: 'Choose Your Path',
            description: 'Browse by trading style—value, momentum, macro, or technical—to find strategies that match your personality.',
            icon: 'target'
        },
        {
            step: '02',
            title: 'Study The Masters',
            description: 'Deep-dive into comprehensive profiles covering biography, philosophy, famous trades, and key lessons.',
            icon: 'book-open'
        },
        {
            step: '03',
            title: 'Apply The Principles',
            description: 'Extract actionable frameworks and apply battle-tested strategies to your own trading journey.',
            icon: 'zap'
        }
    ];

    const testimonials = [
        {
            quote: "Studying Minervini's SEPA methodology completely transformed my approach to growth stocks.",
            author: "Active Trader",
            role: "Momentum Investor"
        },
        {
            quote: "Finally, a resource that treats trading education with the depth it deserves. World-class content.",
            author: "Portfolio Manager",
            role: "Hedge Fund"
        },
        {
            quote: "The biographical context makes these strategies come alive. You understand not just what they did, but why.",
            author: "Retail Trader",
            role: "5 Years Experience"
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
            answer: 'Absolutely. We\'re always expanding our library. If you know of a legendary trader with a verified track record and unique methodology, let us know.'
        },
        {
            question: 'Is this financial advice?',
            answer: 'No. Trading Greats is educational content only. All trading involves risk, and past performance does not guarantee future results. Always do your own research.'
        }
    ];

    // ============================================================================
    // LOGIC & ACTIONS
    // ============================================================================
    function toggleFaq(index: number) {
        openFaq = openFaq === index ? null : index;
    }

    onMount(() => {
        mounted = true;
    });

    // Interaction Observer for Scroll Reveals
    function reveal(node: HTMLElement, params: { delay?: number } = {}) {
        const delay = params.delay || 0;
        node.style.setProperty('--delay', delay.toString());
        node.classList.add('cinematic-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    node.classList.add('visible');
                    observer.unobserve(node);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        observer.observe(node);
        return { destroy() { observer.disconnect(); } };
    }

    // Animated Counter Logic (Hydration Safe via $effect)
    function createCounter(target: number, duration: number = 2000, delay: number = 0) {
        const value = spring(0, { stiffness: 0.05, damping: 0.5 });
        $effect(() => {
            const timer = setTimeout(() => value.set(target), delay);
            return () => clearTimeout(timer);
        });
        return value;
    }

    const countTraders = createCounter(50, 2000, 800);
    const countYears = createCounter(200, 2000, 1000);
    const countWorth = createCounter(500, 2000, 1200);

    // ============================================================================
    // JSON-LD CONSTRUCTION
    // ============================================================================
    const schemaOrg = {
        faq: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        },
        list: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Featured Trading Legends",
            "description": "Profiles of the worlds greatest traders and their proven strategies",
            "numberOfItems": data.traders.length,
            "itemListElement": data.traders.map((t, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": t.name,
                "url": `https://tradinggreats.com/traders/${t.slug}` 
            }))
        },
        org: {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Trading Greats",
            "url": "https://tradinggreats.com",
            "logo": "https://tradinggreats.com/favicon.svg",
            "description": data.meta.description,
            "knowsAbout": ["Trading", "Investing", "Financial Markets", "Value Investing"]
        }
    };
</script>

<SEO
    title={data.meta.title}
    description={data.meta.description}
    keywords={['trading strategies', 'Warren Buffett', 'value investing', 'momentum trading', 'George Soros', 'trading education', 'stock market', 'investment strategies', 'legendary traders', 'trading methodology']}
    preloadImage={true}
/>

<svelte:head>
    {@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.faq)}</script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.list)}</script>`}
    {@html `<script type="application/ld+json">${JSON.stringify(schemaOrg.org)}</script>`}
</svelte:head>

<section
    bind:this={heroRef}
    class="relative min-h-[100vh] w-full overflow-hidden bg-[#020617]"
>
    <div class="absolute inset-0">
        <div class="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.2)_0%,rgba(234,179,8,0.05)_40%,transparent_70%)] blur-3xl animate-pulse-slower"></div>
        <div class="absolute top-[10%] right-[-15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0.05)_40%,transparent_70%)] blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,rgba(14,165,233,0.05)_40%,transparent_70%)] blur-3xl animate-pulse-slower" style="animation-delay: 4s;"></div>

        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)]"></div>

        <div class="absolute inset-0 opacity-[0.03] mix-blend-overlay" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+');"></div>
    </div>

    <div class="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8">
        <div class="mx-auto max-w-5xl text-center">
            <div
                class="mb-10 inline-flex items-center gap-2.5 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-5 py-2 backdrop-blur-sm opacity-0 animate-hero-fade"
                style="animation-delay: 100ms;"
            >
                <Icon name="sparkles" class="h-4 w-4 text-[#FACC15]" />
                <span class="text-sm font-semibold tracking-wide text-[#FDE68A]">
                    The Premier Trading Education Library
                </span>
            </div>

            <h1
                class="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl opacity-0 animate-hero-slide"
                style="animation-delay: 200ms;"
            >
                Learn From Traders<br />
                <span class="relative">
                    <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">
                        Who Moved Markets
                    </span>
                    <span class="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#EAB308] to-transparent opacity-0 animate-fade-in" style="animation-delay: 1s;"></span>
                </span>
            </h1>

            <p
                class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl md:text-2xl opacity-0 animate-hero-fade"
                style="animation-delay: 400ms;"
            >
                Study the exact methodologies used by history's most successful investors.
                <span class="text-slate-100 font-medium">No hype. No shortcuts.</span> Just proven strategies
                that have generated billions.
            </p>

            <div
                class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row opacity-0 animate-hero-fade"
                style="animation-delay: 600ms;"
            >
                <a
                    href="/traders"
                    class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-8 py-4 text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
                >
                    <Icon name="users" class="h-5 w-5" />
                    Explore All Legends
                    <Icon name="arrow-right" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <a
                    href="#how-it-works"
                    class="group inline-flex items-center gap-3 rounded-full border-2 border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                    <Icon name="play" class="h-5 w-5" />
                    How It Works
                </a>
            </div>

            <div
                class="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-12 opacity-0 animate-hero-fade"
                style="animation-delay: 800ms;"
            >
                <div class="text-center">
                    <div class="font-display text-4xl font-bold text-white lg:text-5xl">
                        {Math.floor($countTraders)}+
                    </div>
                    <div class="mt-2 text-sm text-slate-400 lg:text-base">
                        Trading Legends
                    </div>
                </div>
                <div class="text-center">
                    <div class="font-display text-4xl font-bold text-white lg:text-5xl">
                        {Math.floor($countYears)}+
                    </div>
                    <div class="mt-2 text-sm text-slate-400 lg:text-base">
                        Years of Wisdom
                    </div>
                </div>
                <div class="text-center">
                    <div class="font-display text-4xl font-bold text-white lg:text-5xl">
                        ${Math.floor($countWorth)}B+
                    </div>
                    <div class="mt-2 text-sm text-slate-400 lg:text-base">
                        Combined Net Worth
                    </div>
                </div>
            </div>
        </div>
    </div>

    {#if mounted}
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
            <div class="flex flex-col items-center gap-2 text-slate-500">
                <span class="text-xs font-medium uppercase tracking-widest">Discover</span>
                <Icon name="chevron-down" class="h-5 w-5" />
            </div>
        </div>
    {/if}
</section>

<section class="relative z-20 bg-[#020617] py-32 px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-20 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6 border border-white/10">
                Why Trading Greats
            </span>
            <h2 class="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                The Unfair Advantage of<br />
                <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Studying The Best</span>
            </h2>
            <p class="mx-auto mt-8 max-w-2xl text-lg text-slate-300 leading-relaxed">
                While others chase hot tips and short-term gains, you'll be building
                a foundation of timeless principles from traders who've already solved the game.
            </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
            {#each valueProps as prop, i}
                <div 
                    use:reveal={{ delay: 0.1 + i * 0.15 }}
                    class="group"
                >
                    <div
                        class="relative h-[320px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:border-[#EAB308]/40 hover:shadow-[0_20px_70px_-15px_rgba(234,179,8,0.3)] hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04]"
                    >
                        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#EAB308]/0 via-[#EAB308]/0 to-[#EAB308]/0 transition-all duration-700 group-hover:from-[#EAB308]/10 group-hover:via-transparent group-hover:to-[#EAB308]/5"></div>
                        
                        <div class="relative z-10 flex h-full flex-col">
                            <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAB308]/20 to-[#CA8A04]/10 text-[#FACC15] ring-1 ring-[#EAB308]/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-[#EAB308]/20">
                                <Icon name={prop.icon} class="h-8 w-8" />
                            </div>
                            
                            <h3 class="mb-4 font-display text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#FACC15]">
                                {prop.title}
                            </h3>
                            
                            <p class="flex-1 text-slate-300 leading-relaxed text-base">
                                {prop.description}
                            </p>
                        </div>
                        
                        <div class="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
                            <div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/50 to-[#020617] py-32 px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0">
        <div class="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-16 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end" use:reveal={{ delay: 0 }}>
            <div class="text-center sm:text-left">
                <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 border border-white/10">
                    Featured Legends
                </span>
                <h2 class="font-display text-4xl font-bold text-white sm:text-5xl">
                    Most Studied This Month
                </h2>
            </div>
            <a
                href="/traders"
                class="group flex items-center gap-3 text-sm font-bold text-[#EAB308] transition-all duration-300 hover:text-[#FACC15] hover:gap-4"
            >
                View All Legends
                <Icon name="arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {#each displayTraders.slice(0, 4) as trader, i}
                <div use:reveal={{ delay: 0.15 + i * 0.1 }}>
                    <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] transition-all duration-500 hover:border-[#EAB308]/40 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="aspect-[4/5] w-full bg-slate-800 relative overflow-hidden">
                            <div class="absolute inset-0 flex items-center justify-center text-7xl font-black text-white/5 select-none">
                                {trader.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
                            
                            <div class="absolute bottom-0 left-0 w-full p-6">
                                <span class="mb-2 inline-block rounded bg-[#EAB308] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#020617]">
                                    {trader.style}
                                </span>
                                <h3 class="mb-1 text-xl font-bold text-white">{trader.name}</h3>
                                <p class="text-sm text-slate-400 mb-3">{trader.knownFor}</p>
                                <div class="flex items-center gap-2 border-t border-white/10 pt-3 text-xs font-medium text-slate-400">
                                    <Icon name="trending-up" class="h-3 w-3 text-emerald-400" />
                                    <span>{trader.returns}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<section id="how-it-works" class="relative z-20 bg-[#020617] py-28 px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
        <div class="mb-20 text-center" use:reveal>
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6">
                How It Works
            </span>
            <h2 class="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Your Path to Trading Mastery
            </h2>
            <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                Three simple steps to extract decades of market wisdom and apply it to your own journey.
            </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            {#each howItWorksSteps as step, i}
                <div use:reveal={{ delay: i * 0.1 }}>
                    <div class="group relative">
                        {#if i < howItWorksSteps.length - 1}
                            <div class="hidden lg:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-px bg-gradient-to-r from-[#EAB308]/50 to-transparent"></div>
                        {/if}

                        <div class="relative flex flex-col items-center text-center">
                            <div class="relative mb-8">
                                <div class="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 transition-all duration-500 group-hover:border-[#EAB308]/30 group-hover:shadow-2xl group-hover:shadow-[#EAB308]/10">
                                    <Icon name={step.icon} class="h-12 w-12 text-[#EAB308] transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div class="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAB308] text-sm font-bold text-[#020617] shadow-lg shadow-[#EAB308]/30">
                                    {step.step}
                                </div>
                            </div>

                            <h3 class="mb-4 font-display text-xl font-bold text-white">
                                {step.title}
                            </h3>
                            <p class="text-slate-300 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-16 text-center" use:reveal={{ delay: 0.6 }}>
            <a
                href="/traders"
                class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-10 py-5 text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
            >
                Start Your Journey
                <Icon name="arrow-right" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    </div>
</section>

<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/30 to-[#020617] py-32 px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-20 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6 border border-white/10">
                Trading Styles
            </span>
            <h2 class="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Find Your <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Edge</span>
            </h2>
            <p class="mx-auto mt-8 max-w-2xl text-lg text-slate-300 leading-relaxed">
                Every successful trader has a defined methodology. Explore the major schools of thought and discover which approach resonates with you.
            </p>
        </div>

        <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {#each strategies as strategy, i}
                <div use:reveal={{ delay: 0.1 + i * 0.1 }}>
                    <a
                        href="/traders?style={encodeURIComponent(strategy.name)}"
                        class="group relative flex flex-col h-[280px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:border-[#EAB308]/40 hover:shadow-[0_25px_80px_-20px_rgba(234,179,8,0.35)]"
                    >
                        <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#EAB308]/0 to-[#EAB308]/0 transition-all duration-500 group-hover:from-[#EAB308]/15 group-hover:to-transparent"></div>
                        
                        <div class="relative z-10 flex flex-col h-full p-7">
                            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:ring-[#EAB308]/30 {strategy.color}">
                                <Icon name={strategy.icon} class="h-7 w-7" />
                            </div>

                            <h3 class="mb-2 font-display text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FACC15]">
                                {strategy.name}
                            </h3>

                            <p class="mb-auto text-sm text-slate-400 leading-relaxed line-clamp-2">
                                {strategy.description}
                            </p>

                            <div class="flex flex-wrap gap-1.5 mt-4">
                                {#each strategy.traders as traderName}
                                    <span class="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/5 transition-all duration-300 group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/20 group-hover:text-[#FDE68A]">
                                        {traderName}
                                    </span>
                                {/each}
                            </div>
                        </div>

                        <div class="absolute top-6 right-6 opacity-0 translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0">
                            <Icon name="arrow-right" class="h-5 w-5 text-[#FACC15]" />
                        </div>
                        
                        <div class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
                            <div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                        </div>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="relative z-20 bg-[#020617] py-32 px-6 lg:px-8 overflow-hidden">
    <div class="relative mx-auto max-w-7xl">
        <div class="mb-16 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6 border border-white/10">
                The Library
            </span>
            <h2 class="font-display text-4xl font-bold text-white sm:text-5xl">
                Decades of <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Market Wisdom</span>
            </h2>
            <p class="mt-6 text-slate-400 max-w-xl mx-auto text-lg">
                Each profile represents a lifetime of learning, distilled into actionable principles.
            </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each displayTraders as trader, i}
                <div use:reveal={{ delay: 0.1 + i * 0.08 }}>
                    <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] transition-all duration-500 hover:border-[#EAB308]/40 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-slate-500 select-none">
                                    {trader.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-[#EAB308] bg-[#EAB308]/10 px-2 py-1 rounded">
                                    {trader.style}
                                </span>
                            </div>
                            <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#FACC15] transition-colors">{trader.name}</h3>
                            <p class="text-sm text-slate-400 mb-4">{trader.knownFor}</p>
                            <div class="w-full h-px bg-white/5 mb-4"></div>
                            <div class="flex items-center justify-between text-xs font-medium text-slate-500">
                                <span>Track Record</span>
                                <span class="text-emerald-400">{trader.returns}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-20 text-center" use:reveal={{ delay: 0.8 }}>
            <a
                href="/traders"
                class="group inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-12 py-5 text-base font-bold text-white backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10 hover:border-[#EAB308]/30 hover:shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)] hover:scale-[1.02]"
            >
                View Complete Library
                <Icon name="arrow-right" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </a>
        </div>
    </div>
</section>

<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/30 to-[#020617] py-28 px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
        <div class="mb-16 text-center">
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6">
                Community
            </span>
            <h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
                Trusted by Serious Traders
            </h2>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            {#each testimonials as testimonial, i}
                <div use:reveal={{ delay: i * 0.1 }}>
                    <div class="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/30 p-8 backdrop-blur-sm">
                        <Icon name="quote" class="absolute top-6 right-6 h-8 w-8 text-[#EAB308]/20" />

                        <div class="flex gap-1 mb-6">
                            {#each Array(5) as _}
                                <Icon name="star" class="h-4 w-4 fill-[#EAB308] text-[#EAB308]" />
                            {/each}
                        </div>

                        <blockquote class="relative z-10 text-lg text-slate-200 leading-relaxed mb-6">
                            "{testimonial.quote}"
                        </blockquote>

                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#CA8A04]/20 flex items-center justify-center">
                                <span class="text-sm font-bold text-[#FACC15]">
                                    {testimonial.author[0]}
                                </span>
                            </div>
                            <div>
                                <p class="font-medium text-white">{testimonial.author}</p>
                                <p class="text-sm text-slate-400">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="relative z-20 bg-[#020617] py-28 px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
        <div class="mb-16 text-center">
            <span class="inline-block rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-6">
                FAQ
            </span>
            <h2 class="font-display text-3xl font-bold text-white sm:text-4xl">
                Frequently Asked Questions
            </h2>
        </div>

        <div class="space-y-4">
            {#each faqItems as faq, i}
                <div use:reveal={{ delay: i * 0.08 }}>
                    <div class="group rounded-2xl border border-white/5 bg-[#0f172a]/30 backdrop-blur-sm overflow-hidden">
                        <button class="flex w-full cursor-pointer items-center justify-between p-6 text-left font-medium text-white hover:text-[#FACC15] transition-colors" onclick={() => toggleFaq(i)}>
                            <span class="pr-6">{faq.question}</span>
                            <Icon name="chevron-right" class="h-5 w-5 flex-shrink-0 text-slate-500 transition-transform {openFaq === i ? 'rotate-90' : ''}" />
                        </button>
                        {#if openFaq === i}
                            <div transition:slide class="px-6 pb-6 text-slate-300 leading-relaxed">
                                {faq.answer}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="relative z-20 py-32 px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent"></div>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#EAB308]/5 blur-[120px]"></div>

    <div class="relative z-10 mx-auto max-w-4xl text-center">
        <div class="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-5 py-2 backdrop-blur-sm">
            <Icon name="check-circle" class="h-4 w-4 text-[#FACC15]" />
            <span class="text-sm font-semibold text-[#FDE68A]">
                100% Free to Explore
            </span>
        </div>

        <h2 class="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Start Learning From<br />
            <span class="text-[#FACC15]">The Greatest Today</span>
        </h2>

        <p class="mx-auto mt-8 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Join thousands of traders who are building their edge with battle-tested
            strategies from history's most successful investors.
        </p>

        <div class="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
                href="/traders"
                class="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-10 py-5 text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
            >
                <Icon name="users" class="h-5 w-5" />
                Explore All Legends
                <Icon name="arrow-right" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
        </div>

        <div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500">
            <div class="flex items-center gap-2">
                <Icon name="shield" class="h-5 w-5" />
                <span class="text-sm">No Sign-up Required</span>
            </div>
            <div class="flex items-center gap-2">
                <Icon name="clock" class="h-5 w-5" />
                <span class="text-sm">Updated Regularly</span>
            </div>
            <div class="flex items-center gap-2">
                <Icon name="book-open" class="h-5 w-5" />
                <span class="text-sm">Research-Backed</span>
            </div>
        </div>
    </div>
</section>

<style>
    /* =========================================================================
       CINEMATIC ANIMATIONS (Restored Exact Keyframes)
       ========================================================================= */
    
    .cinematic-reveal {
        opacity: 0;
        transform: translateY(60px) scale(0.95);
        filter: blur(10px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: calc(var(--delay) * 1s + 0.2s);
        will-change: transform, opacity, filter;
    }
    
    .cinematic-reveal.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }

    @keyframes heroFade {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes heroSlide {
        0% { opacity: 0; transform: translateY(40px); filter: blur(10px); }
        100% { opacity: 1; transform: translateY(0); filter: blur(0); }
    }

    @keyframes fadeIn {
        to { opacity: 1; }
    }

    /* Apply animations via class names */
    .animate-hero-fade {
        animation: heroFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-hero-slide {
        animation: heroSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
    }

    /* Pulse Animations */
    @keyframes pulseSlow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
    }

    @keyframes pulseSlower {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }

    .animate-pulse-slow {
        animation: pulseSlow 4s ease-in-out infinite;
    }
    
    .animate-pulse-slower {
        animation: pulseSlower 6s ease-in-out infinite;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .animate-hero-fade,
        .animate-hero-slide,
        .animate-fade-in,
        .cinematic-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
        }
    }
</style>
