<script lang="ts">
	import { IconArrowUpRight, IconBrandGithub, IconBrandX, IconMail } from '@tabler/icons-svelte';
	const explore = [
		{ href: '/traders', label: 'All traders' },
		{ href: '/compare', label: 'Compare traders' },
		{ href: '/blog', label: 'Journal' },
		{ href: '/about', label: 'About us' }
	];
	const legal = [{ href: '/privacy', label: 'Privacy' }, { href: '/terms', label: 'Terms' }];
</script>

<footer class="site-footer">
	<div class="site-container">
		<div class="footer-main">
			<div class="footer-brand">
				<a href="/" class="brand"><img src="/brand/mark.svg" width="44" height="44" alt="" /><span>Trading Greats</span></a>
				<p>An independent library for curious minds. Explore the people, principles, and perspectives that shaped the markets.</p>
				<a class="contact" href="mailto:hello@tradinggreats.com">Get in touch <IconArrowUpRight size={16} stroke={1.6} /></a>
			</div>
			<div class="footer-links">
				<div><h2>Explore</h2><ul>{#each explore as link (link.href)}<li><a href={link.href}>{link.label}</a></li>{/each}</ul></div>
				<div><h2>Information</h2><ul>{#each legal as link (link.href)}<li><a href={link.href}>{link.label}</a></li>{/each}</ul></div>
			</div>
		</div>
		<div class="footer-bottom"><p>© {new Date().getFullYear()} Trading Greats. All rights reserved.</p><div class="socials"><a href="https://twitter.com" aria-label="Twitter"><IconBrandX size={19} stroke={1.6} /></a><a href="https://github.com" aria-label="GitHub"><IconBrandGithub size={20} stroke={1.6} /></a><a href="mailto:hello@tradinggreats.com" aria-label="Email"><IconMail size={20} stroke={1.6} /></a></div></div>
	</div>
</footer>
<style>
	.site-footer { --footer-bg:#0b151e; --footer-text:#f3f1eb; --footer-muted:#aeb9c0; --footer-line:rgba(218,222,219,.14); background:var(--footer-bg); color:var(--footer-text); border-top:1px solid var(--footer-line); padding:clamp(3.5rem,6vw,6rem) 0 1.5rem; }
	.footer-main { display:grid; gap:3rem; }
	.brand { display:inline-flex; align-items:center; gap:.8rem; color:var(--footer-text); text-decoration:none; font:400 1.35rem 'Playfair Display',Georgia,serif; letter-spacing:-.03em; }
	.footer-brand p { max-width:27rem; margin:1.25rem 0; color:var(--footer-muted); line-height:1.75; }
	.contact { display:inline-flex; gap:.7rem; align-items:center; color:#c9ad7d; border-bottom:1px solid currentColor; padding-bottom:.4rem; text-decoration:none; font-size:.875rem; font-weight:600; }
	.footer-links { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:2rem; }
	h2 { margin:0 0 1.2rem; color:#c9ad7d; font-size:.7rem; letter-spacing:.14em; text-transform:uppercase; }
	ul { list-style:none; margin:0; padding:0; } li + li { margin-top:.8rem; } li a { color:var(--footer-muted); text-decoration:none; font-size:.9rem; line-height:1.5; } li a:hover { color:var(--footer-text); }
	.footer-bottom { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem; margin-top:3.5rem; padding-top:1.25rem; border-top:1px solid var(--footer-line); color:var(--footer-muted); font-size:.75rem; }
	.footer-bottom p { margin:0; }.socials { display:flex; gap:.25rem; }.socials a { display:grid; place-items:center; width:2.75rem; height:2.75rem; color:var(--footer-muted); }.socials a:hover { color:var(--footer-text); }
	:global(html:not(.dark)) .site-footer { --footer-bg:#eeece6; --footer-text:#17232b; --footer-muted:#53636c; --footer-line:rgba(18,30,37,.16); background:var(--footer-bg); }
	:global(html:not(.dark)) .contact,:global(html:not(.dark)) h2 { color:#806336; }
	@media (min-width:48rem) { .footer-main { grid-template-columns:1.5fr 1fr; gap:4rem; } }
</style>
