<script lang="ts">
	import { cursorShapeEvent, cursorFocusEvent } from '$lib/stores/EventBus';

	let clickable: HTMLElement;
	export let options: any = {};

	function handleMouseEnter(e: any) {
		const rect = clickable.getBoundingClientRect();
		// Update the global store with the clickable dimensions and position
		let { padding_x, padding_y } = options;
		padding_x = padding_x || 0;
		padding_y = padding_y || 0;
		cursorShapeEvent.set({
			width: rect.width + padding_x * 2,
			height: rect.height + padding_y * 2,
			left: rect.left - padding_x,
			top: rect.top - padding_y,
			borderRadius: options.borderRadius || '50%'
		});

		cursorFocusEvent.set({ isFocused: true });
	}

	function handleMouseLeave() {
		$cursorShapeEvent.width = 15;
		$cursorShapeEvent.height = 15;
		cursorFocusEvent.set({ isFocused: false });
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="clickable"
	bind:this={clickable}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
>
	<slot></slot>
</div>

<style>
	.clickable {
		cursor: none;
		place-items: center;
		width: fit-content;
	}
</style>
