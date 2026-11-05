<script lang="ts">
	import { onMount } from 'svelte';
	import { GLASS_CURSOR_SHAPE, GLASS_FILTER_ID, SUPPORTS_REFRACTION } from './CursorState.svelte';

	// "Liquid glass": a flat disc of glass whose rim is a convex bevel. One surface drives
	// everything:
	//   - The viewer looks straight down. At each point a ray hits the top surface, bends by
	//     Snell's law, travels down through the glass and lands on the backdrop. Where it
	//     lands is what that pixel shows (the displacement map). The flat middle is
	//     undistorted; the bevel bends hard.
	//   - Red, green and blue see slightly different refractive indices, so they land
	//     slightly apart (dispersion).
	//   - A directional light is refracted through the same surface. Where its rays bunch
	//     up on the backdrop the light is brighter (caustics).
	// All lengths are CSS pixels, measured from the lens center.
	const SIZE = GLASS_CURSOR_SHAPE.width;
	const R = SIZE / 2;

	const IOR = [1.47, 1.5, 1.54]; // red, green, blue
	const BEZEL = 0.9; // bevel width as a fraction of the radius
	const HEIGHT = 16; // how tall the bevel rises
	const BASE = 40; // thickness of the glass at its very edge
	// Direction the light travels (z points at the viewer): in from the top-left.
	const LIGHT = norm([0.5, 0.45, 1]);
	const CAUSTIC_GAIN = 0.0;
	// A final Gaussian pass over the result, in pixels, to soften stair-stepping and fringes.
	const BLUR = 0.0;

	type Vec3 = [number, number, number];

	function norm(v: Vec3): Vec3 {
		const l = Math.hypot(v[0], v[1], v[2]);
		return [v[0] / l, v[1] / l, v[2] / l];
	}

	// Height of the top surface and its normal at (x, y), or null outside the lens.
	function surface(x: number, y: number) {
		const rho = Math.hypot(x, y);
		if (rho >= R) return null;
		const s = Math.min(1, (R - rho) / (BEZEL * R)); // 0 at the rim, 1 where the bevel ends
		const u = 1 - s;
		const a = Math.max(1 - u ** 4, 1e-6);
		// Convex squircle: h(s) = HEIGHT * (1 - (1 - s)^4)^(1/4)
		const h = HEIGHT * a ** 0.25;
		// Its slope is vertical at the rim; cap it so the normal stays well behaved.
		const dhds = s < 1 ? Math.min(HEIGHT * a ** -0.75 * u ** 3, 12) : 0;
		const dHdRho = -dhds / (BEZEL * R); // height falls toward the rim
		const dx = rho > 0 ? x / rho : 0;
		const dy = rho > 0 ? y / rho : 0;
		return { h: BASE + h, normal: norm([-dHdRho * dx, -dHdRho * dy, 1]) };
	}

	// Air -> glass refraction of direction `I` at a surface with unit `normal` (Snell's law).
	function refract(I: Vec3, normal: Vec3, ior: number): Vec3 | null {
		const eta = 1 / ior;
		const cosi = -(I[0] * normal[0] + I[1] * normal[1] + I[2] * normal[2]);
		if (cosi <= 0) return null; // surface faces away from the ray
		const k = 1 - eta * eta * (1 - cosi * cosi);
		const f = eta * cosi - Math.sqrt(k);
		return [eta * I[0] + f * normal[0], eta * I[1] + f * normal[1], eta * I[2] + f * normal[2]];
	}

	// Where a ray that enters the top surface at (x, y) lands on the flat backdrop below.
	function landing(x: number, y: number, I: Vec3, ior: number): [number, number] | null {
		const surf = surface(x, y);
		if (!surf) return [x, y];
		const T = refract(I, surf.normal, ior);
		if (!T) return null;
		const t = surf.h / -T[2];
		return [x + T[0] * t, y + T[1] * t];
	}

	const VIEW: Vec3 = [0, 0, -1];

	function clamp255(v: number) {
		return Math.max(0, Math.min(255, Math.round(v)));
	}

	function toUrl(canvas: HTMLCanvasElement, img: ImageData): string {
		canvas.getContext('2d')!.putImageData(img, 0, 0);
		return canvas.toDataURL('image/png');
	}

	function buildMaps() {
		const N = 128;
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = N;
		if (!canvas.getContext('2d')) return null;

		// One displacement map per color channel. Red/green hold the x/y offset in pixels,
		// encoded around 0.5 with a full range of SIZE (the filter's `scale`).
		const maps = IOR.map((ior) => {
			const img = new ImageData(N, N);
			for (let j = 0; j < N; j++) {
				for (let i = 0; i < N; i++) {
					const x = ((i + 0.5) / N) * SIZE - R;
					const y = ((j + 0.5) / N) * SIZE - R;
					const land = landing(x, y, VIEW, ior) ?? [x, y];
					const k = (j * N + i) * 4;
					img.data[k] = clamp255(128 + ((land[0] - x) / SIZE) * 255);
					img.data[k + 1] = clamp255(128 + ((land[1] - y) / SIZE) * 255);
					img.data[k + 2] = 128;
					img.data[k + 3] = 255;
				}
			}
			return toUrl(canvas, img);
		});

		// Caustics: shoot a grid of light rays through the surface and count how many land in
		// each bin of the backdrop. A bin that gets more than its fair share is brighter.
		const G = 96; // bins across the backdrop
		const M = 288; // light rays across the lens
		const weight = (G / M) ** 2; // so uniform light reads as exactly 1
		const energy = IOR.map((ior) => {
			const acc = new Float32Array(G * G);
			for (let j = 0; j < M; j++) {
				for (let i = 0; i < M; i++) {
					const x = ((i + 0.5) / M) * SIZE - R;
					const y = ((j + 0.5) / M) * SIZE - R;
					if (!surface(x, y)) continue;
					const land = landing(x, y, LIGHT, ior);
					if (!land) continue;
					const fx = ((land[0] + R) / SIZE) * G - 0.5;
					const fy = ((land[1] + R) / SIZE) * G - 0.5;
					const x0 = Math.floor(fx);
					const y0 = Math.floor(fy);
					const tx = fx - x0;
					const ty = fy - y0;
					const taps = [
						[0, 0, (1 - tx) * (1 - ty)],
						[1, 0, tx * (1 - ty)],
						[0, 1, (1 - tx) * ty],
						[1, 1, tx * ty]
					];
					for (const [ox, oy, w] of taps) {
						const bx = x0 + ox;
						const by = y0 + oy;
						if (bx >= 0 && bx < G && by >= 0 && by < G) acc[by * G + bx] += w * weight;
					}
				}
			}
			return acc;
		});

		const sample = (acc: Float32Array, x: number, y: number) => {
			const fx = Math.min(G - 1, Math.max(0, ((x + R) / SIZE) * G - 0.5));
			const fy = Math.min(G - 1, Math.max(0, ((y + R) / SIZE) * G - 0.5));
			const x0 = Math.floor(fx);
			const y0 = Math.floor(fy);
			const x1 = Math.min(G - 1, x0 + 1);
			const y1 = Math.min(G - 1, y0 + 1);
			const tx = fx - x0;
			const ty = fy - y0;
			return (
				acc[y0 * G + x0] * (1 - tx) * (1 - ty) +
				acc[y0 * G + x1] * tx * (1 - ty) +
				acc[y1 * G + x0] * (1 - tx) * ty +
				acc[y1 * G + x1] * tx * ty
			);
		};

		// Each pixel shows the backdrop point its view ray lands on, so read the light there.
		const light = new ImageData(N, N);
		for (let j = 0; j < N; j++) {
			for (let i = 0; i < N; i++) {
				const x = ((i + 0.5) / N) * SIZE - R;
				const y = ((j + 0.5) / N) * SIZE - R;
				const k = (j * N + i) * 4;
				light.data[k + 3] = 255;
				if (!surface(x, y)) continue;
				for (let c = 0; c < 3; c++) {
					const seen = landing(x, y, VIEW, IOR[c]) ?? [x, y];
					const e = sample(energy[c], seen[0], seen[1]);
					light.data[k + c] = clamp255(Math.max(0, e - 1) * CAUSTIC_GAIN * 255);
				}
			}
		}
		return { maps, caustic: toUrl(canvas, light) };
	}

	let mapUrls = $state<string[]>([]);
	let causticUrl = $state('');

	onMount(() => {
		if (!SUPPORTS_REFRACTION) return;
		const built = buildMaps();
		if (!built) return;
		causticUrl = built.caustic;
		mapUrls = built.maps;
	});

	const channels = [
		'1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
		'0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
		'0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'
	];
