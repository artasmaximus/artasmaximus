<script lang="ts">
	import GradientText from '$lib/components/GradientText.svelte';
	import Section from '$lib/layout/Section.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { scale } from 'svelte/transition';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';

	let cards = [
		{
			title: 'mini motorways',
			description:
				'A recreation of the hit Apple Arcade game “mini motorways” built entirely in python using PyGame.',
			thumbnailName: 'minimotorways',
			color: '#494435',
			href: '/Projects/minimotorways'
		},
		{
			title: 'ARCD',
			description:
				'A personal exploration of modularity, consistency, and theming in design, manifested through a 52-card deck.',
			thumbnailName: 'arcd',
			color: '#6452FF',
			href: '/Projects/arcd'
		},
		{
			title: 'BoomFit',
			description:
				'A Figma prototype of a mobile app that intelligently converts lifestyle aspirations into concrete fitness goals.',
			thumbnailName: 'boomfit',
			color: '#2A546C',
			href: '/Projects/boomfit'
		},
		{
			title: 'Content Wrangling',
			description:
				'A case study on information architecture and design principles, realized through the creation of a microsite.',
			thumbnailName: 'cw'
		},
		{
			title: 'SpLaTeX',
			description:
				'A python-based web app that employs natural language processing to convert speech into LaTeX code.',
			thumbnailName: 'splatex',
			color: '#2288FF'
		}
	];
</script>

<div class="flex w-full flex-col items-center gap-24 pb-24 pt-12 md:gap-32 md:pt-0">
	<IntersectionOberserver>
		<div in:scale={{ duration: 500 }}>
			<GradientText text="Projects" twclass="text-4xl whitespace-nowrap" to="#9747FF"
			></GradientText>
		</div>
	</IntersectionOberserver>
	<div class="grid grid-cols-1 gap-x-[6vw] gap-y-[8vh] md:grid-cols-2">
		{#each cards as card}
			<ProjectCard {...card} />
		{/each}
	</div>
</div>
