<script lang="ts">
	import Dot from '$lib/components/Dot.svelte';
	import { onMount } from 'svelte';

	const { dotRadius } = $props();

	let dots: number[] = $state([]);
	let numRows = $state(0);
	let numCols = $state(0);

	function calculateDots() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		numCols = Math.ceil(width / dotRadius);
		numRows = Math.ceil(height / dotRadius);
		dots = Array(numRows * numCols).fill(0);
	}

	onMount(() => {
		calculateDots();
		window.addEventListener('resize', calculateDots);
		return () => window.removeEventListener('resize', calculateDots);
	});
</script>

<div
	class="fixed left-0 top-0 -z-10 grid h-screen w-screen bg-stone-50"
	style="grid-template-columns: repeat({numCols}, {dotRadius}px); grid-template-rows: repeat({numRows}, {dotRadius}px);"
>
	{#each dots as _, index}
		<Dot />
	{/each}
</div>
