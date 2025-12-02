<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';
	import JsonLd from '$lib/components/JsonLd.svelte';

	const breadcrumbs = [
		{ name: 'Home', url: PUBLIC_SITE_URL },
		{ name: 'Terms of Service', url: `${PUBLIC_SITE_URL}/terms` }
	];

	const lastUpdated = 'November 29, 2025';
</script>

<SEO
	title="Terms of Service"
	description="Terms of Service for Trading Greats. Please read these terms carefully before using our website."
/>

<JsonLd type="BreadcrumbList" {breadcrumbs} />

<div class="min-h-screen bg-midnight-950 pt-32 pb-24">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-16 text-center">
			<h1 class="font-display text-4xl font-bold text-white sm:text-5xl mb-4">Terms of Service</h1>
			<p class="text-midnight-400">Last updated: {lastUpdated}</p>
		</div>

		<!-- Content -->
		<div class="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-midnight-200 prose-a:text-gold-400 hover:prose-a:text-gold-300 prose-strong:text-white">
			<h2>Agreement to Terms</h2>
			<p>
				By accessing {PUBLIC_SITE_NAME}, you agree to be bound by these Terms of Service. 
				If you disagree with any part of these terms, you may not access the website.
			</p>

			<h2>Intellectual Property</h2>
			<p>
				The content on this website, including text, graphics, logos, and images, is the 
				property of {PUBLIC_SITE_NAME} and is protected by copyright and other intellectual 
				property laws.
			</p>

			<h2>Use License</h2>
			<p>
				Permission is granted to temporarily download one copy of the materials (information 
				or software) on {PUBLIC_SITE_NAME}'s website for personal, non-commercial transitory 
				viewing only.
			</p>

			<h2>Disclaimer</h2>
			<p>
				The materials on {PUBLIC_SITE_NAME}'s website are provided on an 'as is' basis. 
				{PUBLIC_SITE_NAME} makes no warranties, expressed or implied, and hereby disclaims 
				and negates all other warranties including, without limitation, implied warranties 
				or conditions of merchantability, fitness for a particular purpose, or non-infringement 
				of intellectual property or other violation of rights.
			</p>

			<h2>Limitations</h2>
			<p>
				In no event shall {PUBLIC_SITE_NAME} or its suppliers be liable for any damages 
				(including, without limitation, damages for loss of data or profit, or due to 
				business interruption) arising out of the use or inability to use the materials on 
				{PUBLIC_SITE_NAME}'s website.
			</p>
		</div>
	</div>
</div>
