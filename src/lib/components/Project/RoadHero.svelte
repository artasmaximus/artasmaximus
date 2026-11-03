<script lang="ts">
	import { onMount } from 'svelte';

	// Ambient Mini Motorways hero: a few roads grow down from the top edge
	// (blurring under the navbar) and little cars drive back and forth forever.
	const S = 25;
	const GROW_MS = 1600;
	const STAGGER_MS = 650;
	const CAR_COLORS = ['#E2A93B', '#D85A30', '#5A9BC4'];

	interface Pt {
		x: number;
		y: number;
	}
	interface Car {
		d: number;
		dir: 1 | -1;
		speed: number;
		color: string;
	}
	interface Road {
		pts: Pt[];
		segs: number[];
		len: number;
		born: number;
		cars: Car[];
	}

	let canvas: HTMLCanvasElement | undefined = $state();
	let scrollY = $state(0);
	let vh = $state(1000);

	onMount(() => {
		const cv = canvas!;
		const ctx = cv.getContext('2d');
		if (!ctx) return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let roads: Road[] = [];
		let rafId = 0;
		let start = performance.now();
		let last = 0;

		function genRoads(w: number, h: number) {
			const lanesX = Math.floor(w / S);
			const cell = (cx: number, cy: number): Pt => ({ x: cx * S, y: cy * S });

			const count = w > 900 ? 3 : 2;
			const bands = [0.16, 0.48, 0.74];
			const made: Road[] = [];

			for (let r = 0; r < count; r++) {
				let cx = Math.round(((bands[r] + Math.random() * 0.1) * w) / S);
				let cy = -2;
				const pts: Pt[] = [cell(cx, cy)];
				const maxY = Math.floor((h * (0.48 + r * 0.09)) / S);

				while (cy < maxY) {
					cy += 4 + Math.floor(Math.random() * 5);
					pts.push(cell(cx, Math.min(cy, maxY)));
					if (cy >= maxY) break;
					const jog = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 3));
					cx = Math.max(2, Math.min(lanesX - 2, cx + jog));
					pts.push(cell(cx, cy));
				}

				const segs: number[] = [];
				let len = 0;
				for (let i = 1; i < pts.length; i++) {
					const s = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
					segs.push(s);
					len += s;
				}

				const cars: Car[] = [];
				const nCars = 1 + (r % 2);
				for (let c = 0; c < nCars; c++) {
					cars.push({
						d: Math.random() * len,
						dir: Math.random() < 0.5 ? 1 : -1,
						speed: 38 + Math.random() * 30,
						color: CAR_COLORS[(r + c) % CAR_COLORS.length]
					});
				}

				made.push({ pts, segs, len, born: start + r * STAGGER_MS, cars });
			}
			return made;
		}

		function roadPath(pts: Pt[]): Path2D {
			const p = new Path2D();
			p.moveTo(pts[0].x, pts[0].y);
			for (let i = 1; i < pts.length - 1; i++) {
				p.arcTo(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, 10);
			}
			p.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
			return p;
		}

		function posAt(road: Road, d: number): { x: number; y: number; a: number } {
			let acc = 0;
			for (let i = 0; i < road.segs.length; i++) {
				if (acc + road.segs[i] >= d) {
					const f = road.segs[i] ? (d - acc) / road.segs[i] : 0;
					const a = road.pts[i];
					const b = road.pts[i + 1];
					return {
						x: a.x + (b.x - a.x) * f,
						y: a.y + (b.y - a.y) * f,
						a: Math.atan2(b.y - a.y, b.x - a.x)
					};
				}
				acc += road.segs[i];
			}
			const p = road.pts[road.pts.length - 1];
			return { x: p.x, y: p.y, a: 0 };
		}

		const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

		function draw(now: number) {
			const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
			last = now;
			const w = window.innerWidth;
			const h = window.innerHeight;
			ctx!.clearRect(0, 0, w, h);

			for (const road of roads) {
				const t = reduceMotion ? 1 : Math.min(Math.max((now - road.born) / GROW_MS, 0), 1);
				if (t === 0) continue;
				const drawn = easeInOut(t) * road.len;
				const path = roadPath(road.pts);

				ctx!.lineCap = 'round';
				ctx!.lineJoin = 'round';
				ctx!.setLineDash([drawn, road.len + 40]);
				ctx!.strokeStyle = '#E0DBCE';
				ctx!.lineWidth = 15;
				ctx!.stroke(path);
				ctx!.strokeStyle = '#F0ECE2';
				ctx!.lineWidth = 9;
				ctx!.stroke(path);
				ctx!.setLineDash([]);

				if (t === 1) {
					for (const car of road.cars) {
						if (!reduceMotion) {
							car.d += car.dir * car.speed * dt;
							if (car.d >= road.len) {
								car.d = road.len;
								car.dir = -1;
							} else if (car.d <= 0) {
								car.d = 0;
								car.dir = 1;
							}
						}
						const p = posAt(road, car.d);
						// Heading from a short window around the car rather than the
						// segment under it, so it sweeps through corners instead of snapping.
						const ahead = posAt(road, Math.min(car.d + 8, road.len));
						const behind = posAt(road, Math.max(car.d - 8, 0));
						ctx!.save();
						ctx!.translate(p.x, p.y);
						ctx!.rotate(Math.atan2(ahead.y - behind.y, ahead.x - behind.x));
						ctx!.fillStyle = car.color;
						ctx!.beginPath();
						ctx!.roundRect(-6, -3.5, 12, 7, 2.5);
						ctx!.fill();
						ctx!.restore();
					}
				}
			}

			rafId = requestAnimationFrame(draw);
		}

		function resize() {
			const dpr = window.devicePixelRatio || 1;
			cv.width = Math.round(window.innerWidth * dpr);
			cv.height = Math.round(window.innerHeight * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			vh = window.innerHeight;
			start = performance.now();
			roads = genRoads(window.innerWidth, window.innerHeight);
		}

		resize();
		window.addEventListener('resize', resize);
		rafId = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<svelte:window bind:scrollY />

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed left-0 top-0 h-screen w-screen"
	style="z-index: -5; opacity: {Math.max(0, 1 - scrollY / (vh * 0.55))};"
></canvas>
