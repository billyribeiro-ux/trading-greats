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
    // JSON-LD CONSTRUCTION (Reactive to data changes)
    // ============================================================================
    const schemaOrg = $derived({
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
    });
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
    class="relative min-h-screen min-h-[100dvh] w-full overflow-hidden bg-[#020617]"
>
    <!-- MOBILE-FIRST: Smaller/optimized background orbs for mobile -->
    <div class="absolute inset-0">
        <div class="absolute top-[-20%] left-[-10%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] lg:h-[800px] lg:w-[800px] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.15)_0%,rgba(234,179,8,0.05)_40%,transparent_70%)] blur-3xl animate-pulse-slower"></div>
        <div class="absolute top-[10%] right-[-15%] h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] lg:h-[600px] lg:w-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,rgba(139,92,246,0.05)_40%,transparent_70%)] blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-[-10%] left-[30%] h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,rgba(14,165,233,0.04)_40%,transparent_70%)] blur-3xl animate-pulse-slower" style="animation-delay: 4s;"></div>

        <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] lg:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)]"></div>

        <div class="absolute inset-0 opacity-[0.02] sm:opacity-[0.03] mix-blend-overlay" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+');"></div>
    </div>

    <div class="relative z-10 mx-auto flex min-h-screen min-h-[100dvh] max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
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
                class="font-display text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl opacity-0 animate-hero-slide"
                style="animation-delay: 200ms;"
            >
                Learn From Traders<br />
                <span class="relative">
                    <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">
                        Who Moved Markets
                    </span>
                    <span class="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-[#EAB308] to-transparent opacity-0 animate-fade-in" style="animation-delay: 1s;"></span>
                </span>
            </h1>

            <p
                class="mx-auto mt-6 sm:mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl lg:text-2xl opacity-0 animate-hero-fade"
                style="animation-delay: 400ms;"
            >
                Study the exact methodologies used by history's most successful investors.
                <span class="text-slate-100 font-medium">No hype. No shortcuts.</span> Just proven strategies
                that have generated billions.
            </p>

            <!-- MOBILE-FIRST: Full-width buttons on mobile, inline on tablet+ -->
            <div
                class="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row opacity-0 animate-hero-fade w-full px-4 sm:px-0"
                style="animation-delay: 600ms;"
            >
                <a
                    href="/traders"
                    class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
                >
                    <Icon name="users" class="h-4 w-4 sm:h-5 sm:w-5" />
                    Explore All Legends
                    <Icon name="arrow-right" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <a
                    href="#how-it-works"
                    class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-white/10 bg-white/5 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
                >
                    <Icon name="play" class="h-4 w-4 sm:h-5 sm:w-5" />
                    How It Works
                </a>
            </div>

            <!-- MOBILE-FIRST: Compact stats on mobile -->
            <div
                class="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 border-t border-white/10 pt-8 sm:pt-10 lg:pt-12 opacity-0 animate-hero-fade"
                style="animation-delay: 800ms;"
            >
                <div class="text-center">
                    <div class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        {Math.floor($countTraders)}+
                    </div>
                    <div class="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-400">
                        Trading Legends
                    </div>
                </div>
                <div class="text-center">
                    <div class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        {Math.floor($countYears)}+
                    </div>
                    <div class="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-400">
                        Years of Wisdom
                    </div>
                </div>
                <div class="text-center">
                    <div class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        ${Math.floor($countWorth)}B+
                    </div>
                    <div class="mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-400">
                        Combined Worth
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

