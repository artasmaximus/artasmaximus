<script lang="ts">
	import { Spring } from 'svelte/motion';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import Reveal from '../Reveal.svelte';
	import { rippleTint } from '../Background/Background.svelte.ts';
	import { dominantColor } from '$lib/utils/dominantColor';
	import { prefersReducedMotion } from '$lib/utils/motion';

	let {
		src,
		alt = 'Artwork',
		onOpen
	}: {
		src: string;
		alt?: string;
		onOpen?: (detail: { src: string; alt: string; accent: string }) => void;
	} = $props();

	let accent = $state('#737373');

	function handleLoad(e: Event) {
		const color = dominantColor(e.currentTarget as HTMLImageElement);
		if (color) accent = color;
	}

	let hoverSpring = new Spring(0, {
		stiffness: 0.312,
		damping: 0.9379
	});

	const reduceMotion = prefersReducedMotion();
	let translateY = $derived(-10 * hoverSpring.current);

	function onMouseEnter() {
		if (!reduceMotion) hoverSpring.set(1);
		rippleTint.color = accent;
	}
	function onMouseLeave() {
		hoverSpring.set(0);
		rippleTint.color = null;
	}

	function open() {
		onOpen?.({ src, alt, accent });
	}
</script>

<Reveal>
	<GlassEffect>
		<button
			type="button"
			class="artwork-container"
			aria-label="Expand {alt}"
			onclick={open}
			onmouseenter={onMouseEnter}
			onmouseleave={onMouseLeave}
			style:transform="translate3d(0px, {translateY}px, 0px)"
		>
			<img {src} {alt} loading="lazy" onload={handleLoad} class="artwork aspect-auto rounded-lg" />
			<span class="border-overlay" style:border-color="rgba(255, 255, 255, 0.5)"></span>
		</button>
	</GlassEffect>
</Reveal>

<style>
	.artwork-container {
		display: block;
		position: relative;
		width: fit-content;
	}

	.artwork {
		border-radius: 0.5rem;
	}

	img {
		box-shadow:
			0 2px 3px -1px rgba(0, 0, 0, 0.16),
			0 5px 10px -4px rgba(0, 0, 0, 0.26);
		transition: box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	img:hover {
		box-shadow:
			0 7px 10px -3px rgba(0, 0, 0, 0.26),
			0 12px 17px -5px rgba(0, 0, 0, 0.21),
			0 18px 24px -8px rgba(0, 0, 0, 0.11);
	}

	.border-overlay {
		position: absolute;
		inset: 0;
		border: 2px solid;
		border-radius: 0.5rem;
		pointer-events: none;
		mix-blend-mode: overlay;
	}
</style>
