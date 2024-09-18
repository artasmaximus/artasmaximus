<script lang="ts">
	import Illustration from '$lib/components/Illustration.svelte';

	let NUM_ILLUSTRATIONS = 14;
	let illustrationFileNames: string[] = [];
	for (let i = 1; i <= NUM_ILLUSTRATIONS; i++) {
		illustrationFileNames.push(`Illustration${i}`);
	}
</script>

<div class="grid">
	{#each illustrationFileNames as illustrationFileName}
		<Illustration imgSrc={illustrationFileName} imgAlt={illustrationFileName} />
	{/each}
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1rem;
		padding: 32px;
		padding-top: 0px;
	}
</style>
