<script lang="ts">
	import ProblemSpace from '$lib/assets/boomfit/ProblemSpace.png';
	import goalsFeature from '$lib/assets/boomfit/goalsFeature.jpg';
	import progressFeature from '$lib/assets/boomfit/progressfeature.jpg';
	import onboardingFeature from '$lib/assets/boomfit/onboardingFeature.jpg';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import { themes } from '$lib/components/Project/theme';

	const theme = themes.boomfit;
</script>

<ProjectPage
	{theme}
	meta={['2022', 'CMU XHacks hackathon', 'Figma · UX']}
	summary="A fitness app prototype that turns lifestyle aspirations — less stress, an upcoming ski trip — into concrete, achievable workout plans for older users."
>
	<ProjectSection
		index={1}
		title="The problem space"
		accent={theme.accent}
		imageSide="right"
		frame={false}
		src={ProblemSpace}
		alt="Research notes mapping the gap in fitness apps for older users"
		text={[
			'BoomFit was created during the CMU XHacks hackathon in 2022, a design/UX focused event centered around accessibility.',
			'As fitness enthusiasts, my friend Natalie and I identified a gap in the fitness app market for older users, leading us to create a prototype that makes fitness more approachable and accessible for this demographic.'
		]}
	/>

	<ProjectSection
		index={2}
		title="Smart personalization"
		accent={theme.accent}
		imageSide="left"
		src={onboardingFeature}
		alt="BoomFit's personalization interface"
		text={[
			"The app begins by learning about each user's goals, available equipment, and desired timeline for achievement.",
			"Based on this information, it creates a personalized workout regiment that perfectly aligns with the user's capabilities and constraints."
		]}
	/>

	<ProjectSection
		index={3}
		title="Lifestyle-first goals"
		accent={theme.accent}
		src={goalsFeature}
		alt="BoomFit's lifestyle goals selection screen"
		text={[
			'We introduced "Lifestyle Goals" as an innovative way to make fitness more relatable and less intimidating.',
			'Instead of traditional fitness metrics, users can select practical goals like "Reducing Stress" or "Preparing for a ski trip," and the app designs workout plans specifically tailored to these real-life objectives.'
		]}
	/>

	<ProjectSection
		index={4}
		title="Support and progress"
		accent={theme.accent}
		imageSide="left"
		src={progressFeature}
		alt="BoomFit's exercise tracking interface"
		text={[
			'Each exercise comes with detailed information and modifications to accommodate various physical conditions.',
			'The progress tracking feature not only shows current achievements but also provides motivating estimates of goal completion based on workout consistency.'
		]}
	/>
</ProjectPage>
