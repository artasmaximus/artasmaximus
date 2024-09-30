<script lang="ts">
	import { cursorShape, cursorPosition, isCursorHovered } from '$lib/stores/EventBus';
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import type { CursorShape } from '$lib/stores/EventBus';

	// PROPERTIES
	export let hoveredCursorShape: CursorShape;

	const dispatch = createEventDispatcher();
	let clickable: HTMLElement;
	let dimensions = { width: 0, height: 0, x: 0, y: 0 };

	const getDefaultCursor = () => ({
		position: $cursorPosition,
		width: 20,
		height: 20,
		borderRadius: 10,
		blendMode: 'difference',
		fill: 'white',
		zIndex: 1000
	});

	function updateDimensions() {
		if (clickable) {
			const rect = clickable.getBoundingClientRect();
			dimensions = {
				width: rect.width,
				height: rect.height,
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2
			};
		}
	}

	onMount(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	});

	afterUpdate(updateDimensions);

	function onHover() {
		dispatch('CursorChange');
		cursorShape.set({
			...hoveredCursorShape,
			position: { x: dimensions.x, y: dimensions.y }
		});
		isCursorHovered.set(true);
		console.log('Current cursor shape:', $cursorShape);
	}

	function onLeave() {
		dispatch('CursorChange');
		cursorShape.set(getDefaultCursor());
		isCursorHovered.set(false);
	}

	export function getCenterPosition() {
		return { x: dimensions.x, y: dimensions.y };
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="clickable" on:mouseenter={onHover} on:mouseleave={onLeave} bind:this={clickable}>
	<slot></slot>
</div>

<style>
	.clickable {
		display: flex;
		cursor: none;
		place-items: center;
		justify-content: center;
		align-items: center;
		align-content: center;
		width: 100%;
		height: 100%;
	}
</style>
