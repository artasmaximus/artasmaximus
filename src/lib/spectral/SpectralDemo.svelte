<script lang="ts">
	import { onMount } from 'svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import * as glsl from './shaders';
	import { Needle, Water } from '$lib/water/water';

	type Settings = {
		band: boolean;
		sigma: number;
		paint: number;
		levels: number;
		edgeGain: number;
		halo: number;
		ink: number;
		grade: number;
		dct: boolean;
		keep: number;
		quant: number;
		ripple: boolean;
		terms: number;
		strength: number;
		freq: number;
		speed: number;
		chroma: number;
		viscosity: number;
		force: number;
		lift: number;
		press: number;
		cap: number;
		pace: number;
		linger: number;
		needleSize: number;
		trail: number;
	};

	let {
		images,
		start = 0
	}: {
		images: { src: string; label: string }[];
		/* Index of the image shown first. */
		start?: number;
	} = $props();

	const base: Settings = {
		band: false,
		sigma: 4,
		paint: 0.5,
		levels: 8,
		edgeGain: 1.15,
		halo: 0.05,
		ink: 0.2,
		grade: 0.4,
		dct: false,
		keep: 3,
		quant: 0.02,
		ripple: false,
		terms: 5,
		strength: 0.004,
		freq: 30,
		speed: 1.5,
		chroma: 1,
		viscosity: 0.65,
		// The needle: how hard it holds the water, how high it lifts at rest and how
		// deep it pushes when pressed, the height limit, its width, and how far it lags.
		force: 0.35,
		lift: 0.5,
		press: 1,
		cap: 2,
		pace: 0.55,
		linger: 0.6,
		needleSize: 0.026,
		trail: 0.83
	};

	// The same profiles the pack ships, plus the untouched image.
	const presets: Record<string, Partial<Settings>> = {
		Original: {},
		Cinematic: { band: true },
		Painterly: {
			band: true,
			sigma: 6,
			paint: 1,
			levels: 6,
			edgeGain: 1.6,
			halo: 0.1,
			ink: 0.5,
			grade: 0.6
		},
		Compressed: { dct: true, keep: 2, quant: 0.04 },
		Spectral: {
			band: true,
			sigma: 2,
			paint: 0.35,
			halo: 0.08,
			edgeGain: 1.8,
			ink: 0.35,
			dct: true,
			keep: 8,
			quant: 0.04,
			ripple: true,
			terms: 8,
			strength: 0.014,
			freq: 17
		}
	};

	let preset = $state('Spectral');
	let s = $state<Settings>({ ...base, ...presets.Spectral });
	let imageIndex = $state(start);

	// The pointer is a needle resting on the water (see $lib/water).
	const reduceMotion = prefersReducedMotion();
	const needle = new Needle();

	function onMove(e: PointerEvent) {
		const p = Needle.uv(e, e.currentTarget as Element);
		needle.move(p.x, p.y);
	}

	function onDown(e: PointerEvent) {
		onMove(e);
		needle.down = true;
	}

	function onLeave() {
		needle.leave();
	}

	let customSrc = $state<string | null>(null);
	let error = $state('');

	let canvas: HTMLCanvasElement;

	function applyPreset(name: string) {
		preset = name;
		s = { ...base, ...presets[name] };
	}

	function onFile(e: Event) {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		if (customSrc) URL.revokeObjectURL(customSrc);
		customSrc = URL.createObjectURL(file);
	}

	let src = $derived(customSrc ?? images[imageIndex].src);

	onMount(() => {
		const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
		if (!gl) {
			error = 'This demo needs WebGL2.';
			return;
		}
		const floatTargets = !!gl.getExtension('EXT_color_buffer_float');

		function program(fs: string) {
			const p = gl!.createProgram()!;
			for (const [type, code] of [
				[gl!.VERTEX_SHADER, glsl.vertex],
				[gl!.FRAGMENT_SHADER, fs]
			] as const) {
				const sh = gl!.createShader(type)!;
				gl!.shaderSource(sh, code);
				gl!.compileShader(sh);
				if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS))
					throw new Error(gl!.getShaderInfoLog(sh) ?? 'compile failed');
				gl!.attachShader(p, sh);
			}
			gl!.linkProgram(p);
			if (!gl!.getProgramParameter(p, gl!.LINK_STATUS))
				throw new Error(gl!.getProgramInfoLog(p) ?? 'link failed');
			return p;
		}

		let progs: Record<'blur' | 'band' | 'fwd' | 'inv' | 'copy', WebGLProgram>;
		let water: Water;
		try {
			progs = {
				blur: program(glsl.blur),
				band: program(glsl.band),
				fwd: program(glsl.dctForward),
				inv: program(glsl.dctInverse),
				copy: program(glsl.copy)
			};
			water = new Water(gl);
		} catch (e) {
			error = String(e);
			console.error(e);
			return;
		}

		type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; size?: [number, number] };
		let w = 0,
			h = 0;
		let srcTex: WebGLTexture | null = null;
		let targets: Target[] = [];
		const waterOn = water.supported && !reduceMotion;

		function texture(float: boolean, width: number, height: number) {
			const t = gl!.createTexture()!;
			gl!.bindTexture(gl!.TEXTURE_2D, t);
			if (float && floatTargets)
				gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA16F, width, height, 0, gl!.RGBA, gl!.HALF_FLOAT, null);
			else
				gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, width, height, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
			gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
			return t;
		}

		function target(float: boolean, size?: [number, number]): Target {
			const tex = texture(float, size ? size[0] : w, size ? size[1] : h);
			const fb = gl!.createFramebuffer()!;
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
			gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
			return { tex, fb, size };
		}

		// Same buffers as the pack: blur ping-pong, graded image, DCT coefficients, rebuilt image.
		function allocate(img: HTMLImageElement) {
			const scale = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
			// Whole 8x8 DCT blocks only.
			w = Math.round((img.naturalWidth * scale) / 8) * 8;
			h = Math.round((img.naturalHeight * scale) / 8) * 8;
			canvas.width = w;
			canvas.height = h;
			targets.forEach((t) => {
				gl!.deleteTexture(t.tex);
				gl!.deleteFramebuffer(t.fb);
			});
			targets = [target(true), target(true), target(false), target(true), target(false)];
			if (waterOn) water.resize(w, h);

			// Draw through a 2D canvas so the image arrives at the working size.
			const c = document.createElement('canvas');
			c.width = w;
			c.height = h;
			c.getContext('2d')!.drawImage(img, 0, 0, w, h);
			if (srcTex) gl!.deleteTexture(srcTex);
			srcTex = texture(false, w, h);
			gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
			gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, gl!.RGBA, gl!.UNSIGNED_BYTE, c);
		}

		function pass(
			p: WebGLProgram,
			out: Target | null,
			inputs: Record<string, WebGLTexture>,
			uniforms: Record<string, number | boolean | [number, number] | Float32Array>
		) {
			gl!.useProgram(p);
			gl!.bindFramebuffer(gl!.FRAMEBUFFER, out ? out.fb : null);
			const [vw, vh] = out?.size ?? [w, h];
			gl!.viewport(0, 0, vw, vh);
			Object.entries(inputs).forEach(([name, tex], i) => {
				gl!.activeTexture(gl!.TEXTURE0 + i);
				gl!.bindTexture(gl!.TEXTURE_2D, tex);
				gl!.uniform1i(gl!.getUniformLocation(p, name), i);
			});
			for (const [name, v] of Object.entries(uniforms)) {
				const loc = gl!.getUniformLocation(p, name);
				if (v instanceof Float32Array) gl!.uniform4fv(loc, v);
				else if (Array.isArray(v)) gl!.uniform2f(loc, v[0], v[1]);
				else if (typeof v === 'boolean') gl!.uniform1i(loc, v ? 1 : 0);
				else if (name === 'keep' || name === 'terms') gl!.uniform1i(loc, v);
				else gl!.uniform1f(loc, v);
			}
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		let output: WebGLTexture | null = null;

		// Passes 1-5: only rerun when the image or a setting changes.
		function process(st: Settings) {
			if (!srcTex) return;
			const [t1, t2, graded, coefs, rebuilt] = targets;
			if (st.band) {
				pass(progs.blur, t1, { src: srcTex }, { texel: [1 / w, 0], sigma: st.sigma });
				pass(progs.blur, t2, { src: t1.tex }, { texel: [0, 1 / h], sigma: st.sigma });
			}
			pass(
				progs.band,
				graded,
				{ src: srcTex, lowTex: t2.tex },
				{
					enabled: st.band,
					levels: st.levels,
					paintAmount: st.paint,
					edgeGain: st.edgeGain,
					halo: st.halo,
					ink: st.ink,
					grade: st.grade
				}
			);
			output = graded.tex;
			if (st.dct) {
				pass(progs.fwd, coefs, { src: graded.tex }, { quant: st.quant });
				pass(progs.inv, rebuilt, { coefTex: coefs.tex, src: graded.tex }, { keep: st.keep });
				output = rebuilt.tex;
			}
		}

		// Pass 6: refract the processed image through the water, or show it as is.
		function present(st: Settings) {
			if (!output) return;
			if (st.ripple && waterOn) water.render(output, st);
			else pass(progs.copy, null, { src: output }, {});
		}

		let visible = true;
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		io.observe(canvas);

		let loadedSrc = '';
		let lastKey = '';
		let raf = 0;
		let loading = false;

		// Runs whenever the image or a setting changes, and from the frame loop while the ripple moves.
		function update() {
			if (src !== loadedSrc) {
				if (loading) return;
				loading = true;
				const want = src;
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => {
					allocate(img);
					loadedSrc = want;
					lastKey = '';
					loading = false;
					update();
					// A first press at the center, so the water shows before anyone moves.
					needle.intro = 6;
				};
				img.onerror = () => {
					error = 'Could not load that image.';
					loadedSrc = want;
					loading = false;
				};
				img.src = want;
				return;
			}
			if (!srcTex) return;
			const key = JSON.stringify(s);
			if (key !== lastKey) {
				lastKey = key;
				process(s);
			}
			present(s);
		}

		// The water runs while the pointer is over it and for a few seconds after,
		// then is cleared and the image settles, so an idle page does no work.
		let running = false;
		function frame() {
			raf = requestAnimationFrame(frame);
			if (!visible || !s.ripple || !waterOn || !output) return;
			if (needle.settled(s)) {
				if (running) {
					water.clear();
					present(s);
					running = false;
				}
				return;
			}
			running = true;
			water.step(s, needle);
			present(s);
		}
		raf = requestAnimationFrame(frame);
		redraw = update;
		update();

		return () => {
			redraw = () => {};
			cancelAnimationFrame(raf);
			io.disconnect();
			water.dispose();
		};
	});

	let redraw = () => {};
	$effect(() => {
		// Read everything the picture depends on, so any change redraws it.
		JSON.stringify(s);
		void src;
		redraw();
	});

	const sliders: {
		key: keyof Settings;
		label: string;
		min: number;
		max: number;
		step: number;
		group: string;
	}[] = [
		{ key: 'sigma', label: 'Band width', min: 2, max: 16, step: 1, group: 'band' },
		{ key: 'paint', label: 'Paint', min: 0, max: 1, step: 0.05, group: 'band' },
		{ key: 'halo', label: 'Halo limit', min: 0.02, max: 0.3, step: 0.01, group: 'band' },
		{ key: 'edgeGain', label: 'Detail gain', min: 0, max: 4, step: 0.1, group: 'band' },
		{ key: 'ink', label: 'Ink', min: 0, max: 1, step: 0.05, group: 'band' },
		{ key: 'keep', label: 'Frequencies kept', min: 1, max: 8, step: 1, group: 'dct' },
		{ key: 'quant', label: 'Quantization', min: 0, max: 0.08, step: 0.005, group: 'dct' },
		// The liquid: what the water itself is like.
		{ key: 'viscosity', label: 'Thickness', min: 0, max: 1, step: 0.05, group: 'liquid' },
		{ key: 'force', label: 'Cling', min: 0.05, max: 1, step: 0.05, group: 'liquid' },
		{ key: 'cap', label: 'Swell limit', min: 0.2, max: 3, step: 0.1, group: 'liquid' },
		{ key: 'pace', label: 'Pace', min: 0.1, max: 1.5, step: 0.05, group: 'liquid' },
		{ key: 'linger', label: 'Linger', min: 0, max: 0.95, step: 0.05, group: 'liquid' },
		// The needle: how you touch it.
		{ key: 'needleSize', label: 'Size', min: 0.008, max: 0.06, step: 0.002, group: 'needle' },
		{ key: 'lift', label: 'Lift', min: 0, max: 1.5, step: 0.05, group: 'needle' },
		{ key: 'press', label: 'Press depth', min: 0, max: 2.5, step: 0.05, group: 'needle' },
		{ key: 'trail', label: 'Drag behind', min: 0, max: 0.95, step: 0.01, group: 'needle' },
		// The light: how the surface bends the image.
		{ key: 'strength', label: 'Refraction', min: 0.001, max: 0.016, step: 0.001, group: 'light' },
		{ key: 'terms', label: 'Crest sharpness', min: 1, max: 12, step: 1, group: 'light' },
		{ key: 'freq', label: 'Color bands', min: 10, max: 60, step: 1, group: 'light' }
	];

	// Panels are grouped the way you'd describe the scene. Each belongs to one
	// effect, and only the first panel of an effect carries its on/off switch.
	const sections: {
		label: string;
		groups: {
			id: string;
			label: string;
			hint?: string;
			effect: 'band' | 'dct' | 'ripple';
			toggle?: boolean;
		}[];
	}[] = [
		{
			label: 'Image',
			groups: [
				{ id: 'band', label: 'Band split', effect: 'band', toggle: true },
				{ id: 'dct', label: 'Cosine compression', effect: 'dct', toggle: true }
			]
		},
		{
			label: 'Water',
			groups: [
				{ id: 'liquid', label: 'The liquid', hint: 'What the water is like', effect: 'ripple', toggle: true },
				{ id: 'needle', label: 'The needle', hint: 'How you touch it', effect: 'ripple' },
				{ id: 'light', label: 'The light', hint: 'How it bends the image', effect: 'ripple' }
			]
		}
	];
