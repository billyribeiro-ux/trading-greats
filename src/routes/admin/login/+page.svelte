<script lang="ts">
	import { enhance } from '$app/forms';
	import { Icon } from '$lib/components/icons';

	let { form } = $props();
</script>

<svelte:head>
	<title>Admin Login | Trading Greats</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-midnight-950 px-4">
	<div class="w-full max-w-md">
		<div class="text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
				<Icon name="lock" class="h-8 w-8 text-midnight-950" />
			</div>
			<h1 class="mt-6 font-display text-3xl font-bold text-midnight-50">Admin Access</h1>
			<p class="mt-2 text-midnight-400">Enter your password to continue</p>
		</div>

		{#if form?.message}
			<div class="mt-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
				<Icon name="alert-circle" class="h-5 w-5 flex-shrink-0" />
				<p class="text-sm">{form.message}</p>
			</div>
		{/if}

		<form method="POST" use:enhance class="mt-8">
			<div>
				<label for="password" class="block text-sm font-medium text-midnight-300">
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="mt-2 block w-full rounded-xl border border-midnight-700 bg-midnight-800/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
					placeholder="Enter admin password"
				/>
			</div>

			<button
				type="submit"
				class="mt-6 w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-3 font-semibold text-midnight-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/30"
			>
				Sign In
			</button>
		</form>

		<div class="mt-8 flex items-center justify-between text-sm text-midnight-500">
			<a href="/" class="text-gold-400 hover:text-gold-300">← Back to site</a>
			<a href="/admin/reset-password" class="text-midnight-400 hover:text-midnight-200">Forgot password?</a>
		</div>
	</div>
</main>
