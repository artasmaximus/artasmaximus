<script lang="ts">
	import RoundedRectangle from './RoundedRectangle.svelte';
	import { cursorShape, cursorPosition } from '$lib/stores/EventBus';
	import { isCursorHovered } from '$lib/stores/EventBus';

	let pos = { x: 0, y: 0 };
	$: {
		if ($isCursorHovered) {
			pos = $cursorShape.position;
		} else {
			pos = $cursorPosition;
		}
	}
	$: ({ width, height, borderRadius, blendMode, fill, zIndex } = $cursorShape);

	function onpointermove(event: PointerEvent) {
		cursorPosition.set({ x: event.clientX, y: event.clientY });
	}

	$: style = `
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		width: 100%;
		height: 100%;
		cursor: none;
		z-index: ${zIndex};
		mix-blend-mode: ${blendMode};
	`;
</script>

<svelte:window on:pointermove={onpointermove} />

<svg {style}>
	<RoundedRectangle x={pos.x} y={pos.y} {width} {height} {borderRadius} {fill} />
</svg>
