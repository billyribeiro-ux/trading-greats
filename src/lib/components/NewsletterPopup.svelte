<script lang="ts">
	import { IconMail, IconX, IconArrowRight, IconCircleCheck } from '@tabler/icons-svelte';
	import { tick } from 'svelte';
	import { browser } from '$app/env';

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
	let dialogRef = $state<HTMLDivElement>();
	let closeButton = $state<HTMLButtonElement>();

	const STORAGE_KEY = 'newsletter_popup_dismissed';
	const NEVER_SHOW_KEY = 'newsletter_popup_never_show';
	const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days


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

	function handleKeydown(event: KeyboardEvent): void {
		if (!visible) return;
		if (event.key === 'Escape') { event.preventDefault(); close(); return; }
		if (event.key !== 'Tab' || !dialogRef) return;
		const items = Array.from(dialogRef.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'));
		if (!items.length) { event.preventDefault(); return; }
		const first = items[0]; const last = items[items.length - 1];
		if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
		else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
	}

	$effect(() => {
		if (!visible || !browser) return;
		const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		let active = true;
		tick().then(() => { if (active) closeButton?.focus(); });
		return () => { active = false; previous?.focus(); };
	});

	// $effect runs client-side after mount; cleanup runs on destroy.
	$effect(() => {
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
				const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;

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
	<div class="newsletter-backdrop" role="presentation" onclick={close} onkeydown={(event) => { if (event.key === 'Enter') close(); }}></div>
	<div class="newsletter-dialog" bind:this={dialogRef} role="dialog" aria-modal="true" aria-labelledby="newsletter-title" aria-describedby="newsletter-description">
		<button type="button" class="close-button" bind:this={closeButton} onclick={close} aria-label="Close newsletter popup"><IconX size={20} stroke={1.6} /></button>
		<div aria-live="polite" aria-atomic="true" class="sr-only">{#if status === 'loading'}Subscribing…{:else if status === 'success'}Successfully subscribed!{:else if status === 'error'}{message}{/if}</div>
		{#if status === 'success'}
			<div class="newsletter-icon"><IconCircleCheck size={24} stroke={1.5} /></div>
			<p class="newsletter-eyebrow">THE LONG VIEW</p><h2 id="newsletter-title">Thank you for joining.</h2><p id="newsletter-description" class="newsletter-description">{message}</p>
		{:else}
			<div class="newsletter-icon"><IconMail size={23} stroke={1.5} /></div>
			<p class="newsletter-eyebrow">A NOTE FROM THE LIBRARY</p>
			<h2 id="newsletter-title">A little perspective,<br /><em>in your inbox.</em></h2>
			<p id="newsletter-description" class="newsletter-description">Ideas and stories from the traders who shaped the markets, delivered to your inbox.</p>
			<form onsubmit={(event) => { event.preventDefault(); subscribe(); }}>
				<label for="newsletter-email">Email address</label>
				<input id="newsletter-email" type="email" bind:value={email} placeholder="you@example.com" disabled={status === 'loading'} required autocomplete="email" aria-describedby={status === 'error' ? 'newsletter-error' : undefined} />
				{#if status === 'error' && message}<p id="newsletter-error" class="form-error" role="alert">{message}</p>{/if}
				<button class="subscribe" type="submit" disabled={status === 'loading' || !email}>{status === 'loading' ? 'Subscribing…' : 'Subscribe'} <IconArrowRight size={17} stroke={1.7} /></button>
			</form>
			<div class="newsletter-bottom"><span>Unsubscribe anytime.</span><button type="button" onclick={neverShowAgain}>Don’t show again</button></div>
		{/if}
	</div>
{/if}

<style>
	.newsletter-backdrop { position:fixed; inset:0; z-index:100; background:rgba(5,12,18,.66); }
	.newsletter-dialog { --popup-bg:#101d27; --popup-text:#f3f1eb; --popup-muted:#b6c0c2; --popup-line:rgba(218,222,219,.2); position:fixed; z-index:101; right:1.5rem; bottom:1.5rem; width:min(27rem,calc(100% - 3rem)); max-height:calc(100dvh - 3rem); overflow-y:auto; padding:clamp(1.5rem,4vw,2.25rem); background:var(--popup-bg); color:var(--popup-text); border:1px solid rgba(201,173,125,.4); box-shadow:0 24px 80px rgba(0,0,0,.28); animation:popup-enter .3s ease-out; }
	.close-button { position:absolute; right:1rem; top:1rem; display:grid; place-items:center; width:2.75rem; height:2.75rem; color:var(--popup-muted); background:transparent; border:0; cursor:pointer; }.close-button:hover { color:var(--popup-text); }
	.newsletter-icon { display:grid; place-items:center; width:2.75rem; height:2.75rem; border:1px solid rgba(201,173,125,.4); color:#c9ad7d; }
	.newsletter-eyebrow { margin:1.4rem 0 .8rem; color:#c9ad7d; font-size:.68rem; font-weight:700; letter-spacing:.15em; }
	h2 { margin:0; font:400 clamp(2rem,1.6vw + 1.5rem,2.6rem)/1.12 'Playfair Display',Georgia,serif; letter-spacing:-.035em; } em { color:#c9ad7d; font-weight:400; }
	.newsletter-description { margin:1rem 0 1.4rem; color:var(--popup-muted); font-size:.95rem; line-height:1.65; }
	form { display:grid; gap:.6rem; } label { font-size:.8rem; font-weight:600; color:var(--popup-text); } input { min-width:0; width:100%; min-height:3.2rem; padding:.75rem .9rem; border:1px solid var(--popup-line); background:transparent; color:var(--popup-text); font-size:1rem; } input::placeholder { color:var(--popup-muted); } input:focus-visible { outline:2px solid #c9ad7d; outline-offset:2px; }
	.subscribe { min-height:3.2rem; display:flex; align-items:center; justify-content:center; gap:.8rem; border:1px solid #c9ad7d; background:#c9ad7d; color:#111b23; font-weight:700; cursor:pointer; }.subscribe:hover { background:#e0c99e; }.subscribe:disabled { opacity:.5; cursor:not-allowed; }
	.form-error { margin:0; color:#ffb3a7; font-size:.85rem; }.newsletter-bottom { display:flex; flex-wrap:wrap; justify-content:space-between; gap:.75rem; margin-top:1.2rem; color:var(--popup-muted); font-size:.75rem; }.newsletter-bottom button { color:inherit; text-decoration:underline; text-underline-offset:.2em; cursor:pointer; }
	:global(html:not(.dark)) .newsletter-dialog { --popup-bg:#f7f5f0; --popup-text:#17232b; --popup-muted:#53636c; --popup-line:rgba(18,30,37,.25); }
	:global(html:not(.dark)) .newsletter-eyebrow,:global(html:not(.dark)) em,:global(html:not(.dark)) .newsletter-icon { color:#806336; } :global(html:not(.dark)) .form-error { color:#a12c21; }
	@keyframes popup-enter { from { opacity:0; transform:translateY(1rem); } to { opacity:1; transform:translateY(0); } }
	@media (max-width:30rem) { .newsletter-dialog { right:1rem; bottom:1rem; width:calc(100% - 2rem); max-height:calc(100dvh - 2rem); } }
	@media (prefers-reduced-motion:reduce) { .newsletter-dialog { animation:none; } }
</style>
