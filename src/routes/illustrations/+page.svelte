<script lang="ts">
	import Illustration from '$lib/components/Illustration.svelte';

	let NUMBER_OF_IMAGES = 14;
	let fileName = (i: number) => `Illustration${i}`;
	let fileNames: string[] = [];
	for (let i = 1; i <= NUMBER_OF_IMAGES; i++) {
		fileNames.push(fileName(i));
	}
</script>

<div class="imgGrid">
	{#each fileNames as fileName, i}
		<div class="illustration">
			<Illustration {fileName} imgAlt={fileName} />
		</div>
	{/each}
</div>

<style lang="scss">
	.imgGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1rem;
	}
	.illustration {
		width: fit-content;
		height: fit-content;
	}
</style>
