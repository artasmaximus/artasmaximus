<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { rippleTint } from '$lib/components/Background/Background.svelte.ts';
	import {
		cursorState,
		GLASS_CURSOR_SHAPE,
		GLASS_CURSOR_STYLE
	} from '$lib/cursor/CursorState.svelte';
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

	// ---- expand-in-place ------------------------------------------------------
	interface Expanded {
		src: string;
		alt: string;
		accent: string;
		i: number;
	}

	let tileEls: HTMLElement[] = $state([]);
	let expanded = $state<Expanded | null>(null);
	let closing = $state(false);
	let peek = $state(false);
	// Drives the overlay's backdrop-filter ramp. Animating blur radius per layer
	// (not opacity on a parent) keeps the blur composited against the real page,
	// so it builds and releases in step with the tile motion instead of popping.
	let overlayOn = $state(false);
	let closeButton = $state<HTMLButtonElement>();
	let scatter = $state<Record<number, { dx: number; dy: number; rot: number; delay: number }>>({});

	const stage = new Spring(
		{ x: 0, y: 0, w: 0, h: 0 },
		{ stiffness: 0.09, damping: 0.56, precision: 0.1 }
	);

	function open(detail: { src: string; alt: string; accent: string }, i: number) {
		if (expanded || closing) return;
		const el = tileEls[i];
		if (!el) return;
		const rect = el.getBoundingClientRect();
		if (rect.width === 0) return;

		const aspect = rect.width / rect.height;
		const tw = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.85 * aspect);
		const th = tw / aspect;

		stage.set({ x: rect.left, y: rect.top, w: rect.width, h: rect.height }, { instant: true });
		stage.set(
			{
				x: (window.innerWidth - tw) / 2,
				y: (window.innerHeight - th) / 2,
				w: tw,
				h: th
			},
			{ instant: reduceMotion }
		);

		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const push = Math.hypot(window.innerWidth, window.innerHeight) * 0.55;
		const map: typeof scatter = {};
		tileEls.forEach((tile, ti) => {
			if (!tile || ti === i) return;
			const r = tile.getBoundingClientRect();
			const dx0 = r.left + r.width / 2 - cx;
			const dy0 = r.top + r.height / 2 - cy;
			const len = Math.hypot(dx0, dy0) || 1;
			map[ti] = {
				dx: (dx0 / len) * push,
				dy: (dy0 / len) * push,
				rot: ((ti * 7919) % 9) - 4,
				delay: Math.min(len * 0.12, 180)
			};
		});

		scatter = map;
		expanded = { ...detail, i };
		peek = false;
		rippleTint.color = detail.accent;
		document.body.style.overflow = 'hidden';
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				overlayOn = true;
				closeButton?.focus();
			})
		);
	}

	function close() {
		if (!expanded || closing) return;
		closing = true;
		peek = false;
		overlayOn = false;
		const el = tileEls[expanded.i];
		if (el) {
			const rect = el.getBoundingClientRect();
			stage.set(
				{ x: rect.left, y: rect.top, w: rect.width, h: rect.height },
				{ instant: reduceMotion }
			);
		}
		scatter = {};
		setTimeout(() => {
			expanded = null;
			closing = false;
			rippleTint.color = null;
			document.body.style.overflow = '';
			el?.querySelector('button')?.focus({ preventScroll: true });
		}, 700);
	}

	function tileStyle(i: number) {
		const s = scatter[i];
		const base = 'transition: transform 0.65s cubic-bezier(0.3, 1.35, 0.45, 1);';
		if (expanded && i === expanded.i) return base + ' opacity: 0;';
		if (!s) return base;
		const f = peek ? 0.9 : 1;
		return `transform: translate(${s.dx * f}px, ${s.dy * f}px) rotate(${s.rot * (peek ? 0.8 : 1)}deg); transition: transform 0.65s cubic-bezier(0.3, 1.35, 0.45, 1) ${s.delay}ms;`;
	}

	// Cursor over the expanded piece: glass circle, and the scene commits.
	// Cursor off it: everything previews its own return.
	function onStageEnter() {
		peek = false;
		cursorState.isHovering = true;
		cursorState.setShape(GLASS_CURSOR_SHAPE);
		cursorState.setStyle(GLASS_CURSOR_STYLE);
	}
	function onStageLeave() {
		cursorState.isHovering = false;
		cursorState.reset();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window bind:scrollY onkeydown={onKeydown} />

<Seo title="Artwork" description="Drawings by Artas Alajbegu, made in Procreate on iPad Pro." />

<Section>
	<div class="flex w-full flex-col gap-16">
		<header class="flex flex-col gap-4">
			<Heading>Artwork</Heading>
			<p class="max-w-prose text-lead text-ink-muted">
				A collection of drawings, each made in Procreate on iPad Pro.
			</p>
		</header>

		<div class="grid w-full gap-8" style="grid-template-columns: repeat({colCount}, 1fr);">
			{#each cols as col, ci}
				<div
					class="flex flex-col gap-8"
					style="transform: translateY({colCount > 1 && !reduceMotion
						? -scrollY * DRIFTS[colCount][ci]
						: 0}px);"
				>
					{#each col as item (item.src)}
						<div bind:this={tileEls[item.i]} style={tileStyle(item.i)}>
							<Artwork src={item.src} alt="Drawing {item.i + 1}" onOpen={(d) => open(d, item.i)} />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</Section>

{#if expanded}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-30"
		onclick={close}
		onmousemove={() => {
			if (!closing) peek = true;
		}}
	>
		{#each [{ max: 2, from: 30, to: 55 }, { max: 7, from: 48, to: 75 }, { max: 16, from: 65, to: 92 }] as layer}
			<div
				class="pointer-events-none absolute inset-0"
				style="backdrop-filter: blur({overlayOn
					? layer.max
					: 0}px); -webkit-backdrop-filter: blur({overlayOn
					? layer.max
					: 0}px); transition: backdrop-filter 0.65s cubic-bezier(0.4, 0, 0.2, 1), -webkit-backdrop-filter 0.65s cubic-bezier(0.4, 0, 0.2, 1); mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, transparent {layer.from}%, black {layer.to}%); -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, transparent {layer.from}%, black {layer.to}%);"
			></div>
		{/each}
		<div
			class="pointer-events-none absolute inset-0"
			style="background: rgba(250, 250, 250, 0.55); mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, black 80%); -webkit-mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, black 80%); opacity: {overlayOn
				? peek
					? 1
					: 0.75
				: 0}; transition: opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1);"
		></div>
	</div>

	<button bind:this={closeButton} class="sr-only" onclick={close}>Close artwork</button>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="pointer-events-none fixed z-40"
		style="left: {stage.current.x}px; top: {stage.current.y}px; width: {stage.current
			.w}px; height: {stage.current.h}px;"
	>
		<div
			class="pointer-events-auto h-full w-full transition-transform duration-300"
			style="transform: scale({peek && !closing ? 0.965 : 1});"
			onmouseenter={onStageEnter}
			onmouseleave={onStageLeave}
		>
			<img
				src={expanded.src}
				alt={expanded.alt}
				class="h-full w-full rounded-lg object-cover shadow-2xl"
			/>
		</div>
	</div>
{/if}
