// Shaders for the water surface: a wave-equation step and a refraction pass.

export const vertex = `#version 300 es
out vec2 uv;
void main() {
	vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
	uv = p;
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const header = `#version 300 es
precision highp float;
precision highp int;
in vec2 uv;
out vec4 outColor;
`;

// A height field stepped with the 2D wave equation. The needle pulls the
// surface toward a lifted (or, when pressed, sunken) height along the whole
// segment it moved this step, so the water clings to it continuously and the
// wake comes out of the physics rather than from separate drops.
// State: r = height now, g = height one step ago.
export const waterStep = `${header}
uniform sampler2D state;
uniform vec2 texel;
uniform float aspect;
uniform vec2 needleA;
uniform vec2 needleB;
uniform float needleOn;
uniform float radius;
uniform float pull;
uniform float damping;
// 0 is water, 1 is close to syrup: slower waves, more drag, small ripples smoothed away.
uniform float viscosity;
// How hard the needle holds the surface to its height, and the most any point can rise or sink.
uniform float force;
uniform float cap;
// How fast time runs for the water, and how long its motion keeps its energy (0 to ~1).
uniform float pace;
uniform float linger;

float segDist(vec2 p, vec2 a, vec2 b) {
	vec2 ab = b - a, ap = p - a;
	float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
	return length(ap - ab * t);
}

void main() {
	vec2 s = texture(state, uv).rg;
	float around = texture(state, uv - vec2(texel.x, 0.0)).r + texture(state, uv + vec2(texel.x, 0.0)).r
		+ texture(state, uv - vec2(0.0, texel.y)).r + texture(state, uv + vec2(0.0, texel.y)).r;
	float lap = around - 4.0 * s.r;

	// Thicker fluid: waves travel slower, motion loses energy to drag, and the
	// surface relaxes toward its neighbors, which smooths small ripples first.
	// A slower pace scales every per-step change down, so the same motion plays
	// out over more frames; linger takes the energy loss away.
	float speed2 = min(mix(0.45, 0.1, viscosity) * pace, 0.48);
	float drag = mix(0.01, 0.09, viscosity) * pace * (1.0 - linger);
	float velocity = (s.r - s.g) * (1.0 - drag) + speed2 * lap;
	float next = s.r + velocity;
	float decay = 1.0 - (1.0 - damping) * pace * (1.0 - linger);
	next = mix(next, around * 0.25, viscosity * 0.3 * pace) * decay;

	vec2 scale = vec2(aspect, 1.0);
	float d = segDist(uv * scale, needleA * scale, needleB * scale);
	float cling = exp(-pow(d / radius, 2.0)) * needleOn;
	next = mix(next, pull, clamp(cling * force, 0.0, 1.0));
	next = clamp(next, -cap, cap);

	outColor = vec4(next, s.r, 0.0, 1.0);
}`;

// Bends the image by the water's slope, like light refracting through it. The
// height goes through a truncated Fourier series, sum of sin(n x) / n, so more
// terms sharpen the crests; the channels bend by different amounts for a
// spectral fringe.
export const refract = `${header}
uniform sampler2D src;
uniform sampler2D water;
uniform vec2 waterTexel;
uniform int terms;
uniform float strength;
uniform float freq;
uniform float chroma;

float shape(float h) {
	float x = h * freq * 0.15;
	float s = 0.0;
	for (int n = 1; n <= 12; n++) {
		if (n > terms) break;
		s += sin(float(n) * x) / float(n);
	}
	return s;
}

void main() {
	float l = shape(texture(water, uv - vec2(waterTexel.x, 0.0)).r);
	float r = shape(texture(water, uv + vec2(waterTexel.x, 0.0)).r);
	float d = shape(texture(water, uv - vec2(0.0, waterTexel.y)).r);
	float u = shape(texture(water, uv + vec2(0.0, waterTexel.y)).r);
	vec2 off = vec2(r - l, u - d) * strength * 0.8;
	outColor = vec4(
		texture(src, uv + off * (1.0 + 0.5 * chroma)).r,
		texture(src, uv + off).g,
		texture(src, uv + off * (1.0 - 0.5 * chroma)).b,
		1.0
	);
}`;
