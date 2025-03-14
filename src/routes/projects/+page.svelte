<script lang="ts">
	import ProjectCard from '$lib/components/ui/projectCard.svelte';
	import arcdImg from '$lib/assets/project-arcd.jpg';
	import boomFitImg from '$lib/assets/project-boomfit.jpg';
	import splatexImg from '$lib/assets/project-splatex.jpg';
	import cwImg from '$lib/assets/project-cw.jpg';
	import miniMotorwaysImg from '$lib/assets/project-minimotorways.jpg';
	import { appDetail } from '$lib/stores/appDetail';

	let projects = [
		{
			title: 'arcd',
			description:
				'A personal exploration of modularity, consistency, and theming in design, manifested through a 52-card deck.',
			href: '/projects/arcd',
			imgSrc: arcdImg,
			imgAlt: 'Playing Cards'
		},
		{
			title: 'Boom Fit',
			description:
				'A Figma prototype of a mobile app that intelligently converts lifestyle aspirations into concrete fitness goals.',
			href: '/projects/boom-fit',
			imgSrc: boomFitImg,
			imgAlt: 'iPhone Mockup'
		},
		{
			title: 'SpLaTeX',
			description:
				'A python-based web app that employs natural language processing to convert speech into LaTeX code.',
			href: '/projects/splatex',
			imgSrc: splatexImg,
			imgAlt: 'Splatex-Logo'
		},
		{
			title: 'Content Wrangling',
			description:
				'A case study on information architecture and design principles, realized through the creation of a microsite.',
			href: '/projects/content-wrangling',
			imgSrc: cwImg,
			imgAlt: 'Wireframe'
		},
		{
			title: 'mini motorways',
			description:
				'A recreation of the hit Apple Arcade game “mini motorways” built entirely in python using PyGame.',
			href: '/projects/mini-motorways',
			imgSrc: miniMotorwaysImg,
			imgAlt: 'Splash Screen'
		}
	];
</script>

<div class="wrapper" style="width: {$appDetail.contentWidth}px">
	<div class="hero">
		<h1>Creative Technology</h1>
		<p>
			From ideating, to designing, prototyping, and developing, these projects reflect my passion
			for building interactive, useable experiences.
		</p>
	</div>
	<div class="projects">
		{#each projects as project}
			<ProjectCard {...project} />
		{/each}
	</div>
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-items: space-around;
	}
	p {
		max-width: 500px;
	}

	.hero {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		gap: 25px;
		padding: 120px 0px;
		text-align: center;
		h1 {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 42px;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			letter-spacing: -2px;
		}

		p {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 24px;
			font-style: normal;
			font-weight: 300;
			line-height: normal;
			letter-spacing: -0.24px;
			width: 80%;
			margin: 0;
		}
	}
	.projects {
		display: grid;
		grid: 'a a' auto;
		position: relative;
		width: 100%;
		row-gap: 100px;
		column-gap: 200px;
		place-content: center;
		place-items: center;

		z-index: inherit;

		@media screen and (max-width: 966px) {
			grid: 'a' auto;
			column-gap: 50px;
		}
	}
</style>
