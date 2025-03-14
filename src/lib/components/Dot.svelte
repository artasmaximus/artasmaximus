<script lang="ts">
	import { onMount } from 'svelte';

	let primaryColor = '#E0E0E0';
	let blinkColor = '#6B6B6B';

	let dotColor = $state(primaryColor);
	let boxSize = 35;

	function toggleColor() {
		let newColor = dotColor === primaryColor ? blinkColor : primaryColor;
		dotColor = newColor;
	}
	function blink() {
		// Only blink 30% of the time
		if (Math.random() > 0.4) {
			// Schedule next potential blink
			setTimeout(blink, 1000 + Math.random() * 2000);
			return;
		}

		// If we do blink, run the sequence
		toggleColor();
		setTimeout(() => {
			toggleColor();
			// Schedule next potential blink
			setTimeout(blink, 1000 + Math.random() * 2000);
		}, 600);
	}

	onMount(() => {
		// Initial delay is random for each instance
		setTimeout(blink, Math.random() * 2000);
	});
</script>

<div class="dot-wrapper w-[{boxSize}px] h-[{boxSize}px] justify-center align-middle">
	<div class="dot" style="background: {dotColor};"></div>
</div>

<style>
	.dot {
		width: 2px;
		height: 2px;
		border-radius: 50%;
		transition: background-color 0.6s ease-in-out;
		/* transform: translateX(50%) translateY(50%); */
	}
</style>
