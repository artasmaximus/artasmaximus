<script lang="ts">
	import origins from '$lib/assets/arcdpics/origins.png';
	import symbols from '$lib/assets/arcdpics/symbols.png';
	import dap from '$lib/assets/arcdpics/designapproach.png';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import { themes } from '$lib/components/Project/theme';

	const theme = themes.arcd;
</script>

<ProjectPage
	{theme}
	meta={['2021 — ongoing', 'Personal project', 'Design']}
	links={[
		{
			label: 'Figma file',
			href: 'https://www.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master'
		}
	]}
	summary="A 52-card deck that rebuilds the four suits from nothing but rectangles and circular arcs — an exploration of modularity, consistency, and theming."
>
	<ProjectSection
		index={1}
		title="Origins"
		accent={theme.accent}
		imageSide="left"
		frame={false}
		src={origins}
		alt="Early sketches and iterations of the ARCD suit symbols"
		text={[
			"ARCD began over four years ago, inspired by my family's love for card games, a tradition that has always been a part of our gatherings.",
			'I aimed to create a deck that not only served its function in gameplay but also embodied the principles of modern design, with an emphasis on harmony and symmetry.'
		]}
	/>

	<ProjectSection
		index={2}
		title="Symbol design"
		accent={theme.accent}
		imageSide="right"
		frame={false}
		src={symbols}
		alt="The four finalized suit symbols built from rectangles and circular arcs"
		text={[
			'After several iterations, I finalized the design for the four suit symbols, each constructed using only rectangles and circular arcs to create a cohesive structure.',
			'Every symbol features an inner and outer stroke with opposing color gradients, as well as a solid-colored variant for the card corners.'
		]}
	/>

	<ProjectSection
		index={3}
		title="Design approach"
		accent={theme.accent}
		imageSide="left"
		frame={false}
		src={dap}
		alt="Color and geometry studies for the deck"
		text={[
			'ARCD reimagines traditional playing cards through a modern lens, emphasizing geometric symmetry and vibrant gradients.',
			'The relationship between vibrant colors and simple shapes creates a refined, expressive aesthetic, drawing from both traditional card motifs and contemporary design principles.'
		]}
	/>

	<ProjectSection
		index={4}
		title="The working file"
		accent={theme.accent}
		text={[
			'The full deck lives in Figma — every suit, court card, and color token. Step inside and look around.'
		]}
	>
		<iframe
			title="ARCD Figma file"
			class="aspect-video w-full rounded-xl border border-stone-900/10 shadow-sm"
			src="https://embed.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master?node-id=0-1&embed-host=share"
			allowfullscreen
		></iframe>
	</ProjectSection>
</ProjectPage>
