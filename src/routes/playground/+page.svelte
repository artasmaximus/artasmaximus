<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { gpuParagraph } from '$lib/playground/blocks';
	import RhythmText from '$lib/playground/RhythmText.svelte';
</script>

<Seo title="Playground" description="Text revealed in time with speech rhythm." />

<Section>
	<div class="flex w-full flex-col gap-10">
		<Heading>Playground</Heading>
		<RhythmText blocks={gpuParagraph} />
	</div>
</Section>
