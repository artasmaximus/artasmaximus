<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { scale as scaleTransition } from 'svelte/transition';
	import { GLASS_CURSOR_SHAPE, GLASS_CURSOR_STYLE } from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import ArtworkModal from './ArtworkModal.svelte';

	let { src, alt = 'Artwork' }: { src: string; alt?: string } = $props();

	let isModalOpen = $state(false);

	let hoverSpring = new Spring(0, {
		stiffness: 0.312,
		damping: 0.9379
	});

	let translateY = $derived(-20 * hoverSpring.current);
	let scale = $derived(1 + hoverSpring.current / 20);

	function onMouseEnter() {
		hoverSpring.set(1);
	}

	function onMouseLeave() {
		hoverSpring.set(0);
	}
</script>

<HoverEffect hoverShape={() => GLASS_CURSOR_SHAPE} hoverStyle={GLASS_CURSOR_STYLE}>
	<div
		class="artwork-container cursor-none"
		onkeydown={(e) => e.key === 'Enter' && (isModalOpen = true)}
		onclick={() => (isModalOpen = true)}
		onmouseenter={onMouseEnter}
		onmouseleave={onMouseLeave}
		role="button"
		tabindex="0"
		style:transform="translate3d(0px, {translateY}px, 0px) scale({scale})"
	>
		<img
			{src}
			{alt}
			loading="lazy"
			in:scaleTransition={{ duration: 500, start: 0.93 }}
			class="artwork aspect-auto rounded-xl"
		/>
		<div class="border-overlay" style:border-color="rgba(255, 255, 255, 0.5)"></div>
	</div>
</HoverEffect>

{#if isModalOpen}
	<ArtworkModal {src} {alt} onClose={() => (isModalOpen = false)} />
{/if}

<style>
	.artwork-container {
		position: relative;
		width: fit-content;
		perspective: 5.5cm;
	}

	.artwork {
		border-radius: 0.75rem;
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
		border-radius: 0.75rem;
		pointer-events: none;
		mix-blend-mode: overlay;
	}
</style>
