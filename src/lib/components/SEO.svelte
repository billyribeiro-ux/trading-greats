<script lang="ts">
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';

	const PUBLIC_SITE_URL = env.PUBLIC_SITE_URL || 'https://tradinggreats.com';
	const PUBLIC_SITE_NAME = env.PUBLIC_SITE_NAME || 'Trading Greats';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article' | 'profile';
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
		noindex?: boolean;
		// Google Nov 2025 - Enhanced SEO signals
		keywords?: string[];
		preloadImage?: boolean;
	}

	let {
		title,
		description,
		image = `${PUBLIC_SITE_URL}/og-default.jpg`,
		type = 'website',
		publishedTime,
		modifiedTime,
		author,
		noindex = false,
		keywords = [],
		preloadImage = false
	}: Props = $props();

	const fullTitle = $derived(title === PUBLIC_SITE_NAME ? title : `${title} | ${PUBLIC_SITE_NAME}`);
	// Normalize canonical URL - remove trailing slashes and query params for consistency
	const canonicalUrl = $derived.by(() => {
		const url = new URL($page.url.href);
		url.search = ''; // Remove query params from canonical
		return url.href.replace(/\/$/, '') || url.href;
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags - Google Nov 2025 Best Practices -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	
	{#if keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<!-- Google Nov 2025: max-image-preview:large for better SERP display -->
		<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	{/if}
	
	<!-- Google Nov 2025: Preload LCP image for Core Web Vitals -->
	{#if preloadImage && image}
		<link rel="preload" as="image" href={image} fetchpriority="high" />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={fullTitle} />
	<meta property="og:site_name" content={PUBLIC_SITE_NAME} />
	<meta property="og:locale" content="en_US" />

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#if type === 'article' && modifiedTime}
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	{#if author}
		<meta property="article:author" content={author} />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={fullTitle} />
	
	<!-- Google Nov 2025: Mobile-first indexing signals -->
	<meta name="format-detection" content="telephone=no" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>
