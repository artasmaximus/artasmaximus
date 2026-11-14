// WebGL2 ports of the Spectral Iris pack's passes. The math matches the pack
// line for line; only the plumbing differs (uniforms instead of #defines).

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
const float PI = 3.14159265;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

vec3 blur1D(sampler2D tex, vec2 uv, vec2 texel, float sigma) {
	vec3 sum = vec3(0.0);
	float total = 0.0;
	for (int i = -12; i <= 12; i++) {
		float x = float(i) * sigma * 0.25;
		float k = exp(-0.5 * x * x / (sigma * sigma));
		sum += texture(tex, uv + texel * x).rgb * k;
		total += k;
	}
	return sum / total;
}

float dctC(int n) { return n == 0 ? 0.70710678 : 1.0; }
float dctBasis(int x, int u) { return cos(float(2 * x + 1) * float(u) * PI / 16.0); }
`;

export const blur = `${header}
uniform sampler2D src;
uniform vec2 texel;
uniform float sigma;
void main() { outColor = vec4(blur1D(src, uv, texel, sigma), 1.0); }`;

export const band = `${header}
uniform sampler2D src;
uniform sampler2D lowTex;
uniform bool enabled;
uniform float levels;
uniform float paintAmount;
uniform float edgeGain;
uniform float halo;
uniform float ink;
uniform float grade;
void main() {
	vec3 color = texture(src, uv).rgb;
	if (enabled) {
		vec3 low = texture(lowTex, uv).rgb;
		vec3 high = clamp(color - low, -halo, halo);
		float l = luma(low);
		float t = l * levels;
		float lq = (floor(t) + smoothstep(0.3, 0.7, fract(t))) / levels;
		vec3 paint = mix(low, low * (lq / max(l, 1e-4)), paintAmount);
		vec3 tint = mix(vec3(0.92, 0.97, 1.08), vec3(1.06, 1.0, 0.92), clamp(lq, 0.0, 1.0));
		paint = mix(paint, paint * tint, grade);
		color = paint + high * edgeGain;
		color *= 1.0 - ink * smoothstep(0.01, 0.05, -luma(high));
	}
	outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export const dctForward = `${header}
uniform sampler2D src;
uniform float quant;
void main() {
	ivec2 p = ivec2(gl_FragCoord.xy);
	ivec2 origin = (p / 8) * 8;
	ivec2 freq = p - origin;
	ivec2 lim = textureSize(src, 0) - 1;
	vec3 sum = vec3(0.0);
	for (int y = 0; y < 8; y++) {
		float by = dctBasis(y, freq.y);
		for (int x = 0; x < 8; x++) {
			vec3 f = texelFetch(src, min(origin + ivec2(x, y), lim), 0).rgb;
			sum += f * dctBasis(x, freq.x) * by;
		}
	}
	vec3 coef = 0.25 * dctC(freq.x) * dctC(freq.y) * sum;
	float q = quant * (1.0 + float(freq.x + freq.y));
	if (q > 0.0) coef = floor(coef / q + 0.5) * q;
	outColor = vec4(coef, 1.0);
}`;

export const dctInverse = `${header}
uniform sampler2D coefTex;
uniform sampler2D src;
uniform int keep;
void main() {
	ivec2 p = ivec2(gl_FragCoord.xy);
	ivec2 origin = (p / 8) * 8;
	ivec2 xy = p - origin;
	ivec2 lim = textureSize(coefTex, 0) - 1;
	// A block cut off by the edge has lost some coefficients, so it passes through.
	if (any(greaterThan(origin + 7, lim))) { outColor = texelFetch(src, p, 0); return; }
	vec3 f = vec3(0.0);
	for (int v = 0; v < 8; v++) {
		if (v >= keep) break;
		float bv = dctC(v) * dctBasis(xy.y, v);
		for (int u = 0; u < 8; u++) {
			if (u >= keep) break;
			vec3 coef = texelFetch(coefTex, min(origin + ivec2(u, v), lim), 0).rgb;
			f += coef * dctC(u) * dctBasis(xy.x, u) * bv;
		}
	}
	outColor = vec4(clamp(0.25 * f, 0.0, 1.0), 1.0);
}`;

// Shows a texture unchanged, when the water is off.
export const copy = `${header}
uniform sampler2D src;
void main() { outColor = texture(src, uv); }`;
