<script lang="ts">
	import { onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';
	import {
		cursorPosition,
		cursorShape,
		isCursorHovered,
		customCursorPosition,
		customCursorShape,
		DEFAULT_CURSOR_SHAPE
	} from '$lib/stores/cursor'; // Ensure you have this store defined

	let POSITION_STIFFNESS = 0.5;
	let POSITION_DAMPING = 0.9;
	let POSITION_PRECISION = 0.01;

	let WIDTH_STIFFNESS = 0.2;
	let WIDTH_DAMPING = 0.7;

	let HEIGHT_STIFFNESS = 0.2;
	let HEIGHT_DAMPING = 0.7;

	let BR_STIFFNESS = 0.13;
	let BR_DAMPING = 0.9;

	// Initialize tweened stores for cursor properties
	let springX = spring(0, {
		stiffness: POSITION_STIFFNESS,
		damping: POSITION_DAMPING,
		precision: POSITION_PRECISION
	});
	let springY = spring(0, {
		stiffness: POSITION_STIFFNESS,
		damping: POSITION_DAMPING,
		precision: POSITION_PRECISION
	});
	let springWidth = spring(DEFAULT_CURSOR_SHAPE.width, {
		stiffness: WIDTH_STIFFNESS,
		damping: WIDTH_DAMPING
	});
	let springHeight = spring(DEFAULT_CURSOR_SHAPE.height, {
		stiffness: HEIGHT_STIFFNESS,
		damping: HEIGHT_DAMPING
	});
	let springBR = spring(DEFAULT_CURSOR_SHAPE.borderRadius, {
		stiffness: BR_STIFFNESS,
		damping: BR_DAMPING
	});

	const positionUnsubscribe = cursorPosition.subscribe(({ x, y }) => {
		springX.set(x);
		springY.set(y);
	});

	// Update the cursor parameters when the cursor is hovered
	const shapeUnsubscribe = cursorShape.subscribe((params) => {
		springWidth.set(params.width ?? DEFAULT_CURSOR_SHAPE.width);
		springHeight.set(params.height ?? DEFAULT_CURSOR_SHAPE.height);
		springBR.set(params.borderRadius ?? DEFAULT_CURSOR_SHAPE.borderRadius);
	});

	$: cursorStyle = `
    width: ${$springWidth}px;
    height: ${$springHeight}px;
    border-radius: ${$springBR}px;
    background: ${$cursorShape.backgroundColor ?? DEFAULT_CURSOR_SHAPE.backgroundColor};
	backdrop-filter: ${$cursorShape.backdropFilter ?? 'none'};
    mix-blend-mode: ${$cursorShape.mixBlendMode ?? DEFAULT_CURSOR_SHAPE.mixBlendMode};
    border: ${$cursorShape.borderWidth ?? DEFAULT_CURSOR_SHAPE.borderWidth}px solid ${$cursorShape.borderColor ?? DEFAULT_CURSOR_SHAPE.borderColor};
    transform: translate(
      ${$isCursorHovered ? $springX : $springX - $springWidth / 2}px,
      ${$isCursorHovered ? $springY : $springY - $springHeight / 2}px
    );
	`;

	onDestroy(() => {
		positionUnsubscribe();
		shapeUnsubscribe();
	});
</script>

<!-- Render the cursor as a div with dynamic styles -->
<div class="cursor" style={cursorStyle}></div>

<style>
	.cursor {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 11; /* Ensures the cursor is on top */
		pointer-events: none; /* Allows the cursor to pass through */
		transition: background-color 0.3s ease-in-out;
	}
</style>
