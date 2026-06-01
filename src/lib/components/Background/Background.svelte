<script lang="ts">
	import { onMount } from 'svelte';
	import { bgDotColor } from './Background.svelte.ts';

	const { dotRadius = 35 } = $props();

	const BG_COLOR = '#FAFAF9'; // Tailwind stone-50

	let canvas: HTMLCanvasElement | undefined = $state();
	let webglFailed = $state(false);

	// ---- shader sources ------------------------------------------------
	const vertexSrc = `
		attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0.0, 1.0);
		}
	`;

	const fragmentSrc = `
		precision mediump float;

		uniform float u_time;        // seconds since start
		uniform vec2  u_resolution;  // physical canvas px (already scaled by dpr)
		uniform float u_spacing;     // logical cell size in px (35.0 * dpr)
		uniform vec3  u_bg;          // #FAFAF9
		uniform vec3  u_primary;     // #E0E0E0
		uniform vec3  u_blink;       // #6B6B6B

		// Ring buffer of recent clicks. xy = physical px (gl_FragCoord space),
		// z = the u_time value (seconds) at which the click happened.
		#define CLICK_COUNT 8
		uniform vec3 u_clicks[CLICK_COUNT];
		uniform vec3 u_clickColors[CLICK_COUNT];   // per-click ripple tint

		// ---- hash / noise ------------------------------------------------
		// Classic 2D hash — maps a grid cell coordinate to a stable [0,1) value.
		float hash(vec2 p) {
			p = fract(p * vec2(127.1, 311.7));
			p += dot(p, p + 19.19);
			return fract(p.x * p.y);
		}

		void main() {
			vec2 fc = gl_FragCoord.xy;

			// Grid cell this pixel belongs to
			vec2 cell    = floor(fc / u_spacing);
			vec2 cellPos = mod(fc, u_spacing);           // pixel within cell (0..spacing)
			vec2 center  = vec2(u_spacing * 0.5);        // centre of cell

			// ---- per-cell random values (stable across frames) ---------------
			float r1 = hash(cell);                        // blink period seed
			float r2 = hash(cell + vec2(5.2,  1.3));      // phase offset
			float r3 = hash(cell + vec2(33.7, 92.1));     // blink participation

			// ---- blink calculation -------------------------------------------
			// ~60% of dots participate; the rest stay at primary colour forever.
			float doesBlink = step(0.4, r3);

			// Period: 2.5–5 s per dot, driven by r1 (calm, unhurried cadence)
			float period = mix(2.5, 5.0, r1);
			// t: 0→1 over one period, each cell starting at its own phase
			float t = fract(u_time / period + r2);

			// Work in seconds within the cycle so the ramp speed is constant
			// regardless of period (a longer period just means more rest time).
			float ts = t * period;          // seconds into this cell's cycle
			float ramp = 0.6;               // 0.6 s gradual rise / fall
			float hold = 0.6;               // 0.6 s held at full blink

			// Shape: rise (0.6s) → hold (0.6s) → fall (0.6s) → rest.
			float rise = smoothstep(0.0, ramp, ts);
			float fall = 1.0 - smoothstep(ramp + hold, ramp + hold + ramp, ts);
			float blinkAmt = rise * fall * doesBlink;

			// ---- click ripple ------------------------------------------------
			// An expanding, soft ring radiates from each recent click. As the
			// wavefront sweeps over a dot it lights up; it darkens again once
			// the ring has moved past, so the cascade trails away behind it.
			vec2 cellCenter = cell * u_spacing + center;

			// Derived from spacing so the look is identical at any dpr / density.
			float waveSpeed = u_spacing * 17.0;   // physical px/s the ring expands
			float waveBand  = u_spacing * 3.0;    // ring thickness — wide = blurred
			float waveLife  = 2.0;                // seconds for a ripple to die out

			float rippleAmt = 0.0;
			vec3 rippleColor = u_blink;
			for (int i = 0; i < CLICK_COUNT; i++) {
				vec3 click = u_clicks[i];
				float dt = u_time - click.z;
				if (dt < 0.0) continue;                       // not happened yet
				float cd = length(cellCenter - click.xy);
				float waveRadius = dt * waveSpeed;
				float ring = exp(-pow((cd - waveRadius) / waveBand, 2.0));
				float life = 1.0 - smoothstep(0.0, waveLife, dt);
				float amt = ring * life;
				// Keep the colour of whichever ripple is strongest here.
				if (amt > rippleAmt) {
					rippleAmt = amt;
					rippleColor = u_clickColors[i];
				}
			}

			// ---- dot colour --------------------------------------------------
			// Ambient blink toward u_blink, then the click ripple paints its
			// own random tint on top wherever a wavefront is passing.
			vec3 dotColor = mix(u_primary, u_blink, blinkAmt);
			dotColor = mix(dotColor, rippleColor, rippleAmt);

			// ---- SDF circle (anti-aliased with smoothstep) -------------------
			float dist      = length(cellPos - center);
			float dotRadius = 1.0;    // 1 px radius = 2 px diameter dot
			float aa        = 0.8;    // sub-pixel anti-aliasing width
			float alpha     = 1.0 - smoothstep(dotRadius - aa, dotRadius + aa, dist);

			// ---- composite ---------------------------------------------------
			vec3 color = mix(u_bg, dotColor, alpha);
			gl_FragColor = vec4(color, 1.0);
		}
	`;

	// ---- helpers -------------------------------------------------------
	function hexToVec3(hex: string): [number, number, number] {
		const h = hex.replace('#', '');
		const r = parseInt(h.slice(0, 2), 16) / 255;
		const g = parseInt(h.slice(2, 4), 16) / 255;
		const b = parseInt(h.slice(4, 6), 16) / 255;
		return [r, g, b];
	}

	function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('Shader compile error:', gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	onMount(() => {
		const cv = canvas!;
		const gl = cv.getContext('webgl');
		if (!gl) {
			webglFailed = true;
			return;
		}

		// ---- program -----------------------------------------------------
		const vert = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
		const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
		if (!vert || !frag) {
			webglFailed = true;
			return;
		}
		const program = gl.createProgram();
		gl.attachShader(program, vert);
		gl.attachShader(program, frag);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Program link error:', gl.getProgramInfoLog(program));
			webglFailed = true;
			return;
		}
		gl.useProgram(program);

		// ---- fullscreen quad (2 triangles) -------------------------------
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW
		);
		const aPosition = gl.getAttribLocation(program, 'a_position');
		gl.enableVertexAttribArray(aPosition);
		gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

		// ---- uniform locations -------------------------------------------
		const uTime = gl.getUniformLocation(program, 'u_time');
		const uResolution = gl.getUniformLocation(program, 'u_resolution');
		const uSpacing = gl.getUniformLocation(program, 'u_spacing');
		const uBg = gl.getUniformLocation(program, 'u_bg');
		const uPrimary = gl.getUniformLocation(program, 'u_primary');
		const uBlink = gl.getUniformLocation(program, 'u_blink');
		const uClicks = gl.getUniformLocation(program, 'u_clicks[0]');
		const uClickColors = gl.getUniformLocation(program, 'u_clickColors[0]');

		gl.uniform3fv(uBg, hexToVec3(BG_COLOR));

		// ---- click ripples -----------------------------------------------
		// Ring buffer of the 8 most recent clicks. Each is [x, y, time].
		// Times start far in the past so no ripple shows until a real click.
		const CLICK_COUNT = 8;
		const clicks = new Float32Array(CLICK_COUNT * 3);
		for (let i = 0; i < CLICK_COUNT; i++) clicks[i * 3 + 2] = -1000;
		const clickColors = new Float32Array(CLICK_COUNT * 3);
		let clickIndex = 0;
		gl.uniform3fv(uClicks, clicks);
		gl.uniform3fv(uClickColors, clickColors);

		// Accent palette pulled from the site's gradients (landing text + the
		// Projects / Artwork / Resume cards). Each click picks one at random.
		const RIPPLE_COLORS = [
			'#9747FF', // purple — Frontend Developer / Projects
			'#56D82E', // green  — UX Designer
			'#FF4992', // pink   — Collaborator
			'#FFA21F', // orange — + Friend ;)
			'#48C8FF', // cyan   — Artwork
			'#FF48CE' //  magenta — Resume
		];

		function onPointerDown(e: PointerEvent) {
			const dpr = window.devicePixelRatio || 1;
			const base = clickIndex * 3;
			clicks[base] = e.clientX * dpr;
			// Flip Y: gl_FragCoord's origin is bottom-left, the mouse is top-left.
			clicks[base + 1] = (window.innerHeight - e.clientY) * dpr;
			clicks[base + 2] = nowSec;

			const [r, g, b] = hexToVec3(RIPPLE_COLORS[Math.floor(Math.random() * RIPPLE_COLORS.length)]);
			clickColors[base] = r;
			clickColors[base + 1] = g;
			clickColors[base + 2] = b;

			clickIndex = (clickIndex + 1) % CLICK_COUNT;
			gl!.uniform3fv(uClicks, clicks);
			gl!.uniform3fv(uClickColors, clickColors);
		}
		window.addEventListener('pointerdown', onPointerDown);

		// ---- resize ------------------------------------------------------
		function resize() {
			const dpr = window.devicePixelRatio || 1;
			cv.width = Math.round(window.innerWidth * dpr);
			cv.height = Math.round(window.innerHeight * dpr);
			gl!.viewport(0, 0, cv.width, cv.height);
			gl!.uniform2f(uResolution, cv.width, cv.height);
			gl!.uniform1f(uSpacing, dotRadius * dpr);
		}
		resize();
		window.addEventListener('resize', resize);

		// ---- reactive colour wiring --------------------------------------
		const stopEffect = $effect.root(() => {
			$effect(() => {
				gl!.uniform3fv(uPrimary, hexToVec3(bgDotColor.primary));
				gl!.uniform3fv(uBlink, hexToVec3(bgDotColor.blink));
			});
		});

		// ---- RAF loop ----------------------------------------------------
		let rafId = 0;
		let nowSec = 0;
		function render(ms: number) {
			nowSec = ms * 0.001;
			gl!.uniform1f(uTime, nowSec);
			gl!.drawArrays(gl!.TRIANGLES, 0, 6);
			rafId = requestAnimationFrame(render);
		}
		rafId = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointerdown', onPointerDown);
			stopEffect();
		};
	});
</script>

{#if webglFailed}
	<div class="bg-fallback fixed left-0 top-0 -z-10 h-screen w-screen"></div>
{:else}
	<canvas bind:this={canvas} class="fixed left-0 top-0 -z-10" style="width: 100vw; height: 100vh;"
	></canvas>
{/if}

<style>
	.bg-fallback {
		background-color: #fafaf9;
		background-image: radial-gradient(circle, #e0e0e0 1px, transparent 1px);
		background-size: 35px 35px;
	}
</style>
