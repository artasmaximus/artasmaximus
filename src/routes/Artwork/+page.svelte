<script lang="ts">
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import GradientText from '$lib/components/GradientText.svelte';
	import Section from '$lib/layout/Section.svelte';

	// Vite bundles all images at build time — no per-card runtime async imports
	const rawModules = import.meta.glob('/src/lib/assets/artwork/drawing*.jpeg', {
		eager: true,
		import: 'default'
	});

	const srcs: string[] = Object.entries(rawModules)
		.sort(([a], [b]) => {
			const n = (p: string) => parseInt(p.match(/drawing(\d+)/)?.[1] ?? '0');
			return n(a) - n(b);
		})
		.map(([, src]) => src as string);
</script>

<Section>
	<div class="flex w-full flex-col items-center gap-16 pb-24 pt-12 md:pt-0">
		<GradientText text="Artwork" twclass="text-4xl whitespace-nowrap" to="#48C8FF" />

		<div class="masonry-grid w-full">
			{#each srcs as src, i}
				<div class="artwork-card">
					<Artwork {src} alt="Drawing {i + 1}" />
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.masonry-grid {
		columns: 1;
		column-gap: 2rem;
	}

	@media (min-width: 768px) {
		.masonry-grid {
			columns: 2;
		}
	}

	@media (min-width: 1280px) {
		.masonry-grid {
			columns: 3;
		}
	}

	.artwork-card {
		break-inside: avoid;
		margin-bottom: 2rem;
	}
</style>
