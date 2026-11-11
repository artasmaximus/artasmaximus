<script lang="ts">
	import { onDestroy } from 'svelte';
	import { NEEDLE_CURSOR_SHAPE, NEEDLE_CURSOR_STYLE } from '../CursorState.svelte';
	import HoverEffect from './HoverEffect.svelte';
	import { Needle, Water, WATER_DEFAULTS, type WaterSettings } from '$lib/water/water';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// Wrap an image and the cursor becomes a needle point resting on water: the
	// surface clings to it, and dragging leaves a wake that refracts the image.
	// The WebGL layer only exists while the water moves; once it settles the
	// context is released and the plain image shows again, so a page can hold
	// many of these.
	let {
		src,
		settings = {},
		twclass = '',
		children
	}: {
		/* The same image the children show; it is what gets refracted. */
		src: string;
		settings?: Partial<WaterSettings>;
		twclass?: string;
		children: () => any;
	} = $props();

	const reduceMotion = prefersReducedMotion();
	const needle = new Needle();

	let wrap: HTMLDivElement;
	let canvas = $state<HTMLCanvasElement>();
	// Bumped after a context is released, since a canvas can't get a new one.
	let canvasKey = $state(0);
	let live = $state(false);

	let gl: WebGL2RenderingContext | null = null;
	let water: Water | null = null;
	let tex: WebGLTexture | null = null;
	let raf = 0;
	let starting = false;
	let teardownTimer = 0;

	async function start() {
		clearTimeout(teardownTimer);
		if (water) {
			if (!raf) raf = requestAnimationFrame(tick);
			return;
		}
		if (starting || reduceMotion || !canvas) return;
		starting = true;
		const img = new Image();
		img.src = src;
		await img.decode().catch(() => {});
		starting = false;
		if (!img.naturalWidth || !canvas) return;

		const r = wrap.getBoundingClientRect();
		const scale = Math.min(window.devicePixelRatio || 1, 1280 / Math.max(r.width, r.height));
		const w = Math.max(1, Math.round(r.width * scale));
		const h = Math.max(1, Math.round(r.height * scale));
		canvas.width = w;
		canvas.height = h;

		gl = canvas.getContext('webgl2');
		if (!gl) return;
		try {
			water = new Water(gl);
		} catch (e) {
			console.error(e);
			return;
		}
		if (!water.supported) {
			release();
			return;
		}
		water.resize(w, h);

		tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		raf = requestAnimationFrame(tick);
	}

	function tick() {
		raf = 0;
		if (!water || !tex) return;
		const s = { ...WATER_DEFAULTS, ...settings };
		if (needle.settled(s)) {
			// Fade back to the plain image, then let the context go.
			live = false;
			teardownTimer = window.setTimeout(release, 400);
			return;
		}
		water.step(s, needle);
		water.render(tex, s);
		live = true;
		raf = requestAnimationFrame(tick);
	}

	function release() {
		cancelAnimationFrame(raf);
		raf = 0;
		live = false;
		if (gl) {
			water?.dispose();
			if (tex) gl.deleteTexture(tex);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
			canvasKey++;
		}
		gl = null;
		water = null;
		tex = null;
	}

	function onMove(e: PointerEvent) {
		if (reduceMotion) return;
		const p = Needle.uv(e, wrap);
		needle.move(p.x, p.y);
		start();
	}

	onDestroy(() => {
		clearTimeout(teardownTimer);
		if (typeof window !== 'undefined') release();
	});
</script>

<HoverEffect hoverShape={() => NEEDLE_CURSOR_SHAPE} hoverStyle={NEEDLE_CURSOR_STYLE} {twclass}>
	<div
		bind:this={wrap}
		class="relative"
		role="presentation"
		onpointermove={onMove}
		onpointerdown={(e) => {
			onMove(e);
			needle.down = true;
		}}
		onpointerup={() => (needle.down = false)}
		onpointerleave={() => needle.leave()}
	>
		{@render children()}
		{#key canvasKey}
			<canvas
				bind:this={canvas}
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300"
				style:opacity={live ? 1 : 0}
			></canvas>
		{/key}
	</div>
</HoverEffect>
