<script lang="ts">
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import { CircleCheck, CircleX, ArrowRight } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<SEO
	title={data.success ? 'Email Verified - Trading Greats' : 'Verification Failed - Trading Greats'}
	description="Email verification for Trading Greats newsletter"
/>

<div class="min-h-screen bg-midnight-950 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<div class="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-8 text-center">
			{#if data.success}
				<div class="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
					<CircleCheck class="w-8 h-8 text-emerald-400" />
				</div>
				<h1 class="text-2xl font-bold text-white mb-3">Email Verified!</h1>
				<p class="text-midnight-400 mb-8">
					{data.message}
				</p>
				<p class="text-midnight-400 mb-8">
					You're now subscribed to receive trading insights from legendary investors.
				</p>
			{:else}
				<div class="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
					<CircleX class="w-8 h-8 text-red-400" />
				</div>
				<h1 class="text-2xl font-bold text-white mb-3">Verification Failed</h1>
				<p class="text-midnight-400 mb-8">
					{data.message}
				</p>
			{/if}

			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				Go to Homepage
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>
</div>
