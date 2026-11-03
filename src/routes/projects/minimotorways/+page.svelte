<script lang="ts">
	import rulesImg from '$lib/assets/minimotorways/rules.jpg';
	import Figure from '$lib/components/Project/Figure.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import RoadHero from '$lib/components/Project/RoadHero.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('minimotorways');
</script>

<RoadHero />

<ProjectPage {project}>
	<ProjectSection
		title="The brief"
		text={[
			'This recreation started as a term project for my intro to programming course, built entirely in Python and PyGame.',
			'Players connect colorful buildings with matching destinations, growing a road network that gets harder to manage as more buildings and traffic appear.'
		]}
	>
		<Figure mat src={rulesImg} alt="The rules screen of the Mini Motorways recreation" />
	</ProjectSection>

	<ProjectSection
		title="Approach"
		text={[
			'The core of the game is a custom A* pathfinding implementation that handles real-time route calculations for multiple vehicles.'
		]}
	/>

	<ProjectSection
		title="Key decisions"
		text={[
			'We built a modular event system to manage everything from user input to traffic flow, which kept gameplay responsive as the road network grew.'
		]}
	/>

	<ProjectSection title="Outcome" text={['A full session, from the first road to total gridlock.']}>
		<div class="aspect-video w-full overflow-hidden rounded-lg border border-line">
			<iframe
				title="Mini Motorways video"
				src="https://www.youtube.com/embed/GaAHKJQ6lcY?si=5lAKeFCLD4c0Rsce"
				class="h-full w-full"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>
	</ProjectSection>
</ProjectPage>
