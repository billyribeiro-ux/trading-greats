<script lang="ts">
	import { TrendingUp, Github, Twitter, Mail } from 'lucide-svelte';
</script>

<footer class="relative border-t border-midnight-800/50 bg-midnight-950 pt-20 pb-12">
	<!-- Ambient Glow -->
	<div class="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-50"></div>

	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid gap-12 md:grid-cols-4 lg:gap-16">
			<!-- Brand -->
			<div class="md:col-span-2">
				<a href="/" class="flex items-center gap-3 transition-opacity hover:opacity-80">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
						<TrendingUp class="h-5 w-5 text-midnight-950" />
					</div>
					<span class="font-display text-xl font-bold tracking-tight text-midnight-50">
						Trading<span class="text-gold-400">Greats</span>
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
					<li><a href="/traders" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">All Traders</a></li>
					<li><a href="/traders?style=Macro" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">Macro Traders</a></li>
					<li><a href="/traders?style=Value" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">Value Investors</a></li>
					<li><a href="/traders?style=Momentum" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">Momentum Traders</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="font-display text-sm font-semibold tracking-wider uppercase text-midnight-100">Legal</h3>
				<ul class="mt-6 space-y-4">
					<li><a href="/about" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">About</a></li>
					<li><a href="/privacy" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">Privacy</a></li>
					<li><a href="/terms" class="text-sm text-midnight-400 transition-colors hover:text-gold-400">Terms</a></li>
				</ul>
			</div>
		</div>

		<div class="mt-16 flex flex-col items-center justify-between gap-6 border-t border-midnight-800/50 pt-8 sm:flex-row">
			<p class="text-sm text-midnight-500">
				© {new Date().getFullYear()} Trading Greats. All rights reserved.
			</p>
			<div class="flex items-center gap-6">
				<a href="https://twitter.com" class="text-midnight-500 transition-colors hover:text-gold-400 hover:scale-110" aria-label="Twitter">
					<Twitter class="h-5 w-5" />
				</a>
				<a href="https://github.com" class="text-midnight-500 transition-colors hover:text-gold-400 hover:scale-110" aria-label="GitHub">
					<Github class="h-5 w-5" />
				</a>
				<a href="mailto:hello@tradinggreats.com" class="text-midnight-500 transition-colors hover:text-gold-400 hover:scale-110" aria-label="Email">
					<Mail class="h-5 w-5" />
				</a>
			</div>
		</div>
	</div>
</footer>
