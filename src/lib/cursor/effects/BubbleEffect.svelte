<script lang="ts">
	import {
		cursorState,
		DEFAULT_SHAPE,
		type CursorShapeParams,
		type CursorStyleParams
	} from '../CursorState.svelte';

	const {
		children,
		padding,
		br,
		cursorStyle,
		twclass
	}: {
		children: () => any;
		padding: number;
		br: number;
		cursorStyle: CursorStyleParams;
		twclass?: string;
	} = $props();

	let bubbleEl: HTMLElement;

	function getShape(rect: DOMRect): CursorShapeParams {
		return {
			width: rect.width + padding * 2,
			height: rect.height + padding * 2,
			borderRadius: br
		};
	}

	function getCenter(rect: DOMRect) {
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2
		};
	}

	function onmouseenter() {
		const rect = bubbleEl.getBoundingClientRect();
		cursorState.isHovering = true;
		cursorState.isLockedPos = true;
		cursorState.shape.target = getShape(rect);
		cursorState.setStyle(cursorStyle);
		const center = getCenter(rect);
		cursorState.HoverTargetPos = center;
		cursorState.setPosition(center);
	}

	function onmouseleave() {
		cursorState.isHovering = false;
		cursorState.isLockedPos = false;
		cursorState.reset();
	}
</script>

<div
	bind:this={bubbleEl}
	{onmouseenter}
	{onmouseleave}
	class="bubbleEffect {twclass ?? ''}"
	role="complementary"
>
	{@render children()}
</div>

<style>
	.bubbleEffect {
		display: block;
		position: relative;
	}
</style>
