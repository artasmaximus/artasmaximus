<script lang="ts">
	import { GLASS_CURSOR_SHAPE, GLASS_CURSOR_STYLE } from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import { onMount } from 'svelte';
	import ArtworkModal from './ArtworkModal.svelte';
	import { Spring } from 'svelte/motion';
	import IntersectionOberserver from '../IntersectionObserver/IntersectionOberserver.svelte';
	import { scale as scaleTransition } from 'svelte/transition';

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
	const hoverSpring = new Spring(0, {
		stiffness: 0.112, // Lower stiffness for more elasticity
		damping: 0.2279 // Slight underdamping for subtle bounce
	});

	// State to track current spring value
	let springValue = $state(0);

	// Update spring value on each animation frame
	function updateSpringValue() {
		springValue = hoverSpring.current;
		requestAnimationFrame(updateSpringValue);
	}

	onMount(() => {
		// Start animation loop
		updateSpringValue();
		return () => {
			// Clean up if needed
		};
	});

	// Derive all animation values from the single spring value
	function getTranslateY() {
		return -10 * springValue; // 0 to -10px
	}

	function getScale() {
		return 1 + 0.0809 * springValue; // 1 to 1.0809
	}

	function getShadowBlur() {
		return 12 + 20 * springValue; // 12px to 32px
	}

	function getBorderOpacity() {
		return 0.1618 + 0.4382 * springValue; // 0.1618 to 0.6
	}

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
		style:transform="translate3d(0px, {getTranslateY()}px, 0px) scale({getScale()})"
	>
		<IntersectionOberserver>
			<img
				{src}
				in:scaleTransition={{ duration: 500, start: 0.93 }}
				alt="Drawing {index}"
				class="artwork aspect-auto rounded-xl"
				style:box-shadow="0px {Math.abs(getTranslateY()) + 8}px {getShadowBlur()}px -{Math.floor(
					getShadowBlur() / 3
				)}px rgba(0, 0, 0, {0.8 - (getScale() - 1) * 3})"
			/>

			<div
				class="border-overlay"
				style:border-color="rgba(255, 255, 255, {getBorderOpacity()})"
			></div>
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
		/* No transition needed, spring handles animation */
	}

	.artwork {
		border-radius: 0.75rem;
		/* No fixed box-shadow, controlled by spring */
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