<!-- MOBILE-FIRST: Responsive section spacing -->
<section class="relative z-20 bg-[#020617] py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] lg:w-[1000px] h-[400px] sm:h-[500px] lg:h-[600px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-10 sm:mb-16 lg:mb-20 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6 border border-white/10">
                Why Trading Greats
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15]">
                The Unfair Advantage of<br />
                <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Studying The Best</span>
            </h2>
            <p class="mx-auto mt-4 sm:mt-6 lg:mt-8 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed px-2 sm:px-0">
                While others chase hot tips and short-term gains, you'll be building
                a foundation of timeless principles from traders who've already solved the game.
            </p>
        </div>

        <!-- MOBILE-FIRST: Stack on mobile, 3-col on desktop -->
        <div class="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-3">
            {#each valueProps as prop, i}
                <div
                    use:reveal={{ delay: 0.1 + i * 0.15 }}
                    class="group"
                >
                    <!-- MOBILE-FIRST: Smaller card on mobile, taller on desktop -->
                    <div
                        class="relative h-auto min-h-[200px] sm:min-h-[280px] md:h-[320px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 sm:p-6 lg:p-8 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:scale-[1.03] hover:border-[#EAB308]/40 hover:shadow-[0_20px_70px_-15px_rgba(234,179,8,0.3)] hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.04] active:scale-[0.98]"
                    >
                        <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#EAB308]/0 via-[#EAB308]/0 to-[#EAB308]/0 transition-all duration-700 group-hover:from-[#EAB308]/10 group-hover:via-transparent group-hover:to-[#EAB308]/5"></div>

                        <div class="relative z-10 flex h-full flex-col">
                            <div class="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#EAB308]/20 to-[#CA8A04]/10 text-[#FACC15] ring-1 ring-[#EAB308]/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-[#EAB308]/20">
                                <Icon name={prop.icon} class="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                            </div>

                            <h3 class="mb-2 sm:mb-4 font-display text-lg sm:text-xl lg:text-2xl font-bold text-white transition-colors duration-300 group-hover:text-[#FACC15]">
                                {prop.title}
                            </h3>

                            <p class="flex-1 text-slate-300 leading-relaxed text-sm sm:text-base">
                                {prop.description}
                            </p>
                        </div>

                        <div class="hidden md:block absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
                            <div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: Featured Legends section -->
<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/50 to-[#020617] py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0">
        <div class="absolute top-1/3 left-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-[250px] sm:w-[350px] lg:w-[400px] h-[250px] sm:h-[350px] lg:h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-8 sm:mb-12 lg:mb-16 flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row sm:items-end" use:reveal={{ delay: 0 }}>
            <div class="text-center sm:text-left">
                <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-3 sm:mb-4 border border-white/10">
                    Featured Legends
                </span>
                <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    Most Studied This Month
                </h2>
            </div>
            <a
                href="/traders"
                class="group flex items-center gap-2 sm:gap-3 text-sm font-bold text-[#EAB308] transition-all duration-300 hover:text-[#FACC15] hover:gap-4 active:scale-95"
            >
                View All Legends
                <Icon name="arrow-right" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
        </div>

        <!-- MOBILE-FIRST: 2-col on mobile, 4-col on desktop -->
        <div class="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 lg:grid-cols-4">
            {#each displayTraders.slice(0, 4) as trader, i}
                <div use:reveal={{ delay: 0.15 + i * 0.1 }}>
                    <!-- MOBILE-FIRST: Compact card on mobile -->
                    <a href="/traders/{trader.slug}" class="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0f172a] transition-all duration-500 hover:border-[#EAB308]/40 md:hover:-translate-y-2 hover:shadow-2xl block active:scale-[0.98]">
                        <div class="aspect-[4/5] w-full bg-slate-800 relative overflow-hidden">
                            {#if trader.photoUrl}
                                <img
                                    src={trader.photoUrl}
                                    alt={trader.name}
                                    class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                            {:else}
                                <div class="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl lg:text-7xl font-black text-white/5 select-none">
                                    {trader.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                            {/if}
                            <div class="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>

                            <div class="absolute bottom-0 left-0 w-full p-3 sm:p-4 lg:p-6">
                                <span class="mb-1 sm:mb-2 inline-block rounded bg-[#EAB308] px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#020617]">
                                    {trader.style}
                                </span>
                                <h3 class="mb-0.5 sm:mb-1 text-sm sm:text-base lg:text-xl font-bold text-white group-hover:text-[#EAB308] transition-colors line-clamp-1">{trader.name}</h3>
                                <p class="text-[10px] sm:text-xs lg:text-sm text-slate-400 mb-2 sm:mb-3 line-clamp-2">{trader.knownFor}</p>
                                <div class="flex items-center gap-1.5 sm:gap-2 border-t border-white/10 pt-2 sm:pt-3 text-[10px] sm:text-xs font-medium text-slate-400">
                                    <Icon name="trending-up" class="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-400" />
                                    <span>{trader.returns}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: How It Works section -->
<section id="how-it-works" class="relative z-20 bg-[#020617] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
        <div class="mb-10 sm:mb-16 lg:mb-20 text-center" use:reveal>
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6">
                How It Works
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Your Path to Trading Mastery
            </h2>
            <p class="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 px-2 sm:px-0">
                Three simple steps to extract decades of market wisdom and apply it to your own journey.
            </p>
        </div>

        <!-- MOBILE-FIRST: Stack on mobile, 3-col on desktop -->
        <div class="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {#each howItWorksSteps as step, i}
                <div use:reveal={{ delay: i * 0.1 }}>
                    <div class="group relative">
                        {#if i < howItWorksSteps.length - 1}
                            <div class="hidden lg:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-60px)] h-px bg-gradient-to-r from-[#EAB308]/50 to-transparent"></div>
                        {/if}

                        <!-- MOBILE-FIRST: Horizontal layout on mobile, vertical on desktop -->
                        <div class="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 sm:gap-6 lg:gap-0">
                            <div class="relative flex-shrink-0 lg:mb-8">
                                <div class="flex h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 transition-all duration-500 group-hover:border-[#EAB308]/30 group-hover:shadow-2xl group-hover:shadow-[#EAB308]/10">
                                    <Icon name={step.icon} class="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#EAB308] transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full bg-[#EAB308] text-xs sm:text-sm font-bold text-[#020617] shadow-lg shadow-[#EAB308]/30">
                                    {step.step}
                                </div>
                            </div>

                            <div class="flex-1 lg:flex-none">
                                <h3 class="mb-2 lg:mb-4 font-display text-base sm:text-lg lg:text-xl font-bold text-white">
                                    {step.title}
                                </h3>
                                <p class="text-slate-300 leading-relaxed max-w-xs text-sm lg:text-base">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- MOBILE-FIRST: Full-width button on mobile -->
        <div class="mt-10 sm:mt-16 text-center px-4 sm:px-0" use:reveal={{ delay: 0.6 }}>
            <a
                href="/traders"
                class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
            >
                Start Your Journey
                <Icon name="arrow-right" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </a>
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: Trading Styles section -->
<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/30 to-[#020617] py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-[400px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[350px] lg:h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-[350px] sm:w-[450px] lg:w-[500px] h-[200px] sm:h-[250px] lg:h-[300px] bg-[radial-gradient(circle,rgba(234,179,8,0.05)_0%,transparent_70%)] blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl">
        <div class="mb-10 sm:mb-16 lg:mb-20 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6 border border-white/10">
                Trading Styles
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15]">
                Find Your <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Edge</span>
            </h2>
            <p class="mx-auto mt-4 sm:mt-6 lg:mt-8 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed px-2 sm:px-0">
                Every successful trader has a defined methodology. Explore the major schools of thought and discover which approach resonates with you.
            </p>
        </div>

        <!-- MOBILE-FIRST: 2-col on mobile, 4-col on desktop -->
        <div class="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
            {#each strategies as strategy, i}
                <div use:reveal={{ delay: 0.1 + i * 0.1 }}>
                    <!-- MOBILE-FIRST: Compact card on mobile -->
                    <a
                        href="/traders?style={encodeURIComponent(strategy.name)}"
                        class="group relative flex flex-col h-[220px] sm:h-[250px] lg:h-[280px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:scale-[1.04] hover:border-[#EAB308]/40 hover:shadow-[0_25px_80px_-20px_rgba(234,179,8,0.35)] active:scale-[0.98]"
                    >
                        <div class="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-[#EAB308]/0 to-[#EAB308]/0 transition-all duration-500 group-hover:from-[#EAB308]/15 group-hover:to-transparent"></div>

                        <div class="relative z-10 flex flex-col h-full p-4 sm:p-5 lg:p-7">
                            <div class="mb-3 sm:mb-4 lg:mb-5 flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:ring-[#EAB308]/30 {strategy.color}">
                                <Icon name={strategy.icon} class="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                            </div>

                            <h3 class="mb-1 sm:mb-2 font-display text-sm sm:text-base lg:text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FACC15] line-clamp-2">
                                {strategy.name}
                            </h3>

                            <p class="mb-auto text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed line-clamp-2">
                                {strategy.description}
                            </p>

                            <div class="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-4">
                                {#each strategy.traders.slice(0, 2) as traderName}
                                    <span class="inline-flex items-center rounded-full bg-white/5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-medium text-slate-300 border border-white/5 transition-all duration-300 group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/20 group-hover:text-[#FDE68A]">
                                        {traderName}
                                    </span>
                                {/each}
                                {#if strategy.traders.length > 2}
                                    <span class="hidden sm:inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                                        +{strategy.traders.length - 2}
                                    </span>
                                {/if}
                            </div>
                        </div>

                        <div class="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 translate-x-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0">
                            <Icon name="arrow-right" class="h-4 w-4 sm:h-5 sm:w-5 text-[#FACC15]" />
                        </div>

                        <div class="hidden md:block absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl">
                            <div class="absolute -inset-full top-0 h-[500%] w-[200%] -translate-x-full rotate-45 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                        </div>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: The Library section -->
<section class="relative z-20 bg-[#020617] py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="relative mx-auto max-w-7xl">
        <div class="mb-10 sm:mb-12 lg:mb-16 text-center" use:reveal={{ delay: 0 }}>
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6 border border-white/10">
                The Library
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Decades of <span class="bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#EAB308] bg-clip-text text-transparent">Market Wisdom</span>
            </h2>
            <p class="mt-4 sm:mt-6 text-slate-400 max-w-xl mx-auto text-sm sm:text-base lg:text-lg px-2 sm:px-0">
                Each profile represents a lifetime of learning, distilled into actionable principles.
            </p>
        </div>

        <!-- MOBILE-FIRST: 2-col on mobile, 4-col on desktop -->
        <div class="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {#each displayTraders as trader, i}
                <div use:reveal={{ delay: 0.1 + i * 0.08 }}>
                    <!-- MOBILE-FIRST: Compact library card -->
                    <div class="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0f172a] transition-all duration-500 hover:border-[#EAB308]/40 md:hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]">
                        <div class="p-4 sm:p-5 lg:p-6">
                            <div class="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                                <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-slate-500 select-none text-xs sm:text-sm flex-shrink-0">
                                    {trader.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <span class="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[#EAB308] bg-[#EAB308]/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                                    {trader.style}
                                </span>
                            </div>
                            <h3 class="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 group-hover:text-[#FACC15] transition-colors line-clamp-1">{trader.name}</h3>
                            <p class="text-[10px] sm:text-xs lg:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">{trader.knownFor}</p>
                            <div class="w-full h-px bg-white/5 mb-3 sm:mb-4"></div>
                            <div class="flex items-center justify-between text-[10px] sm:text-xs font-medium text-slate-500">
                                <span>Track Record</span>
                                <span class="text-emerald-400">{trader.returns}</span>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- MOBILE-FIRST: Full-width button on mobile -->
        <div class="mt-12 sm:mt-16 lg:mt-20 text-center px-4 sm:px-0" use:reveal={{ delay: 0.8 }}>
            <a
                href="/traders"
                class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full bg-white/5 border border-white/10 px-8 sm:px-12 py-4 sm:py-5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10 hover:border-[#EAB308]/30 hover:shadow-[0_20px_60px_-15px_rgba(234,179,8,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
                View Complete Library
                <Icon name="arrow-right" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </a>
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: Community/Testimonials section -->
<section class="relative z-20 bg-gradient-to-b from-[#020617] via-[#0f172a]/30 to-[#020617] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
        <div class="mb-10 sm:mb-12 lg:mb-16 text-center">
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6">
                Community
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Trusted by Serious Traders
            </h2>
        </div>

        <!-- MOBILE-FIRST: Stack on mobile, 3-col on desktop -->
        <div class="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
            {#each testimonials as testimonial, i}
                <div use:reveal={{ delay: i * 0.1 }}>
                    <!-- MOBILE-FIRST: Compact testimonial card -->
                    <div class="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/30 p-5 sm:p-6 lg:p-8 backdrop-blur-sm">
                        <Icon name="quote" class="absolute top-4 right-4 sm:top-6 sm:right-6 h-6 w-6 sm:h-8 sm:w-8 text-[#EAB308]/20" />

                        <div class="flex gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                            {#each Array(5) as _}
                                <Icon name="star" class="h-3 w-3 sm:h-4 sm:w-4 fill-[#EAB308] text-[#EAB308]" />
                            {/each}
                        </div>

                        <blockquote class="relative z-10 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed mb-4 sm:mb-6">
                            "{testimonial.quote}"
                        </blockquote>

                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#EAB308]/20 to-[#CA8A04]/20 flex items-center justify-center flex-shrink-0">
                                <span class="text-xs sm:text-sm font-bold text-[#FACC15]">
                                    {testimonial.author[0]}
                                </span>
                            </div>
                            <div>
                                <p class="font-medium text-white text-sm sm:text-base">{testimonial.author}</p>
                                <p class="text-xs sm:text-sm text-slate-400">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: FAQ section -->
<section class="relative z-20 bg-[#020617] py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
        <div class="mb-10 sm:mb-12 lg:mb-16 text-center">
            <span class="inline-block rounded-full bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#FACC15] mb-4 sm:mb-6">
                FAQ
            </span>
            <h2 class="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Frequently Asked Questions
            </h2>
        </div>

        <div class="space-y-3 sm:space-y-4">
            {#each faqItems as faq, i}
                <div use:reveal={{ delay: i * 0.08 }}>
                    <!-- MOBILE-FIRST: Touch-friendly FAQ accordion -->
                    <div class="group rounded-xl sm:rounded-2xl border border-white/5 bg-[#0f172a]/30 backdrop-blur-sm overflow-hidden">
                        <button class="flex w-full cursor-pointer items-center justify-between p-4 sm:p-5 lg:p-6 text-left font-medium text-white hover:text-[#FACC15] transition-colors active:bg-white/5" onclick={() => toggleFaq(i)}>
                            <span class="pr-4 sm:pr-6 text-sm sm:text-base">{faq.question}</span>
                            <Icon name="chevron-right" class="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-slate-500 transition-transform {openFaq === i ? 'rotate-90' : ''}" />
                        </button>
                        {#if openFaq === i}
                            <div transition:slide class="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 text-slate-300 leading-relaxed text-sm sm:text-base">
                                {faq.answer}
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- MOBILE-FIRST: Final CTA section -->
<section class="relative z-20 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 sm:w-2/3 bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent"></div>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-[#EAB308]/5 blur-[100px] sm:blur-[120px]"></div>

    <div class="relative z-10 mx-auto max-w-4xl text-center">
        <div class="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-4 sm:px-5 py-1.5 sm:py-2 backdrop-blur-sm">
            <Icon name="check-circle" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FACC15]" />
            <span class="text-xs sm:text-sm font-semibold text-[#FDE68A]">
                100% Free to Explore
            </span>
        </div>

        <h2 class="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
            Start Learning From<br />
            <span class="text-[#FACC15]">The Greatest Today</span>
        </h2>

        <p class="mx-auto mt-4 sm:mt-6 lg:mt-8 max-w-2xl text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 px-2 sm:px-0">
            Join thousands of traders who are building their edge with battle-tested
            strategies from history's most successful investors.
        </p>

        <!-- MOBILE-FIRST: Full-width button on mobile -->
        <div class="mt-8 sm:mt-10 lg:mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row px-4 sm:px-0">
            <a
                href="/traders"
                class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-bold text-[#020617] shadow-xl shadow-[#EAB308]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#EAB308]/30 active:scale-[0.98]"
            >
                <Icon name="users" class="h-4 w-4 sm:h-5 sm:w-5" />
                Explore All Legends
                <Icon name="arrow-right" class="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </a>
        </div>

        <div class="mt-10 sm:mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-slate-500">
            <div class="flex items-center gap-1.5 sm:gap-2">
                <Icon name="shield" class="h-4 w-4 sm:h-5 sm:w-5" />
                <span class="text-xs sm:text-sm">No Sign-up Required</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
                <Icon name="clock" class="h-4 w-4 sm:h-5 sm:w-5" />
                <span class="text-xs sm:text-sm">Updated Regularly</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
                <Icon name="book-open" class="h-4 w-4 sm:h-5 sm:w-5" />
                <span class="text-xs sm:text-sm">Research-Backed</span>
            </div>
        </div>
    </div>
</section>

<!-- 
    Animation styles moved to global app.css for consistency across all pages.
    Classes available: animate-hero-fade, animate-hero-slide, animate-fade-in,
    animate-pulse-slow, animate-pulse-slower, cinematic-reveal
-->
