import * as glsl from './shaders';

/* Everything about the water a person would describe: the liquid, the needle
   touching it, and how its surface bends light. */
export type WaterSettings = {
	// The liquid
	viscosity: number;
	force: number;
	cap: number;
	pace: number;
	linger: number;
	// The needle
	needleSize: number;
	lift: number;
	press: number;
	trail: number;
	// The light
	strength: number;
	terms: number;
	freq: number;
	chroma: number;
};

// Tuned by hand on the artwork page.
export const WATER_DEFAULTS: WaterSettings = {
	viscosity: 0.62,
	force: 1.78,
	cap: 2,
	pace: 0.55,
	linger: 0.99,
	needleSize: 0.0125,
	lift: 0.1,
	press: 5,
	trail: 0.93,
	strength: 0.06,
	terms: 8,
	freq: 111,
	chroma: 1.05
};

/* The pointer as a needle resting on the water, in texture space (y up). It
   trails the pointer, which reads as the surface clinging to it; pressing
   pushes it in. */
export class Needle {
	x = 0.5;
	y = 0.5;
	tx = 0.5;
	ty = 0.5;
	over = false;
	down = false;
	leftAt = -Infinity;
	/* Frames of a pressed needle at the center, e.g. so the water shows on load. */
	intro = 0;

	/* Pointer position over `el`, as texture coordinates. */
	static uv(e: PointerEvent, el: Element) {
		const r = el.getBoundingClientRect();
		return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
	}

	move(x: number, y: number) {
		this.tx = x;
		this.ty = y;
		// Entering, the needle starts where the pointer is instead of streaking over from its last spot.
		if (!this.over) {
			this.x = x;
			this.y = y;
		}
		this.over = true;
	}

	leave() {
		this.over = false;
		this.down = false;
		this.leftAt = performance.now();
	}

	/* Settled: the pointer is away, nothing is queued, and the waves have had
	   time to die. Slow, lingering water needs longer, so pass its settings. */
	settled(s?: Pick<WaterSettings, 'pace' | 'linger'>) {
		const wait = s ? 4000 + (12000 * s.linger) / Math.max(s.pace, 0.1) : 6000;
		return !this.over && this.intro <= 0 && performance.now() - this.leftAt > wait;
	}
}

type Target = { tex: WebGLTexture; fb: WebGLFramebuffer };

const SIM_WIDTH = 320;

/* The water surface on a WebGL2 context: steps the height field and refracts
   a texture through it. Needs float render targets; check `supported`. */
