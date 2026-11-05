<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// A still that plays its image sequence while hovered and runs it back to the
	// first frame when the pointer leaves. Frames download once the tile nears the
	// viewport. On touch screens, which have no hover, a tap plays or rewinds it.
	let {
		frame,
		count,
		alt,
		width,
		height,
		fps = 16
	}: {
		frame: (index: number) => string;
		count: number;
		alt: string;
		width: number;
		height: number;
		fps?: number;
	} = $props();

	const CONCURRENT_LOADS = 4;

	let root: HTMLDivElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let started = $state(false);
	let reduceMotion = $state(false);

	const frames: (HTMLImageElement | undefined)[] = [];
	let position = 0; // fractional frame, 0 to count - 1
	let direction = 0; // 1 forward, -1 back, 0 at rest
	let drawn: HTMLImageElement | undefined;
	let rafId = 0;
	let last = 0;
	let loading = false;
	let stopped = false;

	function nearestLoaded(index: number) {
		for (let d = 0; d < count; d++) {
			const img = frames[index - d] ?? frames[index + d];
			if (img) return img;
		}
	}

	function draw() {
		const img = nearestLoaded(Math.round(position));
		if (!img || img === drawn) return;
		canvas?.getContext('2d')?.drawImage(img, 0, 0, width, height);
		drawn = img;
		started = true;
	}

	function tick(now: number) {
		rafId = 0;
		// Elapsed time, not frame count, so speed doesn't follow the screen's refresh rate.
		const dt = Math.min((now - last) / 1000, 0.1);
		last = now;
		position = Math.min(Math.max(position + direction * dt * fps, 0), count - 1);
		draw();
		if (position <= 0 && direction < 0) direction = 0;
		if (position >= count - 1 && direction > 0) direction = 0;
		if (direction !== 0) rafId = requestAnimationFrame(tick);
	}

	function play(dir: 1 | -1) {
		if (reduceMotion) return;
		load();
		direction = dir;
		if (!rafId) {
			last = performance.now();
			rafId = requestAnimationFrame(tick);
		}
	}

	function load() {
		if (loading) return;
		loading = true;
		// Coarse to fine, so playback can start before everything has arrived.
		const order: number[] = [];
		for (let stride = 8; stride >= 1; stride /= 2) {
			for (let i = 0; i < count; i += stride) if (!order.includes(i)) order.push(i);
		}
		let next = 0;
		async function worker() {
			while (next < order.length && !stopped) {
				const index = order[next++];
				const img = new Image();
				img.src = frame(index);
				try {
					await img.decode();
					frames[index] = img;
				} catch {
					// A missed frame falls back to its nearest neighbor.
				}
			}
		}
		for (let i = 0; i < CONCURRENT_LOADS; i++) worker();
	}

	function onEnter(e: PointerEvent) {
		if (e.pointerType !== 'touch') play(1);
	}

	function onLeave(e: PointerEvent) {
		if (e.pointerType !== 'touch') play(-1);
	}

	function onClick(e: MouseEvent) {
		// Mouse hover is already handled; this covers touch and keyboard.
		if ((e as PointerEvent).pointerType === 'mouse') return;
		play(direction > 0 || position >= count - 1 ? -1 : 1);
	}

	onMount(() => {
		reduceMotion = prefersReducedMotion();
		if (reduceMotion) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				load();
			},
			{ rootMargin: '50% 0px' }
		);
		observer.observe(root!);
		return () => {
			stopped = true;
			observer.disconnect();
			cancelAnimationFrame(rafId);
		};
	});
</script>

<div
	bind:this={root}
	role="button"
	tabindex="0"
	aria-label={alt}
	class="relative w-full cursor-pointer overflow-hidden bg-black"
	style:aspect-ratio="{width} / {height}"
	onpointerenter={onEnter}
	onpointerleave={onLeave}
	onclick={onClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			play(direction > 0 || position >= count - 1 ? -1 : 1);
		}
	}}
>
	<img
		src={frame(0)}
		alt=""
		{width}
		{height}
		draggable="false"
		class="absolute inset-0 h-full w-full object-cover"
	/>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		aria-hidden="true"
		class="absolute inset-0 h-full w-full object-cover"
		style:opacity={started ? 1 : 0}
	></canvas>
</div>
