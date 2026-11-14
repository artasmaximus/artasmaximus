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
	// Loading is done here rather than with loading="lazy", so a tile knows when
	// its drawing is ready: the source is set once the tile is near the screen,
	// the tile holds a placeholder height until the drawing arrives, and only
	// then does it fade in.
	let near = $state(false);
	let loaded = $state(false);

	// A small, stable offset per drawing (from its path, so server and browser
	// agree), so tiles surface unevenly instead of in rows.
	const drift = [...src].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 320;

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

<!-- Edge to edge: each drawing condenses out of a bright haze into focus. -->
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
	style:--delay="{delay + drift}ms"
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
	}

	.tile.waiting {
		min-height: 60vh;
	}

	/* Starts as light: invisible, deeply blurred, overexposed and drained of
	   color, a little large and low. Opacity arrives first, then the haze
	   slowly condenses into focus while the drawing drifts up into place. */
	.inner {
		opacity: 0;
		filter: blur(28px) brightness(1.6) saturate(0.3);
		transform: translateY(14px) scale(1.04);
		transition:
			opacity 1.4s cubic-bezier(0.25, 0.1, 0.25, 1) var(--delay),
			filter 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) var(--delay),
			transform 2.8s cubic-bezier(0.22, 0.61, 0.36, 1) var(--delay);
	}

	.tile.in .inner {
		opacity: 1;
		filter: none;
		transform: none;
	}
</style>
