<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ArrowButton from './ArrowButton.svelte';
	import { appDetail } from '$lib/stores/appDetail';

	export let items: any[] = [];
	export let itemProps: any[] = [];
	let currentIndex = writable(0);

	const next = () => {
		currentIndex.update((n) => (n + 1) % items.length);
	};

	const prev = () => {
		currentIndex.update((n) => (n - 1 + items.length) % items.length);
	};

	onMount(() => {
		if (items.length === 0) {
			console.warn('Carousel: No items provided');
		}
	});
</script>

<div class="carousel" style="width: ${$appDetail.contentWidth}">
	{#each items as item, index}
		{#if $currentIndex === index}
			<div class="carousel-item">
				<svelte:component this={item} {...itemProps[index]} />
			</div>
		{/if}
	{/each}

	<div class="buttons">
		<div class="arrowLeft" on:click={prev}>
			<ArrowButton direction="left" />
		</div>
		<div class="arrowLeft" on:click={prev}>
			<ArrowButton direction="right" />
		</div>
	</div>
</div>

<style lang="scss">
	.carousel {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		height: 100%;
		overflow: hidden;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 10px;
	}
</style>
