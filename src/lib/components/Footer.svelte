<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { cn } from '$lib/utils';
</script>

<footer class="relative border-t border-midnight-800/50 bg-midnight-950 pt-20 pb-12 overflow-hidden">
	<!-- Ambient Glow -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
	
	<!-- Background decoration -->
	<div class="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-gold-500/3 blur-[120px] pointer-events-none"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-12 md:grid-cols-4 lg:gap-16">
			<!-- Brand -->
			<div class="md:col-span-2">
				<a 
					href="/" 
					class="group inline-flex items-center gap-3 transition-all duration-300"
				>
					<div class={cn(
						'flex h-10 w-10 items-center justify-center rounded-xl',
						'bg-gradient-to-br from-gold-500 to-gold-600',
						'shadow-lg shadow-gold-500/20',
						'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
						'group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-gold-500/30'
					)}>
						<Icon name="candlestick" class="h-5 w-5 text-midnight-950 transition-transform duration-300 group-hover:scale-110" />
					</div>
					<span class="font-display text-xl font-bold tracking-tight text-midnight-50 transition-colors duration-300 group-hover:text-white">
						Trading<span class="text-gold-400 transition-colors duration-300 group-hover:text-gold-300">Greats</span>
					</span>
				</a>
				<p class="mt-6 max-w-md text-base leading-relaxed text-midnight-400">
					Explore the minds that moved markets. Discover legendary traders, their strategies, 
					and the timeless wisdom that has generated billions.
				</p>
			</div>

			<!-- Links -->
			<div>
				<h3 class="font-display text-sm font-semibold tracking-wider uppercase text-midnight-100">Explore</h3>
				<ul class="mt-6 space-y-4">
					{#each [
						{ href: '/traders', label: 'All Traders' },
						{ href: '/traders?style=Macro', label: 'Macro Traders' },
						{ href: '/traders?style=Value', label: 'Value Investors' },
						{ href: '/traders?style=Momentum', label: 'Momentum Traders' }
					] as link}
						<li>
							<a 
								href={link.href} 
								class="group inline-flex items-center gap-2 text-sm text-midnight-400 transition-all duration-300 hover:text-gold-400"
							>
								<span class="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-3"></span>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="font-display text-sm font-semibold tracking-wider uppercase text-midnight-100">Legal</h3>
				<ul class="mt-6 space-y-4">
					{#each [
						{ href: '/about', label: 'About' },
						{ href: '/privacy', label: 'Privacy' },
						{ href: '/terms', label: 'Terms' }
					] as link}
						<li>
							<a 
								href={link.href} 
								class="group inline-flex items-center gap-2 text-sm text-midnight-400 transition-all duration-300 hover:text-gold-400"
							>
								<span class="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-3"></span>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-16 flex flex-col items-center justify-between gap-6 border-t border-midnight-800/50 pt-8 sm:flex-row">
			<p class="text-sm text-midnight-500">
				© {new Date().getFullYear()} Trading Greats. All rights reserved.
			</p>
			<div class="flex items-center gap-4">
				{#each [
					{ href: 'https://twitter.com', icon: 'twitter' as const, label: 'Twitter' },
					{ href: 'https://github.com', icon: 'github' as const, label: 'GitHub' },
					{ href: 'mailto:hello@tradinggreats.com', icon: 'mail' as const, label: 'Email' }
				] as social}
					<a 
						href={social.href} 
						class={cn(
							'group flex h-10 w-10 items-center justify-center rounded-full',
							'bg-white/0 text-midnight-500',
							'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
							'hover:bg-gold-500/10 hover:text-gold-400 hover:scale-110',
							'active:scale-95'
						)}
						aria-label={social.label}
					>
						<Icon name={social.icon} class="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
