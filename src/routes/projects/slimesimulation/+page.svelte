<script lang="ts">
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import ScrollFrames from '$lib/components/Project/ScrollFrames.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('slimesimulation');

	// Keeps the numbering of the original 240-frame render, of which every second frame shipped.
	const frame = (index: number) =>
		`/slime-frames/frame_${String(index * 2 + 1).padStart(4, '0')}.webp`;
</script>

<ProjectPage {project} dark>
	<ScrollFrames
		{frame}
		darkAbove
		count={120}
		width={1920}
		height={1080}
		alt="A solid disc of agents breaking apart into a glowing, branching network"
	/>

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
