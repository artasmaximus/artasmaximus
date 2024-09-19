<!-- component to display illustration -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let fileName: string;
	export let imgAlt: string;

	let src: any;
	onMount(async () => {
		src = (await import(`$lib/assets/Illustrations/${fileName}.png`)).default;
	});
</script>

<div class="imgContainer">
	<img {src} alt={imgAlt} />
</div>

<style lang="scss">
	.imgContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;
		img {
			max-width: 100%;
			max-height: 100%;
			aspect-ratio: fit;
		}
	}
</style>
