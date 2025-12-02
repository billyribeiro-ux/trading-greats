<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article' | 'profile';
		publishedTime?: string;
		modifiedTime?: string;
		author?: string;
		noindex?: boolean;
	}

	let {
		title,
		description,
		image = `${PUBLIC_SITE_URL}/og-default.jpg`,
		type = 'website',
		publishedTime,
		modifiedTime,
		author,
		noindex = false
	}: Props = $props();

	const fullTitle = title === PUBLIC_SITE_NAME ? title : `${title} | ${PUBLIC_SITE_NAME}`;
	const canonicalUrl = $page.url.href;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
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
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalUrl} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />
</svelte:head>
