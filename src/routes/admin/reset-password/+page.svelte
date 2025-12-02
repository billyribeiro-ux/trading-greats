<script lang="ts">
	import {
		TrendingUp,
		Key,
		AlertTriangle,
		Check,
		Copy,
		RefreshCw,
		ChevronLeft,
		Shield
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let copiedHash = $state(false);
	let isResetting = $state(false);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		copiedHash = true;
		setTimeout(() => copiedHash = false, 2000);
	}
</script>

<svelte:head>
	<title>Reset Password | Admin | Trading Greats</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950 flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20 mb-4">
				<TrendingUp class="h-8 w-8 text-midnight-950" />
			</div>
			<h1 class="font-display text-2xl font-bold text-midnight-50">
				Trading<span class="text-gold-400">Greats</span>
			</h1>
			<p class="text-midnight-400 mt-2">Reset Admin Password</p>
		</div>

		<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-6">
			{#if form?.success}
				<!-- Success State -->
				<div class="text-center">
					<div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
						<Check class="h-8 w-8 text-green-400" />
					</div>
					<h2 class="text-xl font-semibold text-midnight-100 mb-2">Password Reset Successful</h2>
					<p class="text-midnight-400 text-sm mb-6">
						Your password has been changed. Update your .env file with the new hash:
					</p>

					<div class="bg-midnight-950 rounded-lg p-3 flex items-center justify-between gap-2 mb-6">
						<code class="text-xs text-gold-400 break-all text-left">ADMIN_PASSWORD_HASH={form.newHash}</code>
						<button
							type="button"
							onclick={() => copyToClipboard(`ADMIN_PASSWORD_HASH=${form.newHash}`)}
							class="shrink-0 p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 transition-colors"
						>
							{#if copiedHash}
								<Check class="h-4 w-4 text-green-400" />
							{:else}
								<Copy class="h-4 w-4 text-midnight-400" />
							{/if}
						</button>
					</div>

					<a
						href="/admin/login"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-midnight-950 hover:bg-gold-400 transition-colors w-full"
					>
						Go to Login
					</a>
				</div>
			{:else if !data.hasRecoveryKey}
				<!-- No Recovery Key Configured -->
				<div class="text-center">
					<div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 mb-4">
						<AlertTriangle class="h-8 w-8 text-yellow-400" />
					</div>
					<h2 class="text-xl font-semibold text-midnight-100 mb-2">Recovery Not Configured</h2>
					<p class="text-midnight-400 text-sm mb-6">
						Password recovery hasn't been set up. You'll need to manually reset the password
						by updating the ADMIN_PASSWORD_HASH in your .env file.
					</p>

					<div class="bg-midnight-800/50 rounded-lg p-4 text-left text-sm text-midnight-300 mb-6">
						<p class="font-medium mb-2">To generate a new password hash:</p>
						<ol class="list-decimal list-inside space-y-1 text-midnight-400">
							<li>Access your server terminal</li>
							<li>Run the password hash generator</li>
							<li>Update ADMIN_PASSWORD_HASH in .env</li>
							<li>Restart the server</li>
						</ol>
					</div>

					<a
						href="/admin/login"
						class="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
					>
						<ChevronLeft class="h-4 w-4" />
						Back to Login
					</a>
				</div>
			{:else}
				<!-- Reset Form -->
				<div class="flex items-center gap-3 mb-6">
					<Shield class="h-6 w-6 text-violet-500" />
					<h2 class="text-xl font-semibold text-midnight-100">Reset with Recovery Key</h2>
				</div>

				<form
					method="POST"
					use:enhance={() => {
						isResetting = true;
						return async ({ update }) => {
							await update();
							isResetting = false;
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="recoveryKey" class="block text-sm font-medium text-midnight-300 mb-2">
							Recovery Key
						</label>
						<input
							type="text"
							id="recoveryKey"
							name="recoveryKey"
							required
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono text-sm"
							placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-..."
						/>
					</div>

					<div>
						<label for="newPassword" class="block text-sm font-medium text-midnight-300 mb-2">
							New Password
						</label>
						<input
							type="password"
							id="newPassword"
							name="newPassword"
							required
							minlength="12"
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
							placeholder="Min 12 characters"
						/>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-midnight-300 mb-2">
							Confirm New Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							required
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
							placeholder="Confirm new password"
						/>
					</div>

					{#if form?.error}
						<div class="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
							<p class="text-red-400 text-sm">
								<AlertTriangle class="h-4 w-4 inline mr-1" />
								{form.error}
							</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isResetting}
						class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isResetting}
							<RefreshCw class="h-4 w-4 animate-spin" />
							Resetting Password...
						{:else}
							<Key class="h-4 w-4" />
							Reset Password
						{/if}
					</button>
				</form>

				<div class="mt-6 pt-6 border-t border-midnight-800/50 text-center">
					<a
						href="/admin/login"
						class="inline-flex items-center gap-2 text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
					>
						<ChevronLeft class="h-4 w-4" />
						Back to Login
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>
