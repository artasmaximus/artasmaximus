/**
 * Extracts a usable accent color from an image: saturated pixels dominate the
 * average, then saturation/lightness are clamped so the result works as a
 * cursor-ring tint and background-ripple color on the stone-50 site background.
 * Grayscale drawings resolve to an honest mid-gray.
 */
export function dominantColor(img: HTMLImageElement): string | null {
	try {
		const N = 24;
		const canvas = document.createElement('canvas');
		canvas.width = N;
		canvas.height = N;
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) return null;
		ctx.drawImage(img, 0, 0, N, N);
		const { data } = ctx.getImageData(0, 0, N, N);

		let r = 0,
			g = 0,
			b = 0,
			wsum = 0;
		for (let i = 0; i < data.length; i += 4) {
			const R = data[i],
				G = data[i + 1],
				B = data[i + 2];
			const mx = Math.max(R, G, B);
			const mn = Math.min(R, G, B);
			const sat = mx === 0 ? 0 : (mx - mn) / mx;
			const w = 0.08 + sat * sat;
			r += R * w;
			g += G * w;
			b += B * w;
			wsum += w;
		}
		r /= wsum;
		g /= wsum;
		b /= wsum;

		let [h, s, l] = rgbToHsl(r, g, b);
		if (s > 0.12) s = Math.max(s, 0.5);
		l = Math.min(Math.max(l, 0.35), 0.55);
		const [R2, G2, B2] = hslToRgb(h, s, l);
		return (
			'#' +
			[R2, G2, B2].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
		);
	} catch {
		return null;
	}
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const mx = Math.max(r, g, b);
	const mn = Math.min(r, g, b);
	const l = (mx + mn) / 2;
	if (mx === mn) return [0, 0, l];
	const d = mx - mn;
	const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
	let h: number;
	if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
	else if (mx === g) h = (b - r) / d + 2;
	else h = (r - g) / d + 4;
	return [h / 6, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	if (s === 0) return [l * 255, l * 255, l * 255];
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	const f = (t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}
