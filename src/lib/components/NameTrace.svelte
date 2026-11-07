<script lang="ts">
	import { onMount } from 'svelte';
	import { nameOutline as o } from '$lib/assets/nameOutline';

	// The home heading, drawn like a sketch. Each letter is built from its own strokes. Every
	// straight horizontal or vertical run in a letter is a line that shoots in along its own axis
	// from the edge of the page (verticals from the top or bottom, horizontals from the left or
	// right), growing as it comes, with its tail letting go of the edge soon after its head
	// leaves, until only the stroke itself is left. Curves and anything else are traced. When a letter's outline
	// is complete it fills with ink: a liquid level that rises through the letter, its surface
	// swaying as it goes. Letters go in a scattered order.
	//
	// The outlines are the real letterforms (see nameOutline.ts), laid out to land exactly where
	// the typeset text would, so this takes the heading's place and scales with its font size.
	// It's CSS animation; the sliding strokes are added once the page has measured where its
	// edges are, and everything is switched off for people who prefer reduced motion.
	const em = (units: number) => units / o.upm;

	// A fixed pseudo-random scatter, so the server and the browser agree on it.
	function seeded(seed: number) {
		return () => {
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}
	const rand = seeded(20240611);

	// Timing, in ms.
	const STAGGER = 45; // between letters, in the scattered order
	const PIECE_GAP = 40; // between one stroke of a letter and the next
	const HEAD = 420; // a straight stroke: the leading end gets from the edge to the stroke's far end
	const TAIL = 420; // ...and the trailing end makes the same trip a beat later, to the stroke's near end
	const TAIL_DELAY = 90;
	const TRACE = 320; // a traced (curved) stroke
	const INK = 640; // the ink rising through a letter
	const FADE = 260; // the outline letting go, once the ink is mostly in

	// The ink: a wave-topped block, clipped to each letter. It starts just past one edge of the
	// letter and sweeps across to the other. Which edge varies by letter: the angle is the
	// direction the ink travels (0 rises from the bottom, 180 pours down from the top, 90 sweeps
	// in from the left, -90 from the right, and the rest come in from a corner). Font units.
	const AMP = 70; // how high the surface swells
	const WL = 700; // wavelength
	const ANGLES = [0, 180, 90, -90, 35, -35, 145, -145];
	const phase = seeded(777);
	const direction = seeded(4242);

	// A glyph's bounding box, from its path data (the numbers come in x y pairs).
	function bounds(d: string) {
		const n = d.match(/-?[\d.]+/g)!.map(Number);
		const xs = n.filter((_, i) => i % 2 === 0);
		const ys = n.filter((_, i) => i % 2 === 1);
		return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
	}
	const boxes = o.glyphs.map((g) => bounds(g.fill));

	// One wave block serves every letter: surface along y = 0, body below it, wide enough to
	// cover the biggest letter at any angle with room for the sideways sway.
	const reach =
		Math.max(...boxes.map((b) => Math.hypot(b.x1 - b.x0, b.y1 - b.y0))) / 2 + 3 * WL;
	const wave = (() => {
		let d = `M${-reach} 0`;
		let up = true;
		for (let x = -reach; x < reach; x += WL / 2) {
			d += `Q${x + WL / 4} ${(up ? -2 : 2) * AMP} ${x + WL / 2} 0`;
			up = !up;
		}
		return `${d}V3000H${-reach}Z`;
	})();

	const ORDER = [5, 10, 1, 7, 12, 3, 8, 0, 11, 4, 9, 2, 6]; // when each letter goes, by letter

	type Side = 'top' | 'bottom' | 'left' | 'right';
	const letters = o.glyphs.map((glyph, gi) => {
		const t = Math.round(ORDER[gi % ORDER.length] * STAGGER + rand() * 60);
		let end = 0;
		const pieces = glyph.pieces.map((piece, pi) => {
			const delay = pi * PIECE_GAP;
			const straight = piece.k !== 'c';
			end = Math.max(end, delay + (straight ? HEAD : TRACE));
			const from: Side | null = !straight
				? null
				: piece.k === 'v'
					? rand() < 0.6
						? 'top'
						: 'bottom'
					: rand() < 0.5
						? 'left'
						: 'right';
			return { ...piece, delay, from };
		});
		// The ink starts while the strokes are still arriving.
		const b = boxes[gi];
		const w = b.x1 - b.x0;
		const h = b.y1 - b.y0;
		const angle = ANGLES[Math.floor(direction() * ANGLES.length)];
		const rad = (angle * Math.PI) / 180;
		// Half the letter's extent along the direction of travel, plus room for the swell.
		const half = (w / 2) * Math.abs(Math.sin(rad)) + (h / 2) * Math.abs(Math.cos(rad)) + AMP + 40;
		return {
			fill: glyph.fill,
			pieces,
			t,
			fillAt: Math.round(t + end * 0.4),
			phase: Math.round(phase() * WL),
			cx: Math.round((b.x0 + b.x1) / 2),
			cy: Math.round((b.y0 + b.y1) / 2),
			angle,
			half: Math.round(half)
		};
	});

	let svg = $state<SVGSVGElement>();
	// For each straight stroke: the line from the page edge to the stroke, and how much of it is
	// that lead-in (the part that gets drawn back out of the way). Filled in once measured.
	let slides = $state<
		Record<string, { d: string; lead: number; x1: number; y1: number; x2: number; y2: number }>
	>({});
	let ready = $state(false);

	onMount(() => {
		if (!svg) return;
		// Reduced motion shows the finished name and needs no measuring.
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			ready = true;
			return;
		}
		const box = svg.getBoundingClientRect();
		const k = o.width / box.width; // font units per screen pixel
		const top = -box.top * k - o.baseline;
		const bottom = (innerHeight - box.top) * k - o.baseline;
		const left = -box.left * k;
		const right = (document.documentElement.clientWidth - box.left) * k;

		const next: typeof slides = {};
		letters.forEach((letter, gi) =>
			letter.pieces.forEach((p, pi) => {
				if (!p.from) return;
				const [x0, y0, x1, y1] = [p.x0!, p.y0!, p.x1!, p.y1!];
				let a: [number, number], b: [number, number], edge: [number, number];
				if (p.from === 'top' || p.from === 'bottom') {
					// Order the ends so the stroke is entered at the one nearer the edge it came from.
					const nearFirst = p.from === 'top' ? y0 < y1 : y0 > y1;
					[a, b] = nearFirst ? [[x0, y0], [x1, y1]] : [[x1, y1], [x0, y0]];
					edge = [a[0], p.from === 'top' ? top : bottom];
				} else {
					const nearFirst = p.from === 'left' ? x0 < x1 : x0 > x1;
					[a, b] = nearFirst ? [[x0, y0], [x1, y1]] : [[x1, y1], [x0, y0]];
					edge = [p.from === 'left' ? left : right, a[1]];
				}
				const lead = Math.hypot(a[0] - edge[0], a[1] - edge[1]);
				const stroke = Math.hypot(b[0] - a[0], b[1] - a[1]);
				next[`${gi}-${pi}`] = {
					d: `M${edge[0]} ${edge[1]}L${a[0]} ${a[1]}L${b[0]} ${b[1]}`,
					lead: lead / (lead + stroke),
					x1: edge[0],
					y1: edge[1],
					x2: a[0],
					y2: a[1]
				};
			})
		);
		slides = next;
		ready = true;
	});
