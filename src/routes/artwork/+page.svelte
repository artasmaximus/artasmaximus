<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Text from '$lib/components/Text.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { cursorState } from '$lib/cursor/CursorState.svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// Vite bundles all images at build time — no per-card runtime async imports
	const rawModules = import.meta.glob('/src/lib/assets/artwork/drawing*.jpeg', {
		eager: true,
		import: 'default'
	});

	const srcs: string[] = Object.entries(rawModules)
		.sort(([a], [b]) => {
			const n = (p: string) => parseInt(p.match(/drawing(\d+)/)?.[1] ?? '0');
			return n(a) - n(b);
		})
		.map(([, src]) => src as string);

	// ---- responsive columns (explicit, so each can drift independently) -----
	let colCount = $state(3);

	onMount(() => {
		const mqs = [window.matchMedia('(min-width: 1280px)'), window.matchMedia('(min-width: 768px)')];
		const update = () => {
			colCount = mqs[0].matches ? 3 : mqs[1].matches ? 2 : 1;
		};
		update();
		mqs.forEach((m) => m.addEventListener('change', update));
		return () => mqs.forEach((m) => m.removeEventListener('change', update));
	});

	let cols = $derived.by(() => {
		const c: { src: string; i: number }[][] = Array.from({ length: colCount }, () => []);
		srcs.forEach((src, i) => c[i % colCount].push({ src, i }));
		return c;
	});

	// Per-column scroll drift: neighbouring waterfalls fall at slightly
	// different speeds.
	let scrollY = $state(0);
	const reduceMotion = prefersReducedMotion();
	const DRIFTS: Record<number, number[]> = {
		1: [0],
		2: [0.05, -0.04],
		3: [0.06, -0.05, 0.02]
	};

	// ---- viewer ---------------------------------------------------------------
	// One piece at a time, centered. Arrows (or the keyboard) step through them.
	let current = $state<number | null>(null);
	let dialog = $state<HTMLDivElement>();
	let opener: HTMLElement | null = null;
	const fadeMs = reduceMotion ? 0 : 200;

	function open(i: number) {
		if (current !== null) return;
		opener = document.activeElement as HTMLElement | null;
		current = i;
	}

	function close() {
		// The image is removed from under the pointer, so no mouseleave will hand the cursor back.
		cursorState.reset();
		current = null;
	}

	function step(by: number) {
		if (current === null) return;
		current = (current + by + srcs.length) % srcs.length;
	}

	// Lock page scroll while open, focus the close button, and hand focus back after.
	$effect(() => {
		if (current === null) return;
		document.body.style.overflow = 'hidden';
		dialog?.focus();
		return () => {
			document.body.style.overflow = '';
			opener?.focus({ preventScroll: true });
		};
	});

	// Warm the neighbors so stepping never waits on a download.
	$effect(() => {
		if (current === null) return;
		for (const by of [-1, 1]) new Image().src = srcs[(current + by + srcs.length) % srcs.length];
	});

	function onKeydown(e: KeyboardEvent) {
		if (current === null) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window bind:scrollY onkeydown={onKeydown} />

<Seo title="Artwork" description="Drawings by Artas Alajbegu, made in Procreate on iPad Pro." />

<Section>
	<div class="flex w-full flex-col gap-16">
		<header class="flex flex-col gap-4">
			<Heading>Artwork</Heading>
			<Text tone="muted" twclass="max-w-prose text-lead">
				A collection of drawings, each made in Procreate on iPad Pro.
			</Text>
		</header>

		<div class="grid w-full gap-7" style="grid-template-columns: repeat({colCount}, 1fr);">
			{#each cols as col, ci}
				<div
					class="flex flex-col gap-7"
					style="transform: translateY({colCount > 1 && !reduceMotion
						? -scrollY * DRIFTS[colCount][ci]
						: 0}px);"
				>
					{#each col as item (item.src)}
						<Artwork src={item.src} alt="Drawing {item.i + 1}" onOpen={() => open(item.i)} />
					{/each}
				</div>
			{/each}
		</div>
	</div>
</Section>

{#if current !== null}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={dialog}
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 outline-none backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-label="Artwork viewer"
		transition:fade={{ duration: fadeMs }}
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
	>
		<!-- The row ignores clicks itself, so the gaps count as the backdrop. -->
		<div class="pointer-events-none flex items-center gap-1 md:gap-8">
			<div class="pointer-events-auto">
				<Button
					blend
					fill="transparent"
					fillText="#FFFFFF"
					border={false}
					br={12}
					twclass="flex h-14 w-9 items-center justify-center p-0 md:h-16 md:w-11"
					onClick={() => step(-1)}
				>
					<span class="sr-only">Previous drawing</span>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path
							d="M11 3 5 9l6 6"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Button>
			</div>

			<!-- The glass wrapper stays put while the image keys underneath it, so stepping never strands the cursor. -->
			<GlassEffect twclass="pointer-events-auto flex">
				{#key current}
					<img
						src={srcs[current]}
						alt="Drawing {current + 1}"
						class="max-h-[80vh] max-w-[calc(100vw-7.5rem)] object-contain md:max-w-[min(70vw,1100px)]"
						in:fade={{ duration: fadeMs }}
						onclick={close}
					/>
				{/key}
			</GlassEffect>

			<div class="pointer-events-auto">
				<Button
					blend
					fill="transparent"
					fillText="#FFFFFF"
					border={false}
					br={12}
					twclass="flex h-14 w-9 items-center justify-center p-0 md:h-16 md:w-11"
					onClick={() => step(1)}
				>
					<span class="sr-only">Next drawing</span>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path
							d="m7 3 6 6-6 6"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Button>
			</div>
		</div>

		<div class="absolute right-5 top-5 md:right-8 md:top-8">
			<Button
				blend
				fill="transparent"
				fillText="#FFFFFF"
				border={false}
				br={50}
				twclass="flex h-11 w-11 items-center justify-center p-0"
				onClick={close}
			>
				<span class="sr-only">Close</span>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M4 4l10 10M14 4 4 14"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</Button>
		</div>

		<p
			class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-small text-white/70 md:bottom-8"
			aria-live="polite"
		>
			{current + 1} / {srcs.length}
		</p>
	</div>
{/if}
