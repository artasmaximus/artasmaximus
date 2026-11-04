<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// A single road standing in for a section divider. Two cars drive toward each
	// other, bump, and turn around; each also turns around at the end of the road.
	const CAR_W = 16;
	const BUMP_PAUSE_MS = 280;
	const COLORS = ['#EC4B44', '#6FE0FF'];

	let road: HTMLDivElement | undefined = $state();
	let carEls: HTMLSpanElement[] = $state([]);

	onMount(() => {
		const reduceMotion = prefersReducedMotion();
		let width = road!.clientWidth;
		const cars = [
			{ x: width * 0.12, dir: 1, speed: 70 },
			{ x: width * 0.78, dir: -1, speed: 54 }
		];
		let pausedUntil = 0;
		let rafId = 0;
		let last = 0;
		let visible = true;

		function place() {
			cars.forEach((car, i) => {
				carEls[i].style.transform = `translate(${car.x}px, -50%)`;
			});
		}

		function frame(now: number) {
			rafId = requestAnimationFrame(frame);
			if (!visible) {
				last = 0;
				return;
			}
			const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
			last = now;
			if (now < pausedUntil) return;

			const [a, b] = cars;
			a.x += a.dir * a.speed * dt;
			b.x += b.dir * b.speed * dt;

			// Bump: cars are facing each other and touching.
			if (a.dir === 1 && b.dir === -1 && a.x + CAR_W >= b.x) {
				const overlap = a.x + CAR_W - b.x;
				a.x -= overlap / 2;
				b.x += overlap / 2;
				a.dir = -1;
				b.dir = 1;
				pausedUntil = now + BUMP_PAUSE_MS;
			}
			for (const car of cars) {
				if (car.x <= 0) {
					car.x = 0;
					car.dir = 1;
				} else if (car.x + CAR_W >= width) {
					car.x = width - CAR_W;
					car.dir = -1;
				}
			}
			place();
		}

		const resizeObserver = new ResizeObserver(() => {
			width = road!.clientWidth;
		});
		resizeObserver.observe(road!);
		const visibilityObserver = new IntersectionObserver(
			([entry]) => (visible = entry.isIntersecting)
		);
		visibilityObserver.observe(road!);

		place();
		if (reduceMotion) {
			cars[0].x = width * 0.3;
			cars[1].x = width * 0.7;
			place();
		} else {
			rafId = requestAnimationFrame(frame);
		}

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
		};
	});
</script>

<div
	bind:this={road}
	aria-hidden="true"
	class="relative mb-6 h-4 w-full rounded-full border-y-2 border-[#E3D9BF] bg-[#FFF3D6]"
>
	{#each COLORS as color, i}
		<span
			bind:this={carEls[i]}
			class="absolute left-0 top-1/2 block h-2 rounded-[3px]"
			style="width: {CAR_W}px; background: {color}; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);"
		></span>
	{/each}
</div>
