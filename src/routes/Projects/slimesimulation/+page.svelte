<script lang="ts">
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import ScrollVideo from '$lib/components/Project/ScrollVideo.svelte';
	import { themes } from '$lib/components/Project/theme';

	const theme = themes.slimesimulation;
</script>

<ProjectPage
	{theme}
	meta={['Personal project', 'Unity · compute shaders']}
	summary="Thousands of agents, three rules each, zero blueprints — a Physarum simulation where structure emerges from nothing but local behavior."
>
	<ProjectSection
		index={1}
		title="Three rules"
		accent={theme.accent}
		text={[
			'Each agent does exactly three things: move forward, deposit a chemical trail, and steer toward the strongest nearby trail. That is the entire specification.',
			'From those three local rules, the simulation produces global structures — branching networks, spiral arms, and dense colonies — that no single agent is aware of.'
		]}
	/>

	<ProjectSection
		index={2}
		title="Emergence"
		accent={theme.accent}
		text={[
			'The structure is never drawn. It is a side effect of thousands of agents following simple local rules — the same phenomenon behind slime mold, ant trails, and vascular networks.',
			'Adjusting the sensor angle, deposit rate, or decay speed shifts the entire character of the system: sparse exploratory tendrils at low deposit rates, dense territorial masses at high ones.'
		]}
	/>

	<ProjectSection
		index={3}
		title="See it in action"
		accent={theme.accent}
		text={[
			'Scrub through a run of the simulation — sparse exploratory tendrils giving way to dense, branching colonies as the trail map fills in.'
		]}
	>
		<ScrollVideo accent={theme.accent} />
	</ProjectSection>
</ProjectPage>
