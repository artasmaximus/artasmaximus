<script lang="ts">
	import aceHearts from '$lib/assets/cards/A H.png';
	import kingSpades from '$lib/assets/cards/K S.png';
	import queenDiamonds from '$lib/assets/cards/Q D.png';
	import jackClubs from '$lib/assets/cards/J C.png';
	import origins from '$lib/assets/arcdpics/origins.png';
	import symbols from '$lib/assets/arcdpics/symbols.png';
	import dap from '$lib/assets/arcdpics/designapproach.png';
	import Figure from '$lib/components/Project/Figure.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('arcd');

	const cards = [
		{ src: aceHearts, alt: 'Ace of hearts' },
		{ src: kingSpades, alt: 'King of spades' },
		{ src: queenDiamonds, alt: 'Queen of diamonds' },
		{ src: jackClubs, alt: 'Jack of clubs' }
	];
</script>

<ProjectPage {project}>
	{#snippet hero()}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
			{#each cards as card}
				<GlassEffect>
					<img
						src={card.src}
						alt={card.alt}
						class="w-full rounded-lg border border-line bg-surface"
					/>
				</GlassEffect>
			{/each}
		</div>
	{/snippet}

	<ProjectSection
		index={1}
		title="The brief"
		text={[
			"ARCD began in 2021, inspired by my family's love for card games, a tradition that has always been part of our gatherings.",
			'I wanted a deck that worked in play and also held up as modern design, with an emphasis on harmony and symmetry.'
		]}
	>
		<Figure
			mat
			src={origins}
			alt="Early sketches and iterations of the ARCD suit symbols"
			caption="Early sketches and iterations of the suit symbols."
		/>
	</ProjectSection>

	<ProjectSection
		index={2}
		title="Approach"
		text={[
			'After several iterations, I finalized four suit symbols, each constructed using only rectangles and circular arcs so they read as one system.'
		]}
	>
		<Figure
			mat
			src={symbols}
			alt="The four finalized suit symbols built from rectangles and circular arcs"
			caption="The four suits, in gradient and solid variants."
		/>
	</ProjectSection>

	<ProjectSection
		index={3}
		title="Key decisions"
		text={[
			'Every symbol has an inner and outer stroke with opposing color gradients, plus a solid variant that stays legible at the small size of the card corners.',
			'Pairing vibrant color with simple shapes keeps the deck expressive, while drawing from both traditional card motifs and contemporary design.'
		]}
	>
		<Figure
			mat
			src={dap}
			alt="Color and geometry studies for the deck"
			caption="Color and geometry studies."
		/>
	</ProjectSection>

	<ProjectSection
		index={4}
		title="Outcome"
		text={['The full deck lives in Figma: every suit, court card, and color token.']}
	>
		<iframe
			title="ARCD Figma file"
			class="aspect-video w-full rounded-lg border border-line"
			src="https://embed.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master?node-id=0-1&embed-host=share"
			allowfullscreen
		></iframe>
	</ProjectSection>
</ProjectPage>
