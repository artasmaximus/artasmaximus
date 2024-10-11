<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Illustration from './Illustration.svelte';
	import { cursorShape, DEFAULT_CURSOR_SHAPE } from '$lib/stores/cursor';

	export let images: { src: string; alt: string }[];

	let selectedImage: number | null = null;
	let gridElement: HTMLElement;

	function selectImage(index: number) {
		selectedImage = index;
		document.body.style.overflow = 'hidden'; // Prevent scrolling when image is selected
	}

	function deselectImage() {
		selectedImage = null;
		document.body.style.overflow = ''; // Re-enable scrolling
		cursorShape.update(() => DEFAULT_CURSOR_SHAPE);
	}

	function handleOutsideClick(event: MouseEvent) {
		if (selectedImage !== null && !gridElement.contains(event.target as Node)) {
			deselectImage();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});
</script>

<div class="illustration-grid" bind:this={gridElement}>
	{#each images as image, index}
		<Illustration
			imgSrc={image.src}
			imgAlt={image.alt}
			maxwidth={300}
			on:select={() => selectImage(index)}
		/>
	{/each}
</div>

{#if selectedImage !== null}
	<div class="overlay" transition:fade={{ duration: 300 }}>
		<div class="selected-image-container">
			<button class="close-button" on:click={deselectImage}>×</button>
			<Illustration
				imgSrc={images[selectedImage].src}
				imgAlt={images[selectedImage].alt}
				maxwidth={Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9)}
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	.illustration-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 80px;
		place-items: center;
		justify-items: center;
		align-items: center;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(20px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9; // Ensure it's above the navbar
	}

	.selected-image-container {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
	}

	.close-button {
		position: absolute;
		top: 10px;
		left: 10px;
		background: rgba(255, 255, 255, 0.7);
		border: none;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
		z-index: 10;
	}

	@media (max-width: 768px) {
		.illustration-grid {
			gap: 64px;
		}
	}
</style>
