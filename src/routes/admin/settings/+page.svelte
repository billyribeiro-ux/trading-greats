<script lang="ts">
	import {
		TrendingUp,
		LogOut,
		Eye,
		Settings,
		Key,
		Shield,
		Monitor,
		AlertTriangle,
		Trash2,
		RefreshCw,
		Copy,
		Check,
		ChevronLeft,
		Lock,
		Unlock,
		Clock,
		Globe
	} from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let showRecoveryKey = $state(false);
	let copiedHash = $state(false);
	let copiedRecoveryKey = $state(false);
	let copiedRecoveryHash = $state(false);
	let isChangingPassword = $state(false);
	let isGeneratingKey = $state(false);

	function copyToClipboard(text: string, type: 'hash' | 'recoveryKey' | 'recoveryHash') {
		navigator.clipboard.writeText(text);
		if (type === 'hash') {
			copiedHash = true;
			setTimeout(() => copiedHash = false, 2000);
		} else if (type === 'recoveryKey') {
			copiedRecoveryKey = true;
			setTimeout(() => copiedRecoveryKey = false, 2000);
		} else {
			copiedRecoveryHash = true;
			setTimeout(() => copiedRecoveryHash = false, 2000);
		}
	}

	function formatDate(dateStr: string | null) {
		if (!dateStr) return 'Never';
		return new Date(dateStr).toLocaleString();
	}

	function getActionLabel(action: string) {
		const labels: Record<string, string> = {
			login_success: 'Login Success',
			login_failed: 'Login Failed',
			logout: 'Logout',
			session_created: 'Session Created',
			session_revoked: 'Session Revoked',
			session_expired: 'Session Expired',
			ip_blocked: 'IP Blocked',
			ip_unblocked: 'IP Unblocked',
			rate_limit_exceeded: 'Rate Limit Hit',
			suspicious_activity: 'Suspicious Activity'
		};
		return labels[action] || action;
	}

	function getActionColor(action: string) {
		if (action.includes('success') || action === 'logout' || action === 'ip_unblocked') {
			return 'bg-green-500/10 text-green-400';
		}
		if (action.includes('failed') || action === 'ip_blocked' || action === 'suspicious_activity') {
			return 'bg-red-500/10 text-red-400';
		}
		if (action === 'rate_limit_exceeded') {
			return 'bg-yellow-500/10 text-yellow-400';
		}
		return 'bg-blue-500/10 text-blue-400';
	}
</script>

<svelte:head>
	<title>Security Settings | Admin | Trading Greats</title>
</svelte:head>

