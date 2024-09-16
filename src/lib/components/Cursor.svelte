<script lang="ts">
	import { mouseMoveEvent } from '$lib/stores/EventBus';
	let DEFAULT_CURSOR_SIZE = 15;
	const { x, y } = $mouseMoveEvent;
</script>

<div
	class="cursor"
	style="top: {y - DEFAULT_CURSOR_SIZE / 2}px; left: {x -
		DEFAULT_CURSOR_SIZE / 2}px; width: {DEFAULT_CURSOR_SIZE}px; height: {DEFAULT_CURSOR_SIZE}px;"
></div>

<style>
	.cursor {
		position: absolute;
		background: #fff;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1000;
		mix-blend-mode: difference;
	}
</style>