export class Water {
	readonly supported: boolean;
	private gl: WebGL2RenderingContext;
	private stepProg: WebGLProgram | null = null;
	private refractProg: WebGLProgram | null = null;
	private sim: Target[] = [];
	private w = 0;
	private h = 0;
	private sw = 0;
	private sh = 0;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.supported = !!gl.getExtension('EXT_color_buffer_float');
		if (!this.supported) return;
		this.stepProg = this.program(glsl.waterStep);
		this.refractProg = this.program(glsl.refract);
	}

	private program(fs: string) {
		const gl = this.gl;
		const p = gl.createProgram()!;
		for (const [type, code] of [
			[gl.VERTEX_SHADER, glsl.vertex],
			[gl.FRAGMENT_SHADER, fs]
		] as const) {
			const sh = gl.createShader(type)!;
			gl.shaderSource(sh, code);
			gl.compileShader(sh);
			if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
				throw new Error(gl.getShaderInfoLog(sh) ?? 'water shader failed to compile');
			gl.attachShader(p, sh);
		}
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS))
			throw new Error(gl.getProgramInfoLog(p) ?? 'water program failed to link');
		return p;
	}

	private target(): Target {
		const gl = this.gl;
		const tex = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.sw, this.sh, 0, gl.RGBA, gl.HALF_FLOAT, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		const fb = gl.createFramebuffer()!;
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
		return { tex, fb };
	}

	/* Size of the image being refracted. The water simulates at a low
	   resolution with the same aspect; linear filtering smooths it on the way up. */
	resize(w: number, h: number) {
		if (!this.supported) return;
		this.w = w;
		this.h = h;
		this.disposeSim();
		this.sw = SIM_WIDTH;
		this.sh = Math.max(1, Math.round((SIM_WIDTH * h) / w));
		this.sim = [this.target(), this.target()];
		this.clear();
	}

	clear() {
		const gl = this.gl;
		for (const t of this.sim) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	}

	/* Two wave-equation steps. The needle sweeps the segment it moved, split
	   across the steps, so even a fast stroke leaves one unbroken line. */
	step(s: WaterSettings, needle: Needle) {
		if (!this.sim.length || !this.stepProg) return;
		const gl = this.gl;
		const ax = needle.x,
			ay = needle.y;
		let on = needle.over,
			pull = needle.down ? -s.press : s.lift;
		if (needle.intro > 0) {
			needle.intro--;
			needle.x = needle.tx = 0.5;
			needle.y = needle.ty = 0.5;
			on = true;
			pull = -s.press;
		} else {
			const follow = 1 - s.trail;
			needle.x += (needle.tx - needle.x) * follow;
			needle.y += (needle.ty - needle.y) * follow;
		}

		const p = this.stepProg;
		gl.useProgram(p);
		gl.viewport(0, 0, this.sw, this.sh);
		const u = (name: string) => gl.getUniformLocation(p, name);
		gl.uniform1i(u('state'), 0);
		gl.uniform2f(u('texel'), 1 / this.sw, 1 / this.sh);
		gl.uniform1f(u('aspect'), this.w / this.h);
		gl.uniform1f(u('needleOn'), on ? 1 : 0);
		gl.uniform1f(u('radius'), s.needleSize);
		gl.uniform1f(u('pull'), pull);
		gl.uniform1f(u('damping'), 0.995);
		gl.uniform1f(u('viscosity'), s.viscosity);
		gl.uniform1f(u('force'), s.force);
		gl.uniform1f(u('cap'), s.cap);
		gl.uniform1f(u('pace'), s.pace);
		gl.uniform1f(u('linger'), s.linger);

		const STEPS = 2;
		for (let i = 0; i < STEPS; i++) {
			const t0 = i / STEPS,
				t1 = (i + 1) / STEPS;
			gl.uniform2f(u('needleA'), ax + (needle.x - ax) * t0, ay + (needle.y - ay) * t0);
			gl.uniform2f(u('needleB'), ax + (needle.x - ax) * t1, ay + (needle.y - ay) * t1);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.sim[1].fb);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.sim[0].tex);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			this.sim.reverse();
		}
	}

	/* Draws `src` refracted through the water into `fb` (null for the canvas). */
	render(src: WebGLTexture, s: WaterSettings, fb: WebGLFramebuffer | null = null) {
		if (!this.sim.length || !this.refractProg) return;
		const gl = this.gl;
		const p = this.refractProg;
		gl.useProgram(p);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.viewport(0, 0, this.w, this.h);
		const u = (name: string) => gl.getUniformLocation(p, name);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src);
		gl.uniform1i(u('src'), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.sim[0].tex);
		gl.uniform1i(u('water'), 1);
		gl.uniform2f(u('waterTexel'), 1 / this.sw, 1 / this.sh);
		gl.uniform1i(u('terms'), s.terms);
		gl.uniform1f(u('strength'), s.strength);
		gl.uniform1f(u('freq'), s.freq);
		gl.uniform1f(u('chroma'), s.chroma);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}

	private disposeSim() {
		for (const t of this.sim) {
			this.gl.deleteTexture(t.tex);
			this.gl.deleteFramebuffer(t.fb);
		}
		this.sim = [];
	}

	dispose() {
		this.disposeSim();
		if (this.stepProg) this.gl.deleteProgram(this.stepProg);
		if (this.refractProg) this.gl.deleteProgram(this.refractProg);
	}
}
