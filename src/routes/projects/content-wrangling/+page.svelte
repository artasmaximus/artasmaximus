<script lang="ts">
	import ProjectSection from '$lib/components/ui/ProjectSection.svelte';
	import { appDetail } from '$lib/stores/appDetail';

	import contentwrangling from '$lib/assets/cwpage/contentwrangling.jpg';
	import ProgressiveDisclosure from '$lib/assets/cwpage/ProgressiveDisclosure.jpg';
	import WireFrame from '$lib/assets/cwpage/WireFrame.jpg';
	import Heading from '$lib/components/ui/Heading.svelte';
	import Description from '$lib/components/ui/Description.svelte';

	import Viewable from '$lib/components/ui/Viewable.svelte';

	let cwSection = {
		title: 'Content Wrangling',
		description: [
			'In the first phase, we worked solely with whitespace to improve readability. The original text was simply a large, continuous string, which was challenging to understand.',
			'By making use of whitespace and text placement, we made the content more approachable, helping users to easily parse the information without visual or stylistic enhancements.'
		],
		imageSrc: contentwrangling
	};

	let pdSection = {
		title: 'Progressive Disclosure',
		description: [
			'The second phase involved organizing the text with additional visual aids, including font size and weight, to emphasize important details.',
			'The concept of progressive disclosure was used to ensure information was revealed in a structured, expected way for users. This phase focused on allowing users to scan and absorb content in a hierarchy that made the information intuitive and less overwhelming.'
		],
		imageSrc: ProgressiveDisclosure,
		layout: 'R' as 'L' | 'R'
	};

	let wfSection = {
		title: 'Wireframing',
		description: [
			'The third phase required creating a wireframe for a microsite. The purpose of the wireframe was to organize the information visually, imagining how users might interact with it in a digital format. The microsite included sections like:',
			'Talks: Displaying upcoming talks at the World Economic Forum, with a simple layout showing talk titles, times, and speaker names.',
			'About: Providing background information about the World Economic Forum.',
			'Register: A section for users to register for the event',
			'Contact: Allowing users to submit inquiries regarding the event.',
			'The wireframe prioritized clarity, easy navigation, and a layout that made information accessible at a glance.'
		],
		imageSrc: WireFrame
	};
</script>

<div class="container" style="width: {$appDetail.contentWidth}px">
	<div id="noImageSection">
		<Heading>Overview</Heading>
		<Description>
			Content Wrangling was a project completed in 2022 as part of my Human-Computer Interaction
			course. The goal of the project was to transform a large body of plain text, containing
			information about a World Economic Forum, into a more organized and digestible format. This
			exercise consisted of four major phases, each focusing on improving the presentation of
			information incrementally.
		</Description>
	</div>
	<ProjectSection {...cwSection} />
	<ProjectSection {...pdSection} />
	<ProjectSection {...wfSection} />
	<div id="microsite">
		<Heading>Microsite</Heading>
		<p>
			The final phase was developing an interactive prototype in Figma based on the wireframe. This
			prototype featured functional elements like clickable buttons, dropdowns for viewing more
			information, and components for better user interactions.
		</p>
		<p>
			The goal was to translate the wireframe into a working model that could simulate user
			experience and interactions. View the prototype below!
		</p>
	</div>
	<iframe
		style="border: 1px solid rgba(0, 0, 0, 0.1);"
		width="100%"
		height="500px"
		src="https://embed.figma.com/design/Yxa4PwEUUtq8NIgJi9hDe1/Content-Wrangling?node-id=26-2&embed-host=share"
		allowfullscreen
		title="Content Wrangling Microsite"
	></iframe>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 100px;
	}
	#noImageSection {
		width: 100%;
		text-align: start;
		padding-top: 64px;
	}
	#microsite {
		width: 100%;
		text-align: start;
	}
</style>
