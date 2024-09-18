<script lang="ts">
	import ProjectCard from '$lib/components/projectCard.svelte';

	let projects = [
		{
			title: 'arcd',
			description:
				'A personal exploration of modularity, consistency, and theming in design, manifested through a 52-card deck.',
			href: '/projects/arcd',
			imgSrc: 'project-arcd',
			imgAlt: 'Playing Cards'
		},
		{
			title: 'Boom Fit',
			description:
				'A Figma prototype of a mobile app that intelligently converts lifestyle aspirations into concrete fitness goals.',
			href: '/projects/BoomFit',
			imgSrc: 'project-boomfit',
			imgAlt: 'iPhone Mockup'
		},
		{
			title: 'SpLaTeX',
			description:
				'A python-based web app that employs natural language processing to convert speech into LaTeX code.',
			href: '/projects/splatex',
			imgSrc: 'project-splatex',
			imgAlt: 'Splatex-Logo'
		},
		{
			title: 'Content Wrangling',
			description:
				'A case study on information architecture and design principles, realized through the creation of a microsite.',
			href: '/projects/content-wrangling',
			imgSrc: 'project-cw',
			imgAlt: 'Wireframe'
		},
		{
			title: 'mini motorways',
			description:
				'A recreation of the hit Apple Arcade game “mini motorways” built entirely in python using PyGame.',
			href: '/projects/arcd',
			imgSrc: 'project-minimotorways',
			imgAlt: 'Splash Screen'
		}
	];
</script>

<div class="projects">
	{#each projects as project}
		<ProjectCard {...project} />
	{/each}
</div>

<style lang="scss">
	.projects {
		display: grid;
		grid: auto-flow / repeat(auto-fill, minmax(350px, 2fr));
		position: relative;
		height: fit-content;
		width: 100%;
		row-gap: 1fr;
		column-gap: 1fr;
		place-content: center;
		place-items: center;
		padding: 0px;
		margin: 0px;
	}
</style>
