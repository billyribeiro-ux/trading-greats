<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { env } from '$env/dynamic/public';
	import JsonLd from '$lib/components/JsonLd.svelte';

	const PUBLIC_SITE_URL = env.PUBLIC_SITE_URL || 'https://tradinggreats.com';
	const PUBLIC_SITE_NAME = env.PUBLIC_SITE_NAME || 'Trading Greats';

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Privacy Policy', url: `${PUBLIC_SITE_URL}/privacy` }
	];

	const lastUpdated = 'November 29, 2025';
</script>

<SEO
	title="Privacy Policy"
	description="Privacy Policy for Trading Greats. Learn how we collect, use, and protect your information."
/>

<JsonLd type="BreadcrumbList" {breadcrumbs} />

<div class="min-h-screen bg-midnight-950 pt-32 pb-24">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-16 text-center">
			<h1 class="font-display text-4xl font-bold text-white sm:text-5xl mb-4">Privacy Policy</h1>
			<p class="text-midnight-400">Last updated: {lastUpdated}</p>
		</div>

		<!-- Content -->
		<div class="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-midnight-200 prose-a:text-gold-400 hover:prose-a:text-gold-300 prose-strong:text-white">
			<h2>Introduction</h2>
			<p>
				Welcome to {PUBLIC_SITE_NAME}. We respect your privacy and are committed to protecting 
				your personal data. This privacy policy explains how we handle your information when 
				you visit our website.
			</p>

			<h2>Information We Collect</h2>
			<p>We collect minimal information to provide you with the best experience:</p>
			<ul>
				<li>Usage Data (pages visited, time spent, etc.)</li>
				<li>Device Information (browser type, device type)</li>
				<li>Cookies (for site functionality and analytics)</li>
			</ul>

			<h2>How We Use Your Information</h2>
			<p>We use this information to:</p>
			<ul>
				<li>Improve our website and content</li>
				<li>Analyze user behavior to understand what content is most valuable</li>
				<li>Ensure the security of our platform</li>
			</ul>

			<h2>Data Protection</h2>
			<p>
				We implement appropriate security measures to protect against unauthorized access, 
				alteration, disclosure, or destruction of your personal information.
			</p>

			<h2>Contact Us</h2>
			<p>
				If you have any questions about this Privacy Policy, please contact us.
			</p>
		</div>
	</div>
</div>
