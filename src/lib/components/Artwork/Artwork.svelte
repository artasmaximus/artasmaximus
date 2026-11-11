<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { ObserverEventDetails } from 'svelte-inview';
	import WaterEffect from '$lib/cursor/effects/WaterEffect.svelte';
	import { liveWater } from '$lib/water/controls.svelte';

	let {
		src,
		alt = 'Artwork',
		delay = 0,
		onOpen
	}: {
		src: string;
		alt?: string;
		/* Stagger, in ms, for tiles that arrive together. */
		delay?: number;
		onOpen?: (detail: { src: string; alt: string }) => void;
	} = $props();

	let visible = $state(false);
	// Loading is done here rather than with loading="lazy": the browser won't
	// lazy-load an image inside a fully clipped tile, which is how every tile
	// starts. The source is set once the tile is near the screen, the tile holds
	// a placeholder height until the drawing arrives, and only then wipes in.
	let near = $state(false);
	let loaded = $state(false);

	// Also catches a drawing that finished loading before the page hydrated.
	function ready(img: HTMLImageElement) {
		const done = () => {
			if (img.naturalWidth) loaded = true;
		};
		done();
		img.addEventListener('load', done);
		return { destroy: () => img.removeEventListener('load', done) };
	}

	function onChange({ detail }: CustomEvent<ObserverEventDetails>) {
		if (detail.inView) visible = true;
	}
</script>

<!-- Edge to edge: the drawing wipes up into its tile and settles from a slight zoom. -->
<div
	use:inview={{ rootMargin: '800px 0px', unobserveOnEnter: true }}
	oninview_change={({ detail }: CustomEvent<ObserverEventDetails>) => {
		if (detail.inView) near = true;
	}}
>
<div
	use:inview={{ rootMargin: '-8% 0px', unobserveOnEnter: true }}
	oninview_change={onChange}
	class="tile"
	class:in={visible && loaded}
	class:waiting={!loaded}
	style:--delay="{delay}ms"
>
	<div class="inner">
		<WaterEffect {src} settings={liveWater}>
			<button
				type="button"
				class="block w-full"
				aria-label="Expand {alt}"
				onclick={() => onOpen?.({ src, alt })}
			>
				<img
					src={near ? src : undefined}
					{alt}
					decoding="async"
					class="block h-auto w-full"
					use:ready
				/>
			</button>
		</WaterEffect>
	</div>
</div>
</div>

<style>
	.tile {
		overflow: hidden;
		background: #111;
	}

	.tile.waiting {
		min-height: 60vh;
	}

	.inner {
		clip-path: inset(100% 0 0 0);
		transform: scale(1.12);
		transform-origin: 50% 100%;
		transition:
			clip-path 1s cubic-bezier(0.2, 0.7, 0.2, 1) var(--delay),
			transform 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) var(--delay);
	}

	.tile.in .inner {
		clip-path: inset(0 0 0 0);
		transform: none;
	}
</style>
