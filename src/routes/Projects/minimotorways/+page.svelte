<script lang="ts">
	import rulesImg from '$lib/assets/minimotorways/rules.jpg';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import RoadHero from '$lib/components/Project/RoadHero.svelte';
	import { themes } from '$lib/components/Project/theme';

	const theme = themes.minimotorways;
</script>

<RoadHero />

<ProjectPage
	{theme}
	meta={['University term project', 'Python · PyGame']}
	links={[{ label: 'Watch it run', href: 'https://www.youtube.com/watch?v=GaAHKJQ6lcY' }]}
	summary="A recreation of the hit Apple Arcade game, built from scratch in Python — pathfinding, traffic simulation, and all."
>
	<ProjectSection
		index={1}
		title="Origins"
		accent={theme.accent}
		text={[
			'My Mini Motorways recreation started as a term project in my first year of college as part of my intro to programming course.',
			'Armed with Python and PyGame, I dove into the complex world of pathfinding algorithms and traffic simulation.'
		]}
	/>

	<ProjectSection
		index={2}
		title="Technical architecture"
		accent={theme.accent}
		text={[
			'The core of the game revolves around a custom A* pathfinding implementation, handling real-time route calculations for multiple vehicles.',
			'We developed a modular event system that manages everything from user input to traffic flow optimization, creating a responsive and dynamic gameplay experience.'
		]}
	/>

	<ProjectSection
		index={3}
		title="Gameplay"
		accent={theme.accent}
		imageSide="left"
		src={rulesImg}
		alt="The rules screen of the Mini Motorways recreation"
		text={[
			'Players must strategically connect colorful buildings with matching destinations, creating an efficient road network that grows increasingly complex.',
			'The challenge intensifies as more buildings appear and traffic increases, requiring careful planning and quick thinking to prevent gridlock.'
		]}
	/>

	<ProjectSection
		index={4}
		title="See it in action"
		accent={theme.accent}
		text={['A full session, from the first road to total gridlock.']}
	>
		<div class="aspect-video w-full overflow-clip rounded-xl border border-stone-900/10 shadow-sm">
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
