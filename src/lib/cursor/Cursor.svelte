<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { cursorState, GOLDEN_RATIO } from './CursorState.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	const SCALE_FACTOR = 1.2;
	let isExpanded = false;
	let originalShape: { width: number; height: number; borderRadius: number } | null = null;
	let rafId: number;
	let stretchRafId: number;

	// Velocity squash & stretch: the dot elongates along its direction of travel
	// and settles when it stops. Suppressed while morphed (ring/bubble/pill) so
	// non-circular shapes never visibly rotate. Off for reduced motion.
	let stretch = $state({ angle: 0, amount: 0 });
	let prevPos = { x: 0, y: 0 };
	const reduceMotion = prefersReducedMotion();

	function stretchLoop() {
		const { x, y } = cursorState.position.current;
		const vx = x - prevPos.x;
		const vy = y - prevPos.y;
		prevPos = { x, y };

		const speed = Math.hypot(vx, vy);
		const morphed = cursorState.isHovering || cursorState.isLockedPos || reduceMotion;
		const target = morphed ? 0 : Math.min(speed * 0.009, 0.22);
		const ease = morphed ? 0.5 : 0.18;

		stretch.amount += (target - stretch.amount) * ease;
		if (speed > 2 && !morphed) stretch.angle = Math.atan2(vy, vx);

		stretchRafId = requestAnimationFrame(stretchLoop);
	}

	function updateCursorPosition(clientX: number, clientY: number) {
		if (!cursorState.isLockedPos) {
			cursorState.setPosition({ x: clientX, y: clientY });
		} else {
			const dx = clientX - cursorState.HoverTargetPos.x;
			const dy = clientY - cursorState.HoverTargetPos.y;
			cursorState.setPosition({
				x: cursorState.HoverTargetPos.x + dx * GOLDEN_RATIO,
				y: cursorState.HoverTargetPos.y + dy * GOLDEN_RATIO
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
			stretchRafId = requestAnimationFrame(stretchLoop);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('pointermove', handleMouseMove);
			window.removeEventListener('pointerdown', handleMouseDown);
			window.removeEventListener('pointerup', handleMouseUp);
			cancelAnimationFrame(rafId);
			cancelAnimationFrame(stretchRafId);
		}
	});
</script>

<span
	id="custom-cursor"
	style="transform: translate3d({cursorState.position.current.x}px, {cursorState.position.current
		.y}px, 0) translate3d(-50%, -50%, 0){stretch.amount > 0.004
		? ` rotate(${stretch.angle}rad) scale(${1 + stretch.amount}, ${1 / (1 + stretch.amount)})`
		: ''};
			width: {cursorState.shape.current.width}px;
			height: {cursorState.shape.current.height}px;
			border-radius: {cursorState.shape.current.borderRadius}px;
			background: {cursorState.style['background']};
			mix-blend-mode: {cursorState.style['mix-blend-mode']};
			border-color: {cursorState.style['border-color']};
			border-width: {cursorState.style['border-width'] ?? '0px'};
			backdrop-filter: {cursorState.style['backdrop-filter']};
			z-index: {cursorState.style['z-index']}"
></span>

<style>
	#custom-cursor {
		position: fixed;
		pointer-events: none;
		z-index: 1000;
		will-change: transform;
		border-style: solid;
		transition:
			background 0.05s ease-out,
			border-color 0.1s ease-out;
	}
</style>
