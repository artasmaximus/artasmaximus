<!-- component to display illustration -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let imgSrc: string;
	export let imgAlt: string;

	let modalOpen: boolean = false;

	let src: any;
	onMount(async () => {
		src = (await import(`$lib/assets/illustrations/${imgSrc}.png`)).default;
	});
</script>

{#if !modalOpen}
	<div class="imgContainer">
		<img {src} alt={imgAlt} />
	</div>
{:else}
	<div class="modal">
		<div class="imgContainer">
			<img {src} alt={imgAlt} />
		</div>
	</div>
{/if}

<style lang="scss">
	.imgContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		position: relative;
		img {
			max-width: 100%;
			max-height: 100%;
			aspect-ratio: fit;
		}
	}
</style>
