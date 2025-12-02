<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Home, ArrowLeft } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Page Not Found | Trading Greats</title>
</svelte:head>

<Navbar />

<main class="flex min-h-screen items-center justify-center px-4 pt-16">
	<div class="text-center">
		<p class="text-8xl font-bold text-gold-500">404</p>
		<h1 class="mt-4 font-display text-3xl font-bold text-midnight-50">Page Not Found</h1>
		<p class="mt-4 text-lg text-midnight-400">
			The page you're looking for doesn't exist or has been moved.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				<Home class="h-5 w-5" />
				Go Home
			</a>
			<button
				onclick={() => history.back()}
				class="inline-flex items-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-6 py-3 font-semibold text-midnight-100 transition-all hover:border-gold-500/50"
			>
				<ArrowLeft class="h-5 w-5" />
				Go Back
			</button>
		</div>
	</div>
</main>

<Footer />