</script>

{#if mapUrls.length}
	<svg
		width="0"
		height="0"
		aria-hidden="true"
		style="position: absolute; pointer-events: none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<filter
			id={GLASS_FILTER_ID}
			filterUnits="userSpaceOnUse"
			primitiveUnits="userSpaceOnUse"
			x="0"
			y="0"
			width={SIZE}
			height={SIZE}
			color-interpolation-filters="sRGB"
		>
			{#each mapUrls as url, c}
				<feImage
					href={url}
					x="0"
					y="0"
					width={SIZE}
					height={SIZE}
					preserveAspectRatio="none"
					result="map{c}"
				/>
				<feDisplacementMap
					in="SourceGraphic"
					in2="map{c}"
					scale={SIZE}
					xChannelSelector="R"
					yChannelSelector="G"
					result="displaced{c}"
				/>
				<feColorMatrix in="displaced{c}" type="matrix" values={channels[c]} result="channel{c}" />
			{/each}
			<feBlend in="channel0" in2="channel1" mode="screen" result="rg" />
			<feBlend in="rg" in2="channel2" mode="screen" result="refracted" />
			<feImage
				href={causticUrl}
				x="0"
				y="0"
				width={SIZE}
				height={SIZE}
				preserveAspectRatio="none"
				result="caustic"
			/>
			<feBlend in="caustic" in2="refracted" mode="screen" result="lit" />
			<feGaussianBlur in="lit" stdDeviation={BLUR} />
		</filter>
	</svg>
{/if}
