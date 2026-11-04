<script lang="ts">
	import { onMount } from 'svelte';
	import { navTheme } from '$lib/components/Navbar/NavbarState.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// Dark, sticky-pinned section whose image sequence is driven by scroll
	// position. Frames load coarse to fine, so scrubbing works from the first
	// few and sharpens as the rest arrive.
	let {
		frame,
		count,
		alt,
		darkAbove = false,
		overlays = [],
		width,
		height
	}: {
		frame: (index: number) => string;
		count: number;
		alt: string;
		/* The page above this section is dark too, so the navbar stays light there. */
		darkAbove?: boolean;
		/* Short lines that fade in over the stage between two scroll progress values (0 to 1). */
		overlays?: { text: string; from: number; to: number }[];
		width: number;
		height: number;
	} = $props();

	const CONCURRENT_LOADS = 6;

	let container: HTMLDivElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let reduceMotion = $state(false);
	let progress = $state(0);
	const FADE = 0.05;

	function overlayOpacity(from: number, to: number) {
		return Math.min(Math.max(Math.min((progress - from) / FADE, (to - progress) / FADE), 0), 1);
	}

	const frames: (HTMLImageElement | undefined)[] = [];
	let target = 0;
	let drawn: HTMLImageElement | undefined;
	let rafId = 0;

	function nearestLoaded(index: number) {
		for (let d = 0; d < count; d++) {
			const img = frames[index - d] ?? frames[index + d];
			if (img) return img;
		}
	}

	function requestDraw() {
		if (rafId) return;
		rafId = requestAnimationFrame(() => {
			rafId = 0;
			const img = nearestLoaded(target);
			if (!img || img === drawn) return;
			canvas?.getContext('2d')?.drawImage(img, 0, 0, width, height);
			drawn = img;
		});
	}

	function onScroll() {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const vh = window.innerHeight;

		// Mirror the browser's sticky-positioning math to find where the
		// pinned stage currently sits, so the navbar can match its color.
		let stickyTop: number;
		if (rect.top >= 0) {
			stickyTop = rect.top;
		} else if (rect.bottom >= vh) {
			stickyTop = 0;
		} else {
			stickyTop = rect.bottom - vh;
		}
		const navLine = navTheme.height / 2;
		navTheme.dark = (darkAbove || stickyTop <= navLine) && stickyTop + vh > navLine;

		if (reduceMotion) return;
		const range = rect.height - vh;
		progress = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
		target = Math.round(progress * (count - 1));
		requestDraw();
	}

	// Every 32nd frame, then every 16th, and so on down to `finest`.
	function loadOrder(finest: number) {
		const order: number[] = [];
		for (let stride = 32; stride >= finest; stride /= 2) {
			for (let i = 0; i < count; i += stride) {
				if (!order.includes(i)) order.push(i);
			}
		}
		return order;
	}

	function load(order: number[], isStopped: () => boolean) {
		let next = 0;
		async function worker() {
			while (next < order.length && !isStopped()) {
				const index = order[next++];
				const img = new Image();
				img.src = frame(index);
				try {
					await img.decode();
					frames[index] = img;
					requestDraw();
				} catch {
					// A missed frame just falls back to its nearest neighbor.
				}
			}
		}
		for (let i = 0; i < CONCURRENT_LOADS; i++) worker();
	}

	onMount(() => {
		reduceMotion = prefersReducedMotion();
		if (reduceMotion) target = count - 1;

		// The full sequence is heavy, so small screens and data savers get half of it.
		const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
			.connection;
		const finest = window.innerWidth < 768 || connection?.saveData ? 2 : 1;
		const order = reduceMotion ? [count - 1] : loadOrder(finest);

		let stopped = false;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				load(order, () => stopped);
			},
			{ rootMargin: '100% 0px' }
		);
		observer.observe(container!);

		onScroll();
		return () => {
			stopped = true;
			observer.disconnect();
			cancelAnimationFrame(rafId);
			navTheme.dark = false;
		};
	});
</script>

<svelte:window onscroll={onScroll} onresize={onScroll} />

<div
	bind:this={container}
	class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen {reduceMotion
		? 'h-svh'
		: 'h-[400vh]'}"
>
	<div class="sticky top-0 h-svh w-screen overflow-hidden bg-black" role="img" aria-label={alt}>
		<canvas bind:this={canvas} {width} {height} class="h-full w-full object-cover"></canvas>
		{#if !reduceMotion}
			{#each overlays as overlay}
				{@const opacity = overlayOpacity(overlay.from, overlay.to)}
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-x-0 bottom-0 pb-10 md:pb-16"
					style:opacity
					style:transform="translateY({(1 - opacity) * 12}px)"
				>
					<div class="page">
						<p class="max-w-prose text-lead text-white md:text-heading">{overlay.text}</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
