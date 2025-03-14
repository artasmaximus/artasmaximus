<script>
	import GradientText from '$lib/components/GradientText.svelte';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';
	import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { fade, scale } from 'svelte/transition';

	let projectsCard = {
		title: 'Projects',
		info: 'Design and coding adventures from university coursework to passion projects of my own.',
		buttonLabel: 'see my work',
		href: 'Projects',
		buttonColor: '#403154',
		textColor: '#9747FF'
	};

	let artworkCard = {
		title: 'Artwork',
		info: 'A collection of some of my favorite work over the years. Every piece was drawn in Procreate on iPad Pro.',
		buttonLabel: 'see my art',
		href: '/Artwork',
		buttonColor: '#1D5973',
		textColor: '#48C8FF'
	};
	let resumeCard = {
		title: 'Resume',
		info: 'See where I’ve been, what I’ve done, and the things I’ve learned along my journey.',
		buttonLabel: 'see my journey',
		href: '/Resume',
		buttonColor: '#7D2D68',
		textColor: '#FF48CE'
	};
</script>

<Section>
	<div
		class="flex h-2/3 w-full flex-col items-center justify-center gap-[8vw] md:my-[8vw] md:gap-24 xl:gap-36"
	>
		<IntersectionOberserver>
			<div in:scale={{ duration: 500 }}>
				<GradientText text="Check out my . . ." twclass="text-2xl md:text-4xl" />
			</div>
		</IntersectionOberserver>
		<div class="grid w-full max-w-7xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			<ShowcaseCard {...projectsCard} />
			<ShowcaseCard {...artworkCard} />
			<ShowcaseCard {...resumeCard} />
		</div>
	</div>
</Section>
