<script lang="ts">
	import ProjectSection from '$lib/components/ui/ProjectSection.svelte';
	import { appDetail } from '$lib/stores/appDetail';

	// import images origins.png and arcdbg.png from lib/assets/arcdPage
	import origins from '$lib/assets/arcdPage/origins.png';
	import acecomparison from '$lib/assets/arcdPage/acecomparison.png';
	import SymbolsReflection from '$lib/assets/arcdPage/SymbolsReflection.png';
	import Banner from '$lib/components/structure/Banner.svelte';
	import faceCards from '$lib/assets/arcdPage/FaceCards.png';
	import jokers from '$lib/assets/arcdPage/Jokers.png';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Description from '$lib/components/ui/Description.svelte';

	let originSection = {
		title: 'Origins',
		description: [
			'arcd began over four years ago, inspired by my family’s deep-rooted love for card games, a tradition that has always been a significant part of our gatherings. I aimed to create a deck that not only served its function in gameplay but also embodied the principles of modern design, with an emphasis on harmony and symmetry.'
		],
		imageSrc: origins
	};

	let designApproachSection = {
		title: 'Design Approach',
		description: [
			'arcd reimagines traditional playing cards through a modern lens, emphasizing geometric symmetry and vibrant gradients. Each suit is designed to visually occupy the space of a predefined bounding box, ensuring visual consistency while preserving the unique character of each symbol.',
			'The relationship between vibrant colors and simple shapes creates a refined, expressive aesthetic, drawing from both traditional card motifs and contemporary design principles.',
			'This balance between familiarity and innovation results in a deck that is as functional as it is visually striking.'
		],
		imageSrc: acecomparison,
		layout: 'R' as 'L' | 'R'
	};

	let symbolDesignSection = {
		title: 'Symbol Design',
		description: [
			'After several iterations, I finalized the design for the four suit symbols, each constructed using only rectangles and circular arcs to create a cohesive structure. This design choice led to the project’s name, “arcd”',
			'Every symbol features an inner and outer stroke with opposing color gradients, as well as a solid-colored variant to be used for the labels located on the card corners.'
		],
		imageSrc: SymbolsReflection,
		layout: 'L' as 'L' | 'R'
	};

	let faceCardsSection = {
		title: 'Face Cards',
		description: [
			'The face cards needed to stand out while maintaining consistency with the deck’s overall design.',
			'Where traditional card decks have rotationally symmetric face cards, I designed face cards that are both vertically and horizontally symmetric. The figures are constructed with strokes similar in width to the suit symbols, contributing to a cohesive visual identity.'
		],
		imageSrc: faceCards,
		layout: 'R' as 'L' | 'R'
	};

	let jokerSection = {
		title: 'Jokers',
		description: [
			'The Joker card distinguishes itself with a compact and streamlined design, making it smaller and shorter than the other face cards.',
			'Its unique design exudes a distinct energy, inviting intrigue. A headpiece gracefully floats above the figure, accentuating the Joker’s special status within the deck.',
			'Additionally, I designed an abstract symbol to represent the Joker, moving away from the conventional use of the word “Joker" to label this card'
		],
		imageSrc: jokers,
		layout: 'L' as 'L' | 'R'
	};
</script>

<div class="container">
	<!-- <div class="background">
		<img src={arcdbg} alt="ArcDBG" />
	</div> -->
	<Banner title="arcd" />
	<ProjectSection {...originSection} />
	<ProjectSection {...designApproachSection} />
	<ProjectSection {...symbolDesignSection} />
	<ProjectSection {...faceCardsSection} />
	<ProjectSection {...jokerSection} />
	<div class="exhibit" style="width: {$appDetail.contentWidth}px">
		<div class="header" id="closing">
			<Heading>See Where it All Began</Heading>
			<Description>Explore the original Figma file that started it all.</Description>
		</div>
		<iframe
			style="border: 1px solid rgba(0, 0, 0, 0.1);"
			width="100%"
			height="500px"
			src="https://embed.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master?node-id=0-1&embed-host=share"
			allowfullscreen
			title="arcd Figma"
		></iframe>
	</div>
</div>

<style lang="scss">
	#closing {
		text-align: center;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 64px;
	}

	.exhibit {
		// horizontally center
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 64px 0px;
		gap: 64px;
	}
</style>
