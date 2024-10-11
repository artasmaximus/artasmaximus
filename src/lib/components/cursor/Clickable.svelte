<script lang="ts">
	import {
		cursorShape,
		cursorPosition,
		isCursorHovered,
		DEFAULT_CURSOR_SHAPE
	} from '$lib/stores/cursor';
	import type { ElementMeasurements } from '$lib/stores/elementMeasure';
	import { onDestroy } from 'svelte';

	export let tag: keyof HTMLElementTagNameMap = 'div';
	export let className: string = '';
	export let style: string = '';
	export let measureStore: any;

	let measurements: ElementMeasurements | null = null;

	measureStore.subscribe((value: ElementMeasurements) => {
		measurements = value;
	});

	const handleMouseEnter = () => {
		if (measurements) {
			isCursorHovered.set(true);
			cursorShape.set(measurements.cursorShape);
			cursorPosition.set(measurements.cursorPosition);
		}
	};

	const handleMouseLeave = (e: any) => {
		isCursorHovered.set(false);
		cursorShape.set(DEFAULT_CURSOR_SHAPE);
	};

	onDestroy(() => {
		measureStore.reset();
	});
</script>

<svelte:element
	this={tag}
	class={className + ' clickable'}
	{style}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="complementary"
>
	<slot />
</svelte:element>

<style>
	:global(.clickable) {
		cursor: none;
		width: fit-content;
	}
</style>
