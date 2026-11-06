<script lang="ts">
	import { onMount } from 'svelte';
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Text from '$lib/components/Text.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

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

	// ---- responsive columns (explicit, so each can drift independently) -----
	let colCount = $state(3);

	onMount(() => {
		const mqs = [window.matchMedia('(min-width: 1280px)'), window.matchMedia('(min-width: 768px)')];
		const update = () => {
			colCount = mqs[0].matches ? 3 : mqs[1].matches ? 2 : 1;
		};
		update();
		mqs.forEach((m) => m.addEventListener('change', update));
		return () => mqs.forEach((m) => m.removeEventListener('change', update));
	});

	let cols = $derived.by(() => {
		const c: { src: string; i: number }[][] = Array.from({ length: colCount }, () => []);
		srcs.forEach((src, i) => c[i % colCount].push({ src, i }));
		return c;
	});

	// Per-column scroll drift: neighbouring waterfalls fall at slightly
	// different speeds.
	let scrollY = $state(0);
	const reduceMotion = prefersReducedMotion();
	const DRIFTS: Record<number, number[]> = {
		1: [0],
		2: [0.05, -0.04],
		3: [0.06, -0.05, 0.02]
	};

	// ---- viewer ---------------------------------------------------------------
	// The shared Lightbox shows one piece at a time; setting `current` opens it.
	let current = $state<number | null>(null);
	const items = srcs.map((src, i) => ({ src, alt: `Drawing ${i + 1}` }));
</script>

<svelte:window bind:scrollY />

<Seo title="Artwork" description="Drawings by Artas Alajbegu, made in Procreate on iPad Pro." />

<Section>
	<div class="flex w-full flex-col gap-16">
		<header class="flex flex-col gap-4">
			<Heading>Artwork</Heading>
			<Text tone="muted" twclass="max-w-prose text-lead">
				A collection of drawings, each made in Procreate on iPad Pro.
			</Text>
		</header>

		<div class="grid w-full gap-7" style="grid-template-columns: repeat({colCount}, 1fr);">
			{#each cols as col, ci}
				<div
					class="flex flex-col gap-7"
					style="transform: translateY({colCount > 1 && !reduceMotion
						? -scrollY * DRIFTS[colCount][ci]
						: 0}px);"
				>
					{#each col as item (item.src)}
						<Artwork src={item.src} alt="Drawing {item.i + 1}" onOpen={() => (current = item.i)} />
					{/each}
				</div>
			{/each}
		</div>
	</div>
</Section>

<Lightbox {items} bind:current label="Artwork viewer" noun="drawing" />
