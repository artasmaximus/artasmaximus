<script lang="ts">
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import { getProject } from '$lib/projects';

	// Draft: unlisted until footage exists. Then add an Outcome section with
	// <ScrollVideo src={footage} />, add a cover, and remove `draft` in projects.ts.
	const project = getProject('slimesimulation');
</script>

<ProjectPage {project}>
	<ProjectSection
		title="The brief"
		text={[
			'Each agent does exactly three things: move forward, deposit a chemical trail, and steer toward the strongest nearby trail. That is the entire specification.',
			'From those local rules, the simulation produces global structures that no single agent is aware of: branching networks, spiral arms, and dense colonies.'
		]}
	/>

	<ProjectSection
		title="Approach"
		text={[
			'The structure is never drawn. It is a side effect of thousands of agents following simple rules, the same phenomenon behind slime mold, ant trails, and vascular networks.'
		]}
	/>

	<ProjectSection
		title="Key decisions"
		text={[
			'Adjusting the sensor angle, deposit rate, or decay speed shifts the character of the whole system, from sparse exploratory tendrils at low deposit rates to dense territorial masses at high ones.'
		]}
	/>
</ProjectPage>