</script>

<div class="flex flex-col gap-6">
	<div class="overflow-hidden rounded-lg border border-line bg-black">
		{#if error}
			<p class="p-8 text-small text-white/70">{error}</p>
		{/if}
		<!-- The site's glass cursor, so the lens rides on top of the ripples it makes. -->
		<GlassEffect twclass="mx-auto w-fit max-w-full">
			<canvas
				bind:this={canvas}
				class="block h-auto max-h-[75vh] w-auto max-w-full touch-none select-none"
				aria-label="The selected image with the Spectral passes applied. The pointer drags through it like a needle on water; pressing pushes the needle in."
				onpointermove={onMove}
				onpointerdown={onDown}
				onpointerup={() => (needle.down = false)}
				onpointerleave={onLeave}
			></canvas>
		</GlassEffect>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
			{#each Object.keys(presets) as name}
				<button
					type="button"
					class="rounded-full px-4 py-1.5 text-small transition-colors {preset === name
						? 'bg-ink text-bg'
						: 'text-ink-muted hover:text-ink'}"
					aria-pressed={preset === name}
					onclick={() => applyPreset(name)}
				>
					{name}
				</button>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-2 text-small text-ink-muted">
			{#each images as img, i}
				<button
					type="button"
					class="rounded-full border px-3 py-1 transition-colors {!customSrc && imageIndex === i
						? 'border-ink text-ink'
						: 'border-line hover:text-ink'}"
					onclick={() => {
						customSrc = null;
						imageIndex = i;
					}}
				>
					{img.label}
				</button>
			{/each}
			<label
				class="cursor-pointer rounded-full border px-3 py-1 transition-colors {customSrc
					? 'border-ink text-ink'
					: 'border-line hover:text-ink'}"
			>
				Your image
				<input type="file" accept="image/*" class="sr-only" onchange={onFile} />
			</label>
		</div>
	</div>

	{#each sections as section}
		<div class="flex flex-col gap-3">
			<h3 class="text-label uppercase tracking-wide text-ink-subtle">{section.label}</h3>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each section.groups as g}
					<fieldset class="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4">
						<div class="flex items-start justify-between gap-2">
							<div class="flex flex-col">
								<span class="text-small font-medium text-ink">{g.label}</span>
								{#if g.hint}<span class="text-label text-ink-subtle">{g.hint}</span>{/if}
							</div>
							{#if g.toggle}
								<input
									type="checkbox"
									aria-label="{g.label} on"
									bind:checked={s[g.effect]}
									onchange={() => (preset = '')}
									class="mt-0.5 h-4 w-4 accent-[#1A1A1A]"
								/>
							{/if}
						</div>
						{#each sliders.filter((sl) => sl.group === g.id) as sl}
							<label
								class="flex flex-col gap-1 text-label text-ink-muted transition-opacity {s[g.effect]
									? ''
									: 'opacity-40'}"
							>
								<span class="flex justify-between">
									{sl.label}<span class="tabular-nums">{s[sl.key]}</span>
								</span>
								<input
									type="range"
									min={sl.min}
									max={sl.max}
									step={sl.step}
									value={s[sl.key] as number}
									oninput={(e) => {
										(s as Record<string, number | boolean>)[sl.key] = +e.currentTarget.value;
										preset = '';
									}}
									disabled={!s[g.effect]}
									class="accent-[#1A1A1A]"
								/>
							</label>
						{/each}
					</fieldset>
				{/each}
			</div>
		</div>
	{/each}
	<p class="text-small text-ink-subtle">Drag across the image like a needle on water, and press to push it in. Original shows the untouched image.</p>
</div>
