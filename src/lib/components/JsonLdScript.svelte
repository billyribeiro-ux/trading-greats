<!--
  JsonLdScript: safe inline JSON-LD renderer.
  Escapes `<` and `>` to Unicode so any string containing closing-tag-like
  sequences can't break out of the LD+JSON block. Use inside <svelte:head>.
-->
<script lang="ts">
	interface Props {
		data: unknown;
	}

	let { data }: Props = $props();

	const safe = $derived(
		data ? JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e') : ''
	);
</script>

{#if data}
	{@html `<script type="application/ld+json">${safe}</script>`}
{/if}
