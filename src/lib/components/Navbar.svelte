<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { IconSearch, IconMenu2, IconX, IconArrowUpRight } from '@tabler/icons-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchModal from './SearchModal.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/traders', label: 'Traders' },
		{ href: '/compare', label: 'Compare' },
		{ href: '/blog', label: 'Journal' },
		{ href: '/about', label: 'About' }
	];
	let mobileMenuOpen = $state(false);
	let searchOpen = $state(false);
	let menuButton = $state<HTMLButtonElement>();
	let mobileNav = $state<HTMLElement>();
	const active = (href: string) => href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	$effect(() => {
		if (!browser || !mobileMenuOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		mobileNav?.querySelector<HTMLAnchorElement>('a')?.focus();
		return () => { document.body.style.overflow = previousOverflow; };
	});
	$effect(() => {
		if (!browser) return;
		const desktop = window.matchMedia('(min-width: 64rem)');
		const onChange = (event: MediaQueryListEvent) => { if (event.matches) mobileMenuOpen = false; };
		desktop.addEventListener('change', onChange);
		return () => desktop.removeEventListener('change', onChange);
	});
	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && mobileMenuOpen) { mobileMenuOpen = false; menuButton?.focus(); }
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault(); mobileMenuOpen = false; searchOpen = true;
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />
<header class="site-header">
	<nav class="site-container header-inner" aria-label="Main navigation">
		<a href="/" class="brand" aria-label="Trading Greats home"><img src="/brand/mark.svg" width="40" height="40" alt="" /><span>Trading Greats</span></a>
		<div class="desktop-links">
			{#each links as link (link.href)}<a href={link.href} aria-current={active(link.href) ? 'page' : undefined}>{link.label}</a>{/each}
		</div>
		<div class="header-actions">
			<ThemeToggle />
			<button class="icon-button" type="button" aria-label="Search traders" onclick={() => searchOpen = true}><IconSearch size={20} stroke={1.6} /></button>
			<a class="header-cta" href="/traders">Explore profiles <IconArrowUpRight size={16} stroke={1.7} /></a>
			<button class="icon-button menu-toggle" type="button" bind:this={menuButton} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} onclick={() => mobileMenuOpen = !mobileMenuOpen}>{#if mobileMenuOpen}<IconX size={22} stroke={1.6} />{:else}<IconMenu2 size={22} stroke={1.6} />{/if}</button>
		</div>
	</nav>
	{#if mobileMenuOpen}
		<nav id="mobile-menu" bind:this={mobileNav} class="mobile-menu" aria-label="Mobile navigation">
			<div class="site-container mobile-links">
				{#each links as link (link.href)}<a href={link.href} aria-current={active(link.href) ? 'page' : undefined} onclick={() => mobileMenuOpen = false}>{link.label}<IconArrowUpRight size={18} stroke={1.6} /></a>{/each}
			</div>
		</nav>
	{/if}
</header>
<div class="header-spacer" aria-hidden="true"></div>
<SearchModal bind:open={searchOpen} onClose={() => { searchOpen = false; }} />

<style>
	.site-header { --header-bg:#0b151e; --header-text:#f3f1eb; --header-muted:#b6c0c2; --header-line:rgba(218,222,219,.14); position:fixed; z-index:50; inset:0 0 auto; background:var(--header-bg); color:var(--header-text); border-bottom:1px solid var(--header-line); }
	.header-inner { display:flex; align-items:center; justify-content:space-between; gap:1rem; height:5rem; }
	.header-spacer { height:5rem; }
	.brand { display:inline-flex; align-items:center; gap:.7rem; color:var(--header-text); text-decoration:none; white-space:nowrap; font-family:'Playfair Display',Georgia,serif; font-size:1.2rem; letter-spacing:-.03em; }
	.brand img { width:2.5rem; height:2.5rem; }
	.desktop-links { display:none; align-items:center; justify-content:center; gap:clamp(1rem,2vw,2rem); }
	.desktop-links a { color:var(--header-muted); font-size:.875rem; font-weight:600; text-decoration:none; padding:.6rem 0; border-bottom:1px solid transparent; }
	.desktop-links a:hover,.desktop-links a[aria-current='page'] { color:var(--header-text); border-color:#c9ad7d; }
	.header-actions { display:flex; align-items:center; justify-content:flex-end; gap:.15rem; }
	.icon-button { display:grid; place-items:center; width:2.75rem; height:2.75rem; border:0; background:transparent; color:var(--header-muted); cursor:pointer; }
	.icon-button:hover { color:var(--header-text); }
	.header-cta { display:none; align-items:center; gap:.8rem; margin-left:.8rem; padding:.65rem .9rem; border:1px solid rgba(201,173,125,.5); color:var(--header-text); font-size:.8rem; font-weight:600; text-decoration:none; white-space:nowrap; }
	.header-cta:hover { background:#c9ad7d; color:#111b23; }
	.mobile-menu { position:fixed; inset:5rem 0 0; overflow-y:auto; background:var(--header-bg); }
	.mobile-links { display:flex; flex-direction:column; padding-top:1rem; }
	.mobile-links a { display:flex; justify-content:space-between; align-items:center; min-height:3.75rem; color:var(--header-text); text-decoration:none; border-bottom:1px solid var(--header-line); font-size:1.1rem; }
	.mobile-links a[aria-current='page'] { color:#d5bc91; }
	:global(html:not(.dark)) .site-header { --header-bg:#f7f5f0; --header-text:#17232b; --header-muted:#53636c; --header-line:rgba(18,30,37,.16); background:var(--header-bg); }
	:global(html:not(.dark)) .mobile-links a[aria-current='page'] { color:#806336; }
	@media (min-width:64rem) { .header-inner { display:grid; grid-template-columns:1fr auto 1fr; } .desktop-links,.header-cta { display:flex; } .menu-toggle,.mobile-menu { display:none; } }
	@media (max-width:25rem) { .brand { font-size:1rem; gap:.45rem; } .brand img { width:2.2rem; height:2.2rem; } .header-inner { gap:.25rem; } }
</style>
