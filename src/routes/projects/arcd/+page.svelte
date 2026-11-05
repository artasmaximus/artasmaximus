<script lang="ts">
	import aceHearts from '$lib/assets/cards/A H.png';
	import kingSpades from '$lib/assets/cards/K S.png';
	import queenDiamonds from '$lib/assets/cards/Q D.png';
	import jackClubs from '$lib/assets/cards/J C.png';
	import origins from '$lib/assets/arcdpics/origins.png';
	import symbolsRed from '$lib/assets/arcdpics/symbols-red.png';
	import symbolsBlue from '$lib/assets/arcdpics/symbols-blue.png';
	import dap from '$lib/assets/arcdpics/designapproach.png';
	import Figure from '$lib/components/Project/Figure.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('arcd');

	// Each card starts dealing a beat after the one before it.
	const dealDelay = [
		'group-hover:[transition-delay:0ms]',
		'group-hover:[transition-delay:140ms]',
		'group-hover:[transition-delay:70ms]',
		'group-hover:[transition-delay:35ms]'
	];

	const cards = [
		{ src: aceHearts, alt: 'Ace of hearts' },
		{ src: kingSpades, alt: 'King of spades' },
		{ src: queenDiamonds, alt: 'Queen of diamonds' },
		{ src: jackClubs, alt: 'Jack of clubs' }
	];
</script>

<ProjectPage {project}>
	{#snippet backdrop()}
		<img
			src={origins}
			alt=""
			class="absolute -right-[25vw] top-0 w-[110vw] max-w-none opacity-40 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:-right-[6vw] md:w-[50vw] md:max-w-[880px] md:opacity-90"
		/>
	{/snippet}

	{#snippet hero()}
		<!-- Stacked like a hand of cards; hovering the stack deals them out with a small gap. -->
		<div class="group -mb-6 flex w-fit md:-mb-12">
			{#each cards as card, i}
				<GlassEffect
					twclass="w-32 shrink-0 -ml-16 first:ml-0 transition-[margin] duration-[450ms] ease-[cubic-bezier(0.3,1.25,0.5,1)] group-hover:ml-3 group-hover:first:ml-0 motion-reduce:transition-none md:w-44 md:-ml-[5.5rem] {dealDelay[
						i
					]}"
				>
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
		title="Origins"
		text={[
			"arcd began in 2021, inspired by my family's love for card games, a tradition that has always been part of our gatherings.",
			'I wanted a deck that worked in play and also held up as modern design, with an emphasis on harmony and symmetry.'
		]}
	/>

	<ProjectSection
		title="Approach"
		text={[
			'After several iterations, I finalized four suit symbols, each constructed using only rectangles and circular arcs so they read as one system.'
		]}
	>
		{#snippet aside()}
			<div class="flex flex-col gap-4 md:mt-12 md:flex-row md:items-start md:gap-12">
				<div class="w-56 md:w-60">
					<Figure
						bare
						src={symbolsRed}
						alt="The diamond and heart symbols, each in its gradient and solid variants"
					/>
				</div>
				<div class="w-56 md:w-60">
					<Figure
						bare
						src={symbolsBlue}
						alt="The spade and club symbols, each in its gradient and solid variants"
					/>
				</div>
			</div>
		{/snippet}
	</ProjectSection>

	<ProjectSection
		title="Key decisions"
		text={[
			'Every symbol has an inner and outer stroke with opposing color gradients, plus a solid variant that stays legible at the small size of the card corners.',
			'Pairing vibrant color with simple shapes keeps the deck expressive, while drawing from both traditional card motifs and contemporary design.'
		]}
	>
		<Figure mat src={dap} alt="Color and geometry studies for the deck" />
	</ProjectSection>

	<ProjectSection
		title="Outcome"
		text={['The full deck lives in Figma: every suit, court card, and color token.']}
	>
		<iframe
			title="arcd Figma file"
			class="aspect-video w-full rounded-lg border border-line"
			src="https://embed.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master?node-id=0-1&embed-host=share"
			allowfullscreen
		></iframe>
	</ProjectSection>
</ProjectPage>
