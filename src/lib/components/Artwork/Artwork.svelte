<script lang="ts">
	import { Spring } from 'svelte/motion';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import Reveal from '../Reveal.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	let {
		src,
		alt = 'Artwork',
		onOpen
	}: {
		src: string;
		alt?: string;
		onOpen?: (detail: { src: string; alt: string }) => void;
	} = $props();

	let hoverSpring = new Spring(0, {
		stiffness: 0.312,
		damping: 0.9379
	});

	const reduceMotion = prefersReducedMotion();
	let translateY = $derived(-10 * hoverSpring.current);

	function onMouseEnter() {
		if (!reduceMotion) hoverSpring.set(1);
	}
	function onMouseLeave() {
		hoverSpring.set(0);
	}

	function open() {
		onOpen?.({ src, alt });
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
			<img {src} {alt} loading="lazy" class="aspect-auto" />
		</button>
	</GlassEffect>
</Reveal>

<style>
	.artwork-container {
		display: block;
		position: relative;
		width: fit-content;
	}

</style>
