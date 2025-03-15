<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { scale as scaleTransition } from 'svelte/transition';
	import { GLASS_CURSOR_SHAPE, GLASS_CURSOR_STYLE } from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import ArtworkModal from './ArtworkModal.svelte';
	import IntersectionOberserver from '../IntersectionObserver/IntersectionOberserver.svelte';

	let { index } = $props();

	let isModalOpen = $state(false);

	let src = $state<any>();
	onMount(async () => {
		let fileName = `drawing${index}`;
		src = (await import(`$lib/assets/artwork/${fileName}.jpeg`)).default;
	});

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	// Create a single spring with physics parameters tuned for organic motion
	let hoverSpring = new Spring(0, {
		stiffness: 0.312, // Lower stiffness for more elasticity
		damping: 0.9379 // Slight underdamping for subtle bounce
	});

	let translateY = $derived(-20 * hoverSpring.current);
	let scale = $derived(1 + hoverSpring.current / 20);

	function onMouseEnter() {
		hoverSpring.set(1); // Target fully hovered state
	}

	function onMouseLeave() {
		hoverSpring.set(0); // Target non-hovered state
	}
</script>

<HoverEffect hoverShape={() => GLASS_CURSOR_SHAPE} hoverStyle={GLASS_CURSOR_STYLE}>
	<div
		class="artwork-container cursor-none"
		onkeydown={(e) => e.key === 'Enter' && openModal()}
		onclick={openModal}
		onmouseenter={onMouseEnter}
		onmouseleave={onMouseLeave}
		role="button"
		tabindex="0"
		style:transform="translate3d(0px, {translateY}px, 0px) scale({scale})"
	>
		<IntersectionOberserver>
			<img
				{src}
				in:scaleTransition={{ duration: 500, start: 0.93 }}
				alt="Drawing {index}"
				class="artwork aspect-auto rounded-xl"
			/>

			<div class="border-overlay" style:border-color="rgba(255, 255, 255, 0.5)"></div>
		</IntersectionOberserver>
	</div>
</HoverEffect>

{#if isModalOpen}
	<ArtworkModal {src} alt="Drawing {index}" onClose={closeModal} />
{/if}

<style>
	.artwork-container {
		position: relative;
		width: fit-content;
		perspective: 5.5cm;
		/* No transition needed, spring handles animation */
	}

	.artwork {
		border-radius: 0.75rem;
		/* No fixed box-shadow, controlled by spring */
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
		border: 2px solid; /* Color controlled via style directive */
		border-radius: 0.75rem;
		pointer-events: none;
		mix-blend-mode: overlay;
	}
</style>