<div class="min-h-screen bg-midnight-950">
	<!-- Header -->
	<header class="border-b border-midnight-800/50 bg-midnight-900/50 backdrop-blur-xl sticky top-0 z-50">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
					<TrendingUp class="h-5 w-5 text-midnight-950" />
				</div>
				<span class="font-display text-xl font-bold text-midnight-50">
					Trading<span class="text-gold-400">Greats</span>
					<span class="ml-2 rounded-full bg-gold-500/20 px-2.5 py-0.5 text-xs font-semibold text-gold-400 border border-gold-500/30">Admin</span>
				</span>
			</div>

			<div class="flex items-center gap-4">
				<a
					href="/"
					target="_blank"
					class="inline-flex items-center gap-2 text-sm text-midnight-400 hover:text-midnight-200 transition-colors"
				>
					<Eye class="h-4 w-4" />
					View Site
				</a>
				<form method="POST" action="/admin/logout">
					<button
						type="submit"
						class="flex items-center gap-2 text-sm text-midnight-400 hover:text-red-400 transition-colors"
					>
						<LogOut class="h-4 w-4" />
						Logout
					</button>
				</form>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Back Link -->
		<a
			href="/admin"
			class="inline-flex items-center gap-2 text-midnight-400 hover:text-midnight-200 transition-colors mb-6"
		>
			<ChevronLeft class="h-4 w-4" />
			Back to Dashboard
		</a>

		<!-- Page Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-2">
				<Settings class="h-8 w-8 text-gold-500" />
				<h1 class="font-display text-3xl font-bold text-midnight-50">Security Settings</h1>
			</div>
			<p class="text-midnight-400">Manage your password, sessions, and security settings.</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Password Change Section -->
			<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-6">
				<div class="flex items-center gap-3 mb-6">
					<Key class="h-6 w-6 text-gold-500" />
					<h2 class="text-xl font-semibold text-midnight-100">Change Password</h2>
				</div>

				{#if form?.passwordSuccess}
					<div class="mb-6 rounded-xl bg-green-500/10 border border-green-500/30 p-4">
						<p class="text-green-400 text-sm font-medium mb-2">Password changed successfully!</p>
						<p class="text-midnight-300 text-sm mb-4">
							Update your <code class="bg-midnight-800 px-2 py-0.5 rounded">.env</code> file with:
						</p>
						<div class="bg-midnight-950 rounded-lg p-3 flex items-center justify-between gap-2">
							<code class="text-xs text-gold-400 break-all">ADMIN_PASSWORD_HASH={form.newHash}</code>
							<button
								type="button"
								onclick={() => copyToClipboard(`ADMIN_PASSWORD_HASH=${form.newHash}`, 'hash')}
								class="shrink-0 p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 transition-colors"
							>
								{#if copiedHash}
									<Check class="h-4 w-4 text-green-400" />
								{:else}
									<Copy class="h-4 w-4 text-midnight-400" />
								{/if}
							</button>
						</div>
						<p class="text-yellow-400 text-xs mt-3">
							<AlertTriangle class="h-3 w-3 inline mr-1" />
							You've been logged out. Log in again after updating the .env file.
						</p>
					</div>
				{/if}

				<form
					method="POST"
					action="?/changePassword"
					use:enhance={() => {
						isChangingPassword = true;
						return async ({ update }) => {
							await update();
							isChangingPassword = false;
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="currentPassword" class="block text-sm font-medium text-midnight-300 mb-2">
							Current Password
						</label>
						<input
							type="password"
							id="currentPassword"
							name="currentPassword"
							required
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
							placeholder="Enter current password"
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
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
							placeholder="Min 12 characters, mixed case, numbers, symbols"
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
							class="w-full rounded-xl border border-midnight-700 bg-midnight-900/50 px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
							placeholder="Confirm new password"
						/>
					</div>

					{#if form?.passwordError}
						<p class="text-red-400 text-sm">
							<AlertTriangle class="h-4 w-4 inline mr-1" />
							{form.passwordError}
						</p>
					{/if}

					<button
						type="submit"
						disabled={isChangingPassword}
						class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-semibold text-midnight-950 hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isChangingPassword}
							<RefreshCw class="h-4 w-4 animate-spin" />
							Changing Password...
						{:else}
							<Key class="h-4 w-4" />
							Change Password
						{/if}
					</button>
				</form>

				<div class="mt-4 p-3 rounded-lg bg-midnight-800/50 text-midnight-400 text-xs">
					<p class="font-medium mb-1">Password Requirements:</p>
					<ul class="list-disc list-inside space-y-0.5">
						<li>At least 12 characters</li>
						<li>At least one uppercase letter</li>
						<li>At least one lowercase letter</li>
						<li>At least one number</li>
						<li>At least one special character</li>
					</ul>
				</div>
			</div>

			<!-- Recovery Key Section -->
			<div class="rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-6">
				<div class="flex items-center gap-3 mb-6">
					<Shield class="h-6 w-6 text-violet-500" />
					<h2 class="text-xl font-semibold text-midnight-100">Recovery Key</h2>
				</div>

				<p class="text-midnight-400 text-sm mb-6">
					Generate a recovery key that can be used to reset your password if you forget it.
					Store this key securely offline.
				</p>

				{#if form?.recoveryKey}
					<div class="mb-6 space-y-4">
						<div class="rounded-xl bg-violet-500/10 border border-violet-500/30 p-4">
							<p class="text-violet-400 text-sm font-medium mb-3">
								<AlertTriangle class="h-4 w-4 inline mr-1" />
								Save this key NOW! It won't be shown again.
							</p>

							<div class="space-y-3">
								<div>
									<p class="text-midnight-400 text-xs mb-1">Recovery Key (save this):</p>
									<div class="bg-midnight-950 rounded-lg p-3 flex items-center justify-between gap-2">
										<code class="text-sm text-gold-400 break-all font-mono">{form.recoveryKey}</code>
										<button
											type="button"
											onclick={() => copyToClipboard(form.recoveryKey, 'recoveryKey')}
											class="shrink-0 p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 transition-colors"
										>
											{#if copiedRecoveryKey}
												<Check class="h-4 w-4 text-green-400" />
											{:else}
												<Copy class="h-4 w-4 text-midnight-400" />
											{/if}
										</button>
									</div>
								</div>

								<div>
									<p class="text-midnight-400 text-xs mb-1">Recovery Hash (add to .env as RECOVERY_KEY_HASH):</p>
									<div class="bg-midnight-950 rounded-lg p-3 flex items-center justify-between gap-2">
										<code class="text-xs text-midnight-300 break-all">{form.recoveryHash}</code>
										<button
											type="button"
											onclick={() => copyToClipboard(`RECOVERY_KEY_HASH=${form.recoveryHash}`, 'recoveryHash')}
											class="shrink-0 p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 transition-colors"
										>
											{#if copiedRecoveryHash}
												<Check class="h-4 w-4 text-green-400" />
											{:else}
												<Copy class="h-4 w-4 text-midnight-400" />
											{/if}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<form
					method="POST"
					action="?/generateRecoveryKey"
					use:enhance={() => {
						isGeneratingKey = true;
						return async ({ update }) => {
							await update();
							isGeneratingKey = false;
						};
					}}
				>
					<button
						type="submit"
						disabled={isGeneratingKey}
						class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isGeneratingKey}
							<RefreshCw class="h-4 w-4 animate-spin" />
							Generating...
						{:else}
							<Shield class="h-4 w-4" />
							Generate New Recovery Key
						{/if}
					</button>
				</form>

				<p class="mt-4 text-midnight-500 text-xs">
					Generating a new key will invalidate any previous recovery key.
				</p>
			</div>
		</div>

		<!-- Active Sessions Section -->
		<div class="mt-8 rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-6">
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center gap-3">
					<Monitor class="h-6 w-6 text-blue-500" />
					<h2 class="text-xl font-semibold text-midnight-100">Active Sessions</h2>
				</div>

				<form method="POST" action="?/revokeAllSessions" use:enhance>
					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
					>
						<Trash2 class="h-4 w-4" />
						Revoke All
					</button>
				</form>
			</div>

			{#if form?.allSessionsRevoked}
				<div class="mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-3">
					<p class="text-yellow-400 text-sm">All sessions have been revoked. Please log in again.</p>
				</div>
			{/if}

			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-midnight-900/50">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Device</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">IP Address</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Last Activity</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Created</th>
							<th class="px-4 py-3 text-right text-xs font-medium text-midnight-400 uppercase tracking-wider">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-midnight-800/50">
						{#each data.sessions as session}
							<tr class="hover:bg-midnight-800/30 transition-colors {session.id === data.currentSessionId ? 'bg-gold-500/5' : ''}">
								<td class="px-4 py-3">
									<div class="flex items-center gap-2">
										<Monitor class="h-4 w-4 text-midnight-500" />
										<span class="text-sm text-midnight-200 truncate max-w-[200px]">
											{session.userAgent || 'Unknown'}
										</span>
										{#if session.id === data.currentSessionId}
											<span class="rounded-full bg-gold-500/20 px-2 py-0.5 text-xs text-gold-400">Current</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-300 font-mono">{session.ipAddress || 'Unknown'}</span>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-400">{formatDate(session.lastActivityAt)}</span>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-400">{formatDate(session.createdAt)}</span>
								</td>
								<td class="px-4 py-3 text-right">
									{#if session.id !== data.currentSessionId}
										<form method="POST" action="?/revokeSession" use:enhance class="inline">
											<input type="hidden" name="sessionId" value={session.id} />
											<button
												type="submit"
												class="text-sm text-red-400 hover:text-red-300 transition-colors"
											>
												Revoke
											</button>
										</form>
									{:else}
										<span class="text-sm text-midnight-600">-</span>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="px-4 py-8 text-center text-midnight-500">
									No active sessions
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Blocked IPs Section -->
		{#if data.blockedIps.length > 0}
			<div class="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
				<div class="flex items-center gap-3 mb-6">
					<Lock class="h-6 w-6 text-red-500" />
					<h2 class="text-xl font-semibold text-midnight-100">Blocked IP Addresses</h2>
				</div>

				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-midnight-900/50">
							<tr>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">IP Address</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Reason</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Blocked At</th>
								<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Expires</th>
								<th class="px-4 py-3 text-right text-xs font-medium text-midnight-400 uppercase tracking-wider">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-midnight-800/50">
							{#each data.blockedIps as block}
								<tr class="hover:bg-midnight-800/30 transition-colors">
									<td class="px-4 py-3">
										<span class="text-sm text-midnight-200 font-mono">{block.ipAddress}</span>
									</td>
									<td class="px-4 py-3">
										<span class="text-sm text-red-400">{block.reason}</span>
									</td>
									<td class="px-4 py-3">
										<span class="text-sm text-midnight-400">{formatDate(block.blockedAt)}</span>
									</td>
									<td class="px-4 py-3">
										<span class="text-sm text-midnight-400">{block.expiresAt ? formatDate(block.expiresAt) : 'Permanent'}</span>
									</td>
									<td class="px-4 py-3 text-right">
										<form method="POST" action="?/unblockIp" use:enhance class="inline">
											<input type="hidden" name="ipAddress" value={block.ipAddress} />
											<button
												type="submit"
												class="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
											>
												<Unlock class="h-3 w-3" />
												Unblock
											</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- Security Audit Log Section -->
		<div class="mt-8 rounded-2xl border border-midnight-800/50 bg-midnight-900/30 p-6">
			<div class="flex items-center gap-3 mb-6">
				<Clock class="h-6 w-6 text-emerald-500" />
				<h2 class="text-xl font-semibold text-midnight-100">Security Audit Log</h2>
			</div>

			<div class="overflow-x-auto max-h-96 overflow-y-auto">
				<table class="w-full">
					<thead class="bg-midnight-900/50 sticky top-0">
						<tr>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Time</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Action</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">IP Address</th>
							<th class="px-4 py-3 text-left text-xs font-medium text-midnight-400 uppercase tracking-wider">Details</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-midnight-800/50">
						{#each data.securityEvents as event}
							<tr class="hover:bg-midnight-800/30 transition-colors">
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-400">{formatDate(event.timestamp)}</span>
								</td>
								<td class="px-4 py-3">
									<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium {getActionColor(event.action)}">
										{getActionLabel(event.action)}
									</span>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-300 font-mono">{event.ipAddress || '-'}</span>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-midnight-500 truncate max-w-[300px] block">
										{event.details ? JSON.stringify(event.details) : '-'}
									</span>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-8 text-center text-midnight-500">
									No security events recorded
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
