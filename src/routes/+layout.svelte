<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import NewsletterPopup from '#lib/components/NewsletterPopup.svelte';
	import { PUBLIC_SITE_NAME as configuredSiteName } from '$app/env/public';

	const PUBLIC_SITE_NAME = configuredSiteName || 'Trading Greats';
	import { theme } from '#lib/stores/theme.svelte.ts';

	let { children } = $props();

	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	// Dynamic theme-color meta tag based on current theme
	const themeColor = $derived(theme.isDark ? '#020617' : '#f8fafc');

</script>

<svelte:head>
	<meta name="author" content={PUBLIC_SITE_NAME} />
	<meta name="theme-color" content={themeColor} />
	<link rel="alternate" type="application/rss+xml" title="Trading Greats Blog RSS Feed" href="/rss.xml" />
</svelte:head>

<!-- Skip to main content link (WCAG 2.1 Level A) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-midnight-950 focus:font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-950"
>
	Skip to main content
</a>

{#if !isAdmin}
	<JsonLd type="WebSite" />
	<JsonLd type="Organization" />
	<Navbar />
{/if}

<main id="main-content" class="min-h-screen bg-midnight-950 text-midnight-50 antialiased selection:bg-gold-500/30 selection:text-gold-200">
	{@render children()}
</main>

{#if !isAdmin}
	<Footer />
	<NewsletterPopup delay={15000} showOnScroll={true} scrollThreshold={60} />
{/if}
