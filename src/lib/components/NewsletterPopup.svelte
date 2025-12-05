<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from '$lib/components/icons';
	import { cn } from '$lib/utils';
	import { browser } from '$app/environment';

	interface Props {
		delay?: number;
		showOnScroll?: boolean;
		scrollThreshold?: number;
	}

	let {
		delay = 10000,
		showOnScroll = true,
		scrollThreshold = 50
	}: Props = $props();

	let visible = $state(false);
	let email = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let message = $state('');
	let emailInputRef = $state<HTMLInputElement | null>(null);

	const STORAGE_KEY = 'newsletter_popup_dismissed';
	const NEVER_SHOW_KEY = 'newsletter_popup_never_show';
	const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

	// Check for reduced motion preference
	const prefersReducedMotion = $derived(
		browser ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
	);

	function isDismissed(): boolean {
		if (!browser) return true;
		// Check "never show again" first
		if (localStorage.getItem(NEVER_SHOW_KEY) === 'true') return true;
		// Check temporary dismissal
		const dismissed = localStorage.getItem(STORAGE_KEY);
		if (!dismissed) return false;
		const dismissedAt = parseInt(dismissed, 10);
		return Date.now() - dismissedAt < DISMISS_DURATION;
	}

	function setDismissed(): void {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, Date.now().toString());
		}
	}

	function neverShowAgain(): void {
		if (browser) {
			localStorage.setItem(NEVER_SHOW_KEY, 'true');
		}
		visible = false;
	}

	function close(): void {
		visible = false;
		setDismissed();
	}

	async function subscribe(): Promise<void> {
		if (!email || status === 'loading') return;

		status = 'loading';
		message = '';

		try {
			const response = await fetch('/api/newsletter/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, source: 'popup' })
			});

			const data = await response.json();

			if (data.success) {
				status = 'success';
				message = data.message || 'Thanks for subscribing!';
				setTimeout(close, 3000);
			} else {
				status = 'error';
				message = data.message || 'Something went wrong. Please try again.';
			}
		} catch {
			status = 'error';
			message = 'Network error. Please try again.';
		}
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape' && visible) {
			close();
		}
	}

	// Focus management: focus email input when popup opens
	$effect(() => {
		if (visible && emailInputRef && status === 'idle') {
			// Small delay to ensure DOM is ready
			setTimeout(() => emailInputRef?.focus(), 100);
		}
	});

	onMount(() => {
		if (isDismissed()) return;

		let timeoutId: ReturnType<typeof setTimeout>;
		let scrollHandler: (() => void) | null = null;

		if (delay > 0) {
			timeoutId = setTimeout(() => {
				if (!isDismissed() && !visible) {
					visible = true;
				}
			}, delay);
		}

		if (showOnScroll) {
			scrollHandler = () => {
				const scrollPercent =
					(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
				if (scrollPercent >= scrollThreshold && !isDismissed() && !visible) {
					visible = true;
					if (scrollHandler) {
						window.removeEventListener('scroll', scrollHandler);
					}
				}
			};
			window.addEventListener('scroll', scrollHandler, { passive: true });
		}

		return () => {
			clearTimeout(timeoutId);
			if (scrollHandler) {
				window.removeEventListener('scroll', scrollHandler);
			}
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-midnight-950/80 backdrop-blur-sm transition-opacity duration-300"
		role="presentation"
		onclick={close}
		onkeydown={(e) => e.key === 'Enter' && close()}
	></div>

	<!-- Popup -->
	<div
		class={cn(
			'fixed inset-x-4 bottom-4 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[420px] z-50',
			!prefersReducedMotion && 'animate-in'
		)}
		role="dialog"
		aria-modal="true"
		aria-labelledby="newsletter-title"
		aria-describedby="newsletter-description"
	>
		<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-midnight-900 shadow-2xl shadow-midnight-950/50">
			<!-- Close button -->
			<button
				type="button"
				onclick={close}
				class="absolute top-3 right-3 p-1.5 rounded-lg text-midnight-400 hover:bg-white/10 hover:text-white transition-colors z-10"
				aria-label="Close newsletter popup"
			>
				<Icon name="x" class="h-4 w-4" />
			</button>

			<!-- Decorative gradient -->
			<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600"></div>
			<div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold-500/10 blur-3xl" aria-hidden="true"></div>

			<div class="relative p-6">
				<!-- Status announcements for screen readers -->
				<div aria-live="polite" aria-atomic="true" class="sr-only">
					{#if status === 'loading'}
						Subscribing to newsletter...
					{:else if status === 'success'}
						Successfully subscribed to the newsletter!
					{:else if status === 'error'}
						Error: {message}
					{/if}
				</div>

				{#if status === 'success'}
					<div class="text-center py-4">
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
							<Icon name="check-circle" class="h-8 w-8 text-green-400" />
						</div>
						<h3 class="font-display text-xl font-bold text-white mb-2">You're subscribed!</h3>
						<p class="text-sm text-midnight-300">{message}</p>
					</div>
				{:else}
					<div class="flex items-start gap-4 mb-5">
						<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400" aria-hidden="true">
							<Icon name="mail" class="h-6 w-6" />
						</div>
						<div>
							<h3 id="newsletter-title" class="font-display text-lg font-bold text-white">
								Get Trading Insights
							</h3>
							<p id="newsletter-description" class="text-sm text-midnight-300 mt-1">
								Join 10,000+ traders getting weekly wisdom from the legends.
							</p>
						</div>
					</div>

					<form
						onsubmit={(e) => { e.preventDefault(); subscribe(); }}
						class="space-y-3"
					>
						<div>
							<label for="newsletter-email" class="sr-only">Email address</label>
							<input
								id="newsletter-email"
								type="email"
								bind:this={emailInputRef}
								bind:value={email}
								placeholder="Enter your email"
								disabled={status === 'loading'}
								required
								autocomplete="email"
								aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
								class={cn(
									'w-full rounded-xl border bg-midnight-800/50 px-4 py-3 text-white placeholder-midnight-500',
									'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50',
									'transition-all duration-200 min-h-[48px]',
									status === 'error' ? 'border-red-500/50' : 'border-white/10'
								)}
							/>
						</div>

						{#if status === 'error' && message}
							<p id="newsletter-error" class="text-sm text-red-400" role="alert">{message}</p>
						{/if}

						<button
							type="submit"
							disabled={status === 'loading' || !email}
							class={cn(
								'w-full rounded-xl px-4 py-3 font-semibold transition-all duration-200 min-h-[48px]',
								'bg-gradient-to-r from-gold-500 to-gold-600 text-midnight-950',
								'hover:shadow-lg hover:shadow-gold-500/25',
								'disabled:opacity-50 disabled:cursor-not-allowed',
								'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-midnight-900',
								'flex items-center justify-center gap-2'
							)}
						>
							{#if status === 'loading'}
								<div class="h-4 w-4 animate-spin rounded-full border-2 border-midnight-950/30 border-t-midnight-950" aria-hidden="true"></div>
								<span>Subscribing...</span>
							{:else}
								<span>Subscribe</span>
								<Icon name="arrow-right" class="h-4 w-4" />
							{/if}
						</button>
					</form>

					<div class="mt-4 flex flex-col items-center gap-2">
						<p class="text-xs text-midnight-500">
							No spam, ever. Unsubscribe anytime.
						</p>
						<button
							type="button"
							onclick={neverShowAgain}
							class="text-xs text-midnight-600 hover:text-midnight-400 transition-colors underline underline-offset-2"
						>
							Don't show this again
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-in-from-bottom-5 {
		from {
			transform: translateY(1.25rem);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-in {
		animation: slide-in-from-bottom-5 0.3s ease-out;
	}

	/* Respect reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.animate-in {
			animation: none;
		}
	}
</style>
