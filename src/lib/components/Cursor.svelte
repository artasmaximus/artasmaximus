<script lang="ts">
	import { cursorShapeEvent, cursorFocusEvent, mouseMoveEvent } from '$lib/stores/EventBus';
	import { onDestroy } from 'svelte';
	$: isHovered = $cursorFocusEvent.isFocused;
	let cursorWidth = 15;
	let cursorHeight = 15;
	let top = 0;
	let left = 0;
	let cursor: HTMLElement;

	$: if (isHovered) {
		if (cursor) {
			cursor.style.transition =
				'width 0.1s, height 0.3s, border-radius 0.3s, top 0.15s, left 0.15s';
		}
		cursorWidth = $cursorShapeEvent.width;
		cursorHeight = $cursorShapeEvent.height;
		top = $cursorShapeEvent.top;
		left = $cursorShapeEvent.left;
	} else {
		cursorWidth = 15;
		cursorHeight = 15;
		top = $mouseMoveEvent.y - cursorHeight / 2;
		left = $mouseMoveEvent.x - cursorWidth / 2;
		setTimeout(() => {
			if (cursor) {
				cursor.style.transition = 'width 0.1s, height 0.3s, border-radius 0.3s';
			}
		}, 80);
	}

	// Subscribe to hover and leave events from the global store
	const unsubscribeHover = cursorShapeEvent.subscribe((event: any) => {
		cursorWidth = event.width; // Adjust as needed
		cursorHeight = event.height; // Adjust as needed
		cursorFocusEvent.set({ isFocused: true });
	});

	// Clean up subscriptions on destroy
	onDestroy(() => {
		unsubscribeHover();
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="customCursor"
	style="top: {top}px; left: {left}px; width: {cursorWidth}px; height: {cursorHeight}px; border-radius: {$cursorShapeEvent.borderRadius};"
	bind:this={cursor}
></div>

<style>
	.customCursor {
		position: fixed;
		top: 0;
		left: 0;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background-color: #fff;
		pointer-events: none;
		z-index: 1000;
		background-blend-mode: difference;
		mix-blend-mode: difference;
		transition:
			width 0.3s,
			height 0.3s,
			border-radius 0.3s;
	}
</style>
