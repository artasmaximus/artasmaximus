<!-- Playing Card Component -->
<script lang="ts">
	import { onMount } from 'svelte';
	export let suit: string | null; // S, C, D, H
	export let rank: string; // A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, J1, J2, J3

	let color = suit === 'D' || suit === 'H' ? 'red' : 'black';

	let fileName = suit ? `${rank} ${suit}.png` : `${rank}.png`;
	let filePath = `../../lib/assets/Cards/${fileName}`;
	let src: any;
	let backSrc: any;

	let flipped = false;

	function flipCard() {
		flipped = !flipped;
	}

	// get the mouse position
	let mouseX = 0;
	let mouseY = 0;
	window.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	onMount(async () => {
		src = (await import(filePath)).default;
		backSrc = (await import(`../../lib/assets/Cards/Back.png`)).default;
	});
</script>

<div class="wrapper">
	<div class="Card {flipped ? 'flipped' : ''}" on:click={flipCard}>
		<div class="front">
			<img class={color} {src} alt="Playing Card" />
		</div>
		<div class="back">
			<img class={color} src={backSrc} alt="Playing Card Back" />
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px;
	}

	.Card {
		position: relative;
		width: auto; /* Adjust size as needed */
		height: auto; /* Adjust size as needed */
		max-width: 300px;
		max-height: 414px;
		min-width: 100px;
		min-height: 138px;
		transform-style: preserve-3d;
		transition: transform 0.25s;
		cursor: pointer;
	}

	.Card:hover {
		transform: scale(1.1);
	}

	.Card.flipped:hover {
		transform: scale(1.1) rotateY(180deg);
	}

	.Card.flipped {
		transform: rotateY(180deg);
	}

	.Card .front,
	.Card .back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
	}

	.Card .back {
		transform: rotateY(180deg);
	}

	.Card img {
		width: 100%;
		height: 100%;
		border-radius: 8px;
	}

	.Card img.red {
		border: 1px solid #c90088;
	}

	.Card img.black {
		border: 1px solid #593fff;
	}
</style>
