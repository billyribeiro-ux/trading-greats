<script lang="ts">
	import { page } from '$app/stores';
	import { Icon } from '$lib/components/icons';

	// Get the error status code
	const status = $derived($page.status);
	const message = $derived($page.error?.message || 'Something went wrong');
</script>

<svelte:head>
	<title>{status === 404 ? 'Page Not Found' : 'Error'} | Trading Greats</title>
</svelte:head>

<!-- Navbar and Footer are rendered by the layout, so we don't need them here -->
<main class="flex min-h-screen items-center justify-center px-4">
	<div class="text-center">
		<p class="text-8xl font-bold text-gold-500">{status}</p>
		<h1 class="mt-4 font-display text-3xl font-bold text-midnight-50">
			{status === 404 ? 'Page Not Found' : 'Oops!'}
		</h1>
		<p class="mt-4 text-lg text-midnight-400">
			{status === 404 
				? "The page you're looking for doesn't exist or has been moved."
				: message}
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				<Icon name="home" class="h-5 w-5" />
				Go Home
			</a>
			<button
				onclick={() => history.back()}
				class="inline-flex items-center gap-2 rounded-xl border border-midnight-700 bg-midnight-800/50 px-6 py-3 font-semibold text-midnight-100 transition-all hover:border-gold-500/50"
			>
				<Icon name="arrow-left" class="h-5 w-5" />
				Go Back
			</button>
		</div>
	</div>
</main>
