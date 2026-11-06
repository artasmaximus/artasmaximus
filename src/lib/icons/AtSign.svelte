<script lang="ts">
	// `height` is any CSS length; the width follows the 20:28 shape. `fill` is the color of
	// the whole mark ('currentColor' matches surrounding text).
	let {
		height = '28px',
		fill = '#1A1A1A',
		style = ''
	}: { height?: string; fill?: string; style?: string } = $props();

	// Drawn from strokes so the weights can be tuned:
	//   RING  - the outer curve (a stadium that opens at the bottom right and curls into a tail)
	//   STEM  - the filled inner shape: a vertical bar whose foot runs into the ring's right wall
	// Widening the gap between them: move STEM's x values (8.3 / 11.7) toward the center.
	const RING_WIDTH = 2.2;
</script>

<svg
	viewBox="0 0 20 28"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	style="height: {height}; width: auto; aspect-ratio: 20 / 28; {style}"
>
	<path
		d="M19 16.8V9A8 8 0 0 0 11 1H9A8 8 0 0 0 1 9V19A8 8 0 0 0 9 27H11A8 8 0 0 0 18.15 22.9"
		stroke={fill}
		stroke-width={RING_WIDTH}
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path d="M8.3 9A1.7 1.7 0 0 1 11.7 9V16.3H19V17.8H9.3A1 1 0 0 1 8.3 16.8Z" {fill} />
</svg>
