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

	let { children } = $props();

	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));

	// View Transitions for cinematic page navigation
	onNavigate((navigation) => {
		if (!browser || !document.startViewTransition) return;

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
	<meta name="theme-color" content="#020617" />
	<link rel="alternate" type="application/rss+xml" title="{PUBLIC_SITE_NAME} Blog RSS Feed" href="/rss.xml" />
</svelte:head>

{#if !isAdmin}
	<JsonLd type="WebSite" />
	<Navbar />
{/if}

<div class="min-h-screen bg-midnight-950 text-midnight-50 antialiased selection:bg-gold-500/30 selection:text-gold-200">
	{@render children()}
</div>

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
