<script lang="ts">
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import GradientText from '$lib/components/GradientText.svelte';

	import Section from '$lib/layout/Section.svelte';

	let images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
</script>

<Section>
	<div class="flex w-full flex-col items-center gap-24 pb-24 pt-12 md:gap-32 md:pt-0">
		<GradientText text="Artwork" twclass="text-4xl whitespace-nowrap" to="#48C8FF" />

		<div
			class="grid w-full grid-cols-1 items-center gap-20 md:grid-cols-2 md:gap-[8vw] xl:grid-cols-3"
		>
			{#each images as index}
				<Artwork {index} />
			{/each}
		</div>
	</div>
</Section>
