// Reads static/playground/*.wav and writes src/lib/playground/rhythm.json:
// per clip, the syllable-peak times (seconds) found in the amplitude envelope,
// plus the dominant modulation rate (Hz) from a Fourier transform of that envelope.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'static/playground');

function readWav(buf) {
	let p = 12, fmt, data;
	while (p < buf.length - 8) {
		const id = buf.toString('ascii', p, p + 4), size = buf.readUInt32LE(p + 4);
		if (id === 'fmt ') fmt = { ch: buf.readUInt16LE(p + 10), sr: buf.readUInt32LE(p + 12), bits: buf.readUInt16LE(p + 22) };
		if (id === 'data') data = buf.subarray(p + 8, p + 8 + size);
		p += 8 + size + (size % 2);
	}
	if (fmt.bits !== 16) throw new Error('expected 16-bit PCM');
	const n = Math.floor(data.length / 2 / fmt.ch), x = new Float32Array(n);
	for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * 2 * fmt.ch) / 32768;
	return { sr: fmt.sr, x };
}

const ENV_HZ = 200;
function envelope({ sr, x }) {
	const hop = sr / ENV_HZ, n = Math.floor(x.length / hop), e = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		let s = 0; const a = Math.floor(i * hop), b = Math.floor((i + 1) * hop);
		for (let j = a; j < b; j++) s += x[j] * x[j];
		e[i] = Math.sqrt(s / (b - a));
	}
	// smooth (~40 ms) so each syllable is a single bump
	const w = 4, out = new Float32Array(n);
	for (let i = 0; i < n; i++) {
		let s = 0, c = 0;
		for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) { s += e[j]; c++; }
		out[i] = s / c;
	}
	return out;
}

function peaks(env) {
	const max = Math.max(...env), minGap = Math.round(0.09 * ENV_HZ), thr = 0.12 * max;
	const found = [];
	for (let i = 1; i < env.length - 1; i++) {
		if (env[i] < thr || env[i] < env[i - 1] || env[i] <= env[i + 1]) continue;
		// prominence: must rise 12% of max above the lowest point since the previous peak
		const prev = found.length ? found[found.length - 1] : 0;
		let lo = Infinity;
		for (let j = prev; j <= i; j++) lo = Math.min(lo, env[j]);
		if (found.length && env[i] - lo < 0.12 * max) continue;
		if (found.length && i - prev < minGap) { if (env[i] > env[prev]) found[found.length - 1] = i; continue; }
		found.push(i);
	}
	return found.map((i) => +(i / ENV_HZ).toFixed(3));
}

// Dominant modulation frequency, 2–10 Hz (naive DFT, the envelope is short)
function modulationRate(env) {
	const m = env.reduce((a, b) => a + b, 0) / env.length, n = env.length;
	let best = 0, bestF = 0;
	for (let f = 2; f <= 10; f += 0.05) {
		let re = 0, im = 0;
		for (let i = 0; i < n; i++) {
			const v = (env[i] - m) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)));
			re += v * Math.cos((2 * Math.PI * f * i) / ENV_HZ);
			im -= v * Math.sin((2 * Math.PI * f * i) / ENV_HZ);
		}
		const mag = Math.hypot(re, im);
		if (mag > best) { best = mag; bestF = f; }
	}
	return +bestF.toFixed(2);
}

const out = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith('.wav')).sort()) {
	const wav = readWav(readFileSync(join(dir, f)));
	const env = envelope(wav), pk = peaks(env);
	out[f.replace('.wav', '')] = { duration: +(wav.x.length / wav.sr).toFixed(3), rate: modulationRate(env), peaks: pk };
	console.log(f, 'duration', out[f.replace('.wav', '')].duration, 'rate', out[f.replace('.wav', '')].rate, 'Hz', 'peaks', pk.length);
}
writeFileSync(join(root, 'src/lib/playground/rhythm.json'), JSON.stringify(out, null, '\t') + '\n');
