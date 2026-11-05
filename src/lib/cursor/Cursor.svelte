<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { cursorState } from './CursorState.svelte';
	import GlassFilter from './GlassFilter.svelte';

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
				x: cursorState.HoverTargetPos.x + dx * cursorState.lockPull,
				y: cursorState.HoverTargetPos.y + dy * cursorState.lockPull
			});
		}
	}

	function handleMouseMove(event: MouseEvent) {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			updateCursorPosition(event.clientX, event.clientY);
		});
	}

	function handleMouseDown(event: MouseEvent) {
		if (isExpanded) return;

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

<GlassFilter />

<span
	id="custom-cursor"
	style="translate: {cursorState.position.current.x -
			cursorState.shape.current.width / 2}px {cursorState.position.current.y -
			cursorState.shape.current.height / 2}px;
				width: {cursorState.shape.current.width}px;
			height: {cursorState.shape.current.height}px;
			border-radius: {cursorState.shape.current.borderRadius}px;
			background: {cursorState.style['background']};
			mix-blend-mode: {cursorState.style['mix-blend-mode']};
			border-color: {cursorState.style['border-color']};
			border-width: {cursorState.style['border-width'] ?? '0px'};
			backdrop-filter: {cursorState.style['backdrop-filter']};
			animation: {cursorState.style['animation'] ?? 'none'};
			box-shadow: {cursorState.style['box-shadow'] ?? 'none'};
			mask-image: {cursorState.style['mask-image'] ?? 'none'};
			z-index: {cursorState.style['z-index']}"
></span>

<style>
	#custom-cursor {
		position: fixed;
		pointer-events: none;
		z-index: 1000;
		will-change: translate, scale;
		border-style: solid;
		transition:
			background 0.05s ease-out,
			border-color 0.1s ease-out;
	}

	/* Position lives in `translate`, so `scale` pulses around the cursor's own center. */
	@keyframes -global-cursor-pulse {
		0%,
		100% {
			scale: 1;
		}
		50% {
			scale: 1.16;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		#custom-cursor {
			animation: none !important;
		}
	}
</style>
