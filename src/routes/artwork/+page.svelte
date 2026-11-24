<script lang="ts">
	import { onMount } from 'svelte';
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import { navTheme } from '$lib/components/Navbar/NavbarState.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// Vite bundles all images at build time — no per-card runtime async imports
	const rawModules = import.meta.glob('/src/lib/assets/artwork/drawing*.jpeg', {
		eager: true,
		import: 'default'
	});

	const srcs: string[] = Object.entries(rawModules)
		.sort(([a], [b]) => {
			const n = (p: string) => parseInt(p.match(/drawing(\d+)/)?.[1] ?? '0');
			return n(a) - n(b);
		})
		.map(([, src]) => src as string);

	// ---- responsive columns (explicit, so each column can be its own waterfall) -----
	let colCount = $state(3);

	onMount(() => {
		const mqs = [window.matchMedia('(min-width: 1280px)'), window.matchMedia('(min-width: 768px)')];
		const update = () => {
			colCount = mqs[0].matches ? 3 : mqs[1].matches ? 2 : 1;
		};
		update();
		mqs.forEach((m) => m.addEventListener('change', update));

		// The drawings run under the navbar, which stays out of the way until called.
		navTheme.overlay = true;
		return () => {
			mqs.forEach((m) => m.removeEventListener('change', update));
			navTheme.overlay = false;
		};
	});

	let cols = $derived.by(() => {
		const c: { src: string; i: number }[][] = Array.from({ length: colCount }, () => []);
		srcs.forEach((src, i) => c[i % colCount].push({ src, i }));
		return c;
	});

	// ---- viewer ---------------------------------------------------------------
	// The shared Lightbox shows one piece at a time; setting `current` opens it.
	let current = $state<number | null>(null);
	const items = srcs.map((src, i) => ({ src, alt: `Drawing ${i + 1}` }));
</script>

<Seo title="Artwork" description="Drawings by Artas Alajbegu, made in Procreate on iPad Pro." />

<h1 class="sr-only">Artwork: drawings made in Procreate on iPad Pro</h1>

<!-- Edge to edge: no margins or gaps, the drawings fill the page. -->
<div class="grid w-full" style="grid-template-columns: repeat({colCount}, 1fr);">
	{#each cols as col, ci}
		<div class="flex flex-col">
			{#each col as item (item.src)}
				<Artwork
					src={item.src}
					alt="Drawing {item.i + 1}"
					delay={ci * 90}
					onOpen={() => (current = item.i)}
				/>
			{/each}
		</div>
	{/each}
</div>

<Lightbox {items} bind:current label="Artwork viewer" noun="drawing" />

