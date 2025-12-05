<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import NewsletterPopup from '$lib/components/NewsletterPopup.svelte';
	import { PUBLIC_SITE_NAME } from '$env/static/public';
	import { onNavigate } from '$app/navigation';
	import { theme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));

	// Dynamic theme-color meta tag based on current theme
	const themeColor = $derived(theme.isDark ? '#020617' : '#f8fafc');

	// Check for reduced motion preference (Dec 2025 a11y best practice)
	const prefersReducedMotion = $derived(
		browser ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
	);

	// View Transitions for cinematic page navigation (respects reduced motion)
	onNavigate((navigation) => {
		if (!browser || !document.startViewTransition || prefersReducedMotion) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<meta name="author" content={PUBLIC_SITE_NAME} />
	<meta name="theme-color" content={themeColor} />
	<link rel="alternate" type="application/rss+xml" title="{PUBLIC_SITE_NAME} Blog RSS Feed" href="/rss.xml" />
</svelte:head>

<!-- Skip to main content link (WCAG 2.1 Level A) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-midnight-950 focus:font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-950"
>
	Skip to main content
</a>

{#if !isAdmin}
	<JsonLd type="WebSite" />
	<Navbar />
{/if}

<main id="main-content" class="min-h-screen bg-midnight-950 text-midnight-50 antialiased selection:bg-gold-500/30 selection:text-gold-200">
	{@render children()}
</main>

{#if !isAdmin}
	<Footer />
	<NewsletterPopup delay={15000} showOnScroll={true} scrollThreshold={60} />
{/if}

<style>
	/* View Transition Animations */
	:global(::view-transition-old(root)) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
	}

	:global(::view-transition-new(root)) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes fade-out {
		from { opacity: 1; }
		to { opacity: 0; }
	}
</style>