</script>

<svg
	bind:this={svg}
	class="name-trace"
	class:pending={!ready}
	viewBox="0 {-o.baseline} {o.width} {o.height}"
	style="width: {em(o.width)}em; height: {em(o.height)}em; --head-ms: {HEAD}ms; --tail-ms: {TAIL}ms; --tail-delay: {TAIL_DELAY}ms; --trace-ms: {TRACE}ms; --ink-ms: {INK}ms; --fade-ms: {FADE}ms; --wl: {WL}px"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		{#each letters as letter, gi}
			<clipPath id="name-ink-{gi}"><path d={letter.fill} /></clipPath>
		{/each}
	</defs>
	{#each letters as letter, gi}
		<!-- The finished letter, shown as is when motion is reduced. -->
		<path class="fill" d={letter.fill} />
		<g
			class="ink"
			clip-path="url(#name-ink-{gi})"
			style="--at: {letter.fillAt}; --phase: {letter.phase}px; --rise: {letter.half * 2}px"
		>
			<g transform="translate({letter.cx} {letter.cy}) rotate({letter.angle})">
				<g class="rise">
					<g transform="translate(0 {letter.half})">
						<g class="sway"><path d={wave} /></g>
					</g>
				</g>
			</g>
		</g>
	{/each}
	{#each letters as letter, gi}
		{#each letter.pieces as piece, pi}
			{#if piece.k === 'c'}
				<path
					class="stroke trace"
					d={piece.d}
					pathLength="1"
					style="--at: {letter.t + piece.delay}; --out: {letter.fillAt + Math.round(INK * 0.55)}"
				/>
			{:else if ready && slides[`${gi}-${pi}`]}
				<!-- Clear at the page edge, solid by the time it reaches the stroke. -->
				<linearGradient
					id="name-lead-{gi}-{pi}"
					gradientUnits="userSpaceOnUse"
					x1={slides[`${gi}-${pi}`].x1}
					y1={slides[`${gi}-${pi}`].y1}
					x2={slides[`${gi}-${pi}`].x2}
					y2={slides[`${gi}-${pi}`].y2}
				>
					<stop offset="0" stop-color="currentColor" stop-opacity="0" />
					<stop offset="0.4" stop-color="currentColor" stop-opacity="0.25" />
					<stop offset="1" stop-color="currentColor" stop-opacity="1" />
				</linearGradient>
				<path
					class="stroke slide"
					d={slides[`${gi}-${pi}`].d}
					pathLength="1"
					style="--at: {letter.t + piece.delay}; --out: {letter.fillAt + Math.round(INK * 0.55)}; --lead: {slides[`${gi}-${pi}`].lead}; stroke: url(#name-lead-{gi}-{pi})"
				/>
			{/if}
		{/each}
	{/each}
</svg>

<style>
	@property --head {
		syntax: '<number>';
		inherits: false;
		initial-value: 0;
	}

	@property --tail {
		syntax: '<number>';
		inherits: false;
		initial-value: 0;
	}

	.name-trace {
		display: block;
		max-width: 100%;
		overflow: visible;
	}

	/* Until the page has measured its edges, every animation waits at its first frame, so they all
	   start together (and a browser without script is released by a rule in app.html). */
	.pending :global(*) {
		animation-play-state: paused;
	}

	/* The ink: starts below the letters and lifts through them once the strokes are all down.
	   The surface sways sideways as it rises (one wavelength, so it reads as a swell). */
	.ink path {
		fill: currentColor;
	}

	.rise {
		animation: rise var(--ink-ms) cubic-bezier(0.3, 0.1, 0.25, 1) calc(var(--at) * 1ms) both;
	}

	.sway {
		animation: sway var(--ink-ms) ease-in-out calc(var(--at) * 1ms) both;
	}

	.fill {
		display: none;
		fill: currentColor;
	}

	.stroke {
		fill: none;
		stroke: currentColor;
		stroke-width: 26;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}

	/* The outline fades out once the fill is in, so the letters end up exactly as typeset. */
	.trace {
		animation:
			draw var(--trace-ms) cubic-bezier(0.5, 0, 0.2, 1) calc(var(--at) * 1ms) both,
			fade-out var(--fade-ms) ease-out calc(var(--out) * 1ms) both;
	}

	/* A straight stroke is a window that slides along its line: --head is where its leading end
	   is, --tail where its trailing end is (both as a fraction of the way along). The head races
	   ahead and the tail follows, so the line grows out of the edge, travels, and shrinks into
	   the stroke. */
	.slide {
		stroke-dasharray: max(0, calc(var(--head) - var(--tail))) 2;
		stroke-dashoffset: calc(var(--tail) * -1);
		animation:
			appear 1ms linear calc(var(--at) * 1ms) both,
			head var(--head-ms) cubic-bezier(0.2, 0.55, 0.3, 1) calc(var(--at) * 1ms) both,
			tail var(--tail-ms) cubic-bezier(0.2, 0.55, 0.3, 1) calc(var(--at) * 1ms + var(--tail-delay)) both,
			fade-out var(--fade-ms) ease-out calc(var(--out) * 1ms) both;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes head {
		to {
			--head: 1;
		}
	}

	@keyframes tail {
		to {
			--tail: var(--lead);
		}
	}

	/* Holds a stroke back until its moment: a zero-length dash would show as a dot at the edge. */
	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes rise {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(calc(var(--rise) * -1));
		}
	}

	@keyframes sway {
		from {
			transform: translateX(calc(var(--phase) * -1));
		}
		to {
			transform: translateX(calc(var(--phase) * -1 - var(--wl)));
		}
	}

	@keyframes fade-out {
		to {
			stroke-opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stroke {
			display: none;
		}

		.ink {
			display: none;
		}

		.fill {
			display: inline;
		}
	}
</style>
