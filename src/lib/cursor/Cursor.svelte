<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { cursorState } from './CursorState.svelte';

	const SCALE_FACTOR = 1.2;
	let isExpanded = false;
	let originalShape: { width: number; height: number; borderRadius: number } | null = null;
	let rafId: number;

	function updateCursorPosition(clientX: number, clientY: number) {
		if (!cursorState.isLockedPos) {
			cursorState.setPosition({ x: clientX, y: clientY });
		} else {
			const dx = clientX - cursorState.HoverTargetPos.x;
			const dy = clientY - cursorState.HoverTargetPos.y;
			cursorState.setPosition({
				x: cursorState.HoverTargetPos.x + dx * 0.1618,
				y: cursorState.HoverTargetPos.y + dy * 0.1618
			});
		}
	}

	function handleMouseMove(event: MouseEvent) {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			updateCursorPosition(event.clientX, event.clientY);
		});
	}

	function handleMouseDown(
		event: MouseEvent,
		newShape?: { width: number; height: number; borderRadius: number }
	) {
		if (isExpanded) return;

		if (newShape) {
			cursorState.shape.target = newShape;
			originalShape = newShape;
		} else {
			originalShape = { ...cursorState.shape.target };
			cursorState.setShape({
				width: Math.min(
					cursorState.shape.target.width * SCALE_FACTOR,
					cursorState.shape.target.width + 10
				),
				height: Math.min(
					cursorState.shape.target.height * SCALE_FACTOR,
					cursorState.shape.target.height + 10
				),
				borderRadius: cursorState.shape.target.borderRadius * SCALE_FACTOR
			});
		}
		isExpanded = true;
	}

	function handleMouseUp(event: MouseEvent) {
		if (!isExpanded || !originalShape) return;

		if (!cursorState.isHovering && !cursorState.isLockedPos) {
			cursorState.reset();
		} else {
			cursorState.setShape(originalShape);
		}

		isExpanded = false;
		originalShape = null;
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('pointermove', handleMouseMove, { passive: true });
			window.addEventListener('pointerdown', handleMouseDown);
			window.addEventListener('pointerup', handleMouseUp);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('pointermove', handleMouseMove);
			window.removeEventListener('pointerdown', handleMouseDown);
			window.removeEventListener('pointerup', handleMouseUp);
			cancelAnimationFrame(rafId);
		}
	});
</script>

<span
	id="custom-cursor"
	style="transform: translate3d({cursorState.position.current.x}px, {cursorState.position.current
		.y}px, 0) translate3d(-50%, -50%, 0);
			width: {cursorState.shape.current.width}px; 
			height: {cursorState.shape.current.height}px;
			border-radius: {cursorState.shape.current.borderRadius}px;
			background: {cursorState.style['background']};
			mix-blend-mode: {cursorState.style['mix-blend-mode']};
			border-color: {cursorState.style['border-color']};
			backdrop-filter: {cursorState.style['backdrop-filter']};
			z-index: {cursorState.style['z-index']}"
></span>

<style>
	#custom-cursor {
		position: fixed;
		pointer-events: none;
		z-index: 1000;
		will-change: transform;
		transition:
			border-radius 0.1s cubic-bezier(0.19, 1, 0.22, 1),
			background 0.05s ease-out;
	}
</style>
