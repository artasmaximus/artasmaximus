<script lang="ts">
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import HoverFrames from '$lib/components/Project/HoverFrames.svelte';
	import ScrollFrames from '$lib/components/Project/ScrollFrames.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('slimesimulation');

	// Each clip lives in static/slime-gallery/<folder>/frame_0001.webp and up.
	const clip = (folder: string, count: number, alt: string) => ({
		count,
		alt,
		frame: (index: number) =>
			`/slime-gallery/${folder}/frame_${String(index + 1).padStart(4, '0')}.webp`
	});
	const clips = [
		clip('clip-02', 60, 'A ring of light expanding outward as a disc of agents grows into a radiating bloom'),
		clip('clip-04', 60, 'A pink radial bloom breaking apart into purple and gold tendrils'),
		clip('clip-03', 61, 'Glowing teal and gold ribbons folding and drifting across a deep blue field'),
		clip('clip-01', 41, 'Agents settling from a noisy field into a glowing, branching network'),
		clip('clip-05', 61, 'Cyan filaments winding through a rust-orange field, gold specks settling in'),
		clip('clip-06', 60, 'Yellow-green rings blooming and merging between winding blue filaments')
	];

	// Keeps the numbering of the original 240-frame render, of which every second frame shipped.
	const frame = (index: number) =>
		`/slime-frames/frame_${String(index * 2 + 1).padStart(4, '0')}.webp`;
</script>

<ProjectPage {project} dark showStack>
	<ScrollFrames
		{frame}
		darkAbove
		count={120}
		width={1920}
		height={1080}
		alt="A solid disc of agents breaking apart into a glowing, branching network"
		overlays={[
			{
				text: 'Three simple, local rules.',
				from: 0.06,
				to: 0.31
			},
			{
				text: 'Four species. No two alike.',
				from: 0.36,
				to: 0.61
			},
			{
				text: 'Millions of agents. All at once.',
				from: 0.66,
				to: 0.91
			}
		]}
	/>

	<ProjectSection
		title="Origins"
		text={[
			"Emergence has always fascinated me: how local behavior, repeated at scale, produces intricate structures.",
			'This project started as a way to watch that happen.'
		]}
	/>

	<ProjectSection
		title="Approach"
		text={[
			'There are four agent species. Each moves at its own speed and senses the world through its own sensor angle and distance. Every species leaves its trail in its own channel of a shared map, and each has an affinity for the others: a positive one draws it toward their trails, a negative one pushes it away.',
			'Together, these four agent types form something akin to an ecosystem.'
		]}
	/>

	<ProjectSection
		title="Key decisions"
		text={[
			'Adjusting the sensor angle, deposit rate, or decay speed shifts the character of the whole system, from sparse exploratory tendrils at low deposit rates to dense territorial masses at high ones.',
			'Hostile trails can kill an agent, and agents in dense territory can spawn new ones, so populations rise and fall on their own.',
		'I turned the species relationships into presets like rock-paper-scissors and predator-prey, and added a mutation engine that can push them toward goals such as competing, cooperating, or staying right at the edge where behavior flips.'
		]}
	/>

	<ProjectSection
		title="GPU Accelerated"
		text={[
			'The whole simulation is one compute shader with four kernels. One GPU thread per agent samples the trail map ahead of itself, steers, moves, and deposits. Two blur passes diffuse and fade the trails, and a last pass turns them into the image. By default that is a million agents on a 2560 x 1440 map, with room for two million.',
			'Getting there meant thinking in parallel: packing each agent into 16 bytes, splitting the blur into horizontal and vertical passes, generating randomness with a hash on the GPU, and counting populations with atomic adds so thousands of threads can write to one counter safely.',
			'My biggest takeaway was learning to write code that thousands of threads run at once, and how to structure data for it.'
		]}
	/>

	<ProjectSection title="Gallery">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each clips as clip}
				<HoverFrames
					frame={clip.frame}
					count={clip.count}
					width={800}
					height={450}
					alt={clip.alt}
				/>
			{/each}
		</div>
	</ProjectSection>
</ProjectPage>
