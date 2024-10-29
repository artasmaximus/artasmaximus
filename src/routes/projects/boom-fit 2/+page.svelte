<script lang="ts">
	import { appDetail } from '$lib/stores/appDetail';
	import ProjectSection from '$lib/components/ui/ProjectSection.svelte';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Description from '$lib/components/ui/Description.svelte';

	import problemSpace from '$lib/assets/boomfitpage/ProblemSpace.png';
	import Banner from '$lib/components/structure/Banner.svelte';

	let problemSection = {
		title: 'Problem Space',
		description: [
			'We began by identifying the demographic: older adults who may find conventional fitness programs unapproachable. The app’s primary goal was to create a pathway for users to incorporate fitness in a practical, accessible way that suits their capabilities and lifestyle.',
			'We considered the physical challenges, lifestyle routines, and common goals that older adults might have, such as reducing stress, carrying groceries, or improving mobility.'
		],
		imageSrc: problemSpace,
		layout: 'R' as 'L' | 'R'
	};
</script>

<Banner title="Boom Fit" />
<div class="container" style="width: {$appDetail.contentWidth}px">
	<div id="overview">
		<Heading>Overview</Heading>
		<Description>
			BoomFit is a mobile application prototype developed in 2022 by myself and my friend Natalie as
			part of the CMU XHacks hackathon.
		</Description>
		<Description>
			The hackathon theme was "Innovation for Accessibility," challenging participants to create
			tech solutions that ensure inclusivity.
		</Description>
		<Description>
			BoomFit was designed with accessibility in mind, focused on transforming lifestyle and fitness
			aspirations into actionable, bite-sized goals.
		</Description>
	</div>
	<ProjectSection {...problemSection} />
</div>

<!-- <iframe
	style="border: 1px solid rgba(0, 0, 0, 0.1);"
	width="800"
	height="450"
	src="https://embed.figma.com/design/LEhD8bTzn4ORXgb6ZDP11b/Hackathon!?node-id=17-1602&embed-host=share"
	allowfullscreen
></iframe> -->

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 64px;
	}
	#overview {
		width: 100%;
		text-align: start;
		padding-top: 64px;
	}
	iframe {
		width: 800px;
		height: 400px;
	}
</style>
