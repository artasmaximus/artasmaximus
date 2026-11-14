<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import Text from '$lib/components/Text.svelte';
	import SpectralDemo from '$lib/spectral/SpectralDemo.svelte';
	import type { Project } from '$lib/projects';
	import slime from '$lib/assets/thumbnails/slime.jpg';
	import aces from '$lib/assets/arcdpics/render-aces.webp';
	import drawing from '$lib/assets/artwork/drawing1.jpeg';
	import spectralCover from '$lib/assets/thumbnails/spectral.png';

	// Set aside (gitignored) until the shader is made, so the project lives here
	// rather than in the shared list, and still opens locally by URL.
	const project: Project = {
		slug: 'spectral',
		name: 'Spectral',
		blurb: 'Minecraft, styled in the frequency domain.',
		summary:
			'A Minecraft shader pack that restyles the game by choosing which frequencies to keep, using Gaussian band splits, a JPEG-style cosine transform, and a Fourier-series ripple.',
		year: '2026',
		role: 'Developer',
		stack: 'Iris · GLSL · WebGL2',
		context: 'Personal project',
		cover: spectralCover,
		coverAlt: 'The 64 cosine patterns of an 8 by 8 DCT, in orange and blue on black',
		coverTone: 'dark'
	};

	const images = [
		{ src: drawing, label: 'Drawing' },
		{ src: aces, label: 'Cards' },
		{ src: slime, label: 'Slime' }
	];
</script>

<ProjectPage {project} showStack>
	<SpectralDemo {images} start={2} />

	<ProjectSection
		title="Origins"
		text={[
			'Any image can be written as a sum of waves: broad, slow ones for light and color, and tight, fast ones for edges and texture.',
			'Instead of adding effects on top of Minecraft, I wanted to style it by deciding which of those waves to keep, boost, or throw away.'
		]}
	/>

	<ProjectSection
		title="Band split"
		text={[
			'A Gaussian blur is a low-pass filter, since its Fourier transform is another Gaussian. Two blur passes give the low band, and subtracting it from the frame leaves the high band.',
			'The low band is eased toward a few levels of brightness, keeping its hue, and graded with cool shadows and warm highlights. The detail goes back on top, clamped so it can never glow around an edge, and darkened only on the shadow side of each edge, so it reads like ink over paint.'
		]}
	/>

	<ProjectSection
		title="Cosine compression"
		text={[
			'This pass runs the same 8 by 8 discrete cosine transform as JPEG. In the forward pass each pixel computes one coefficient of its block, so a block takes 64 reads per pixel rather than 4,096.',
			'The inverse pass rebuilds every block from only its lowest frequencies, after quantizing higher frequencies more coarsely. Keeping one frequency gives flat tiles; keeping three or four turns the world into soft, compressed gradients.'
		]}
	/>

	<ProjectSection
		title="Fourier ripple"
		text={[
			'The last pass pushes pixels outward in rings. The ring profile is a truncated Fourier series of a sawtooth, the sum of sin(nx)/n, so each added term sharpens the wavefront.',
			'Red, green, and blue are displaced by slightly different amounts, which splits each ring into a spectral fringe. The center stays still so the crosshair is never disturbed.'
		]}
	/>

	<ProjectSection
		title="In game"
		text={[
			'In the game, the pack also replaces vanilla lighting. Sunlight warms toward gold near sunrise and sunset, moonlight is blue, and torches are orange, and in dim light colors lose saturation and drift blue, the way eyes do. A filmic tone curve then maps the result to the screen.',
			'The post-processing runs on Iris as up to five composite passes and a final pass, with the same math as the demo above. The pack ships with four profiles:',
			[
				'Cinematic: lighting with a light band split. This is the default.',
				'Painterly: a stronger band split with ink.',
				'Compressed: cosine compression with two frequencies kept.',
				'Spectral: all three passes together.'
			],
			'To install it, put the zip in your shaderpacks folder and select it under Video Settings, then Shader Packs.'
		]}
	>
		<div class="flex flex-wrap items-center gap-4">
			<Button href="/spectral/Spectral.zip" download="Spectral.zip">Download the pack</Button>
			<Text tone="subtle" twclass="text-small">For Iris on Minecraft 26.2.</Text>
		</div>
	</ProjectSection>
</ProjectPage>
