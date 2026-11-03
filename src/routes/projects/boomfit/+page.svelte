<script lang="ts">
	import ProblemSpace from '$lib/assets/boomfit/ProblemSpace.png';
	import goalsFeature from '$lib/assets/boomfit/goalsFeature.jpg';
	import progressFeature from '$lib/assets/boomfit/progressfeature.jpg';
	import onboardingFeature from '$lib/assets/boomfit/onboardingFeature.jpg';
	import Figure from '$lib/components/Project/Figure.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('boomfit');
</script>

<ProjectPage {project}>
	{#snippet hero()}
		<Figure src={project.cover!} alt={project.coverAlt!} />
	{/snippet}

	<ProjectSection
		title="The problem"
		text={[
			'BoomFit was created during the 2022 CMU XHacks hackathon, a design and UX event centered on accessibility.',
			'As fitness enthusiasts, my friend Natalie and I saw a gap in the fitness app market for older users, and set out to make fitness more approachable for them.'
		]}
	>
		<Figure
			mat
			src={ProblemSpace}
			alt="Research notes mapping the gap in fitness apps for older users"
		/>
	</ProjectSection>

	<ProjectSection
		title="Approach"
		text={[
			"The app starts by learning each user's goals, available equipment, and desired timeline.",
			'From that, it builds a personalized workout regimen around what the user can do and the constraints they have.'
		]}
	>
		<Figure src={onboardingFeature} alt="BoomFit's personalization interface" />
	</ProjectSection>

	<ProjectSection
		title="Key decisions"
		text={[
			'We introduced Lifestyle Goals to make fitness more relatable and less intimidating.',
			'Instead of traditional fitness metrics, users pick practical goals like reducing stress or preparing for a ski trip, and the app plans workouts around them.'
		]}
	>
		<Figure src={goalsFeature} alt="BoomFit's lifestyle goals selection screen" />
	</ProjectSection>

	<ProjectSection
		title="Outcome"
		text={[
			'The result is a Figma prototype covering onboarding, goal setting, and workouts. Each exercise includes detailed information and modifications for different physical conditions.',
			'Progress tracking shows current achievements and estimates goal completion based on workout consistency.'
		]}
	>
		<Figure src={progressFeature} alt="BoomFit's exercise tracking interface" />
	</ProjectSection>
</ProjectPage>
