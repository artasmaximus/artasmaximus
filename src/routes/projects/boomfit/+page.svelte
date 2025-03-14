<script lang="ts">
	import GradientText from '$lib/components/GradientText.svelte';
	import ProblemSpace from '$lib/assets/boomfit/ProblemSpace.png';
	import goalsFeature from '$lib/assets/boomfit/goalsFeature.jpg';
	import progressFeature from '$lib/assets/boomfit/progressfeature.jpg';
	import onboardingFeature from '$lib/assets/boomfit/onboardingFeature.jpg';

	interface SectionDescription {
		title: string;
		text: string[];
		src?: string;
		alt?: string;
	}

	let sections = $state([
		{
			title: 'Smart Personalization',
			text: [
				"The app begins by learning about each user's goals, available equipment, and desired timeline for achievement.",
				"Based on this information, it creates a personalized workout regiment that perfectly aligns with the user's capabilities and constraints."
			],
			src: onboardingFeature,
			alt: "BoomFit's personalization interface"
		},
		{
			title: 'Lifestyle-First Approach',
			text: [
				'We introduced "Lifestyle Goals" as an innovative way to make fitness more relatable and less intimidating.',
				'Instead of traditional fitness metrics, users can select practical goals like "Reducing Stress" or "Preparing for a ski trip," and the app designs workout plans specifically tailored to these real-life objectives.'
			],
			src: goalsFeature,
			alt: "BoomFit's lifestyle goals selection screen"
		},
		{
			title: 'Comprehensive Exercise Support',
			text: [
				'Each exercise comes with detailed information and modifications to accommodate various physical conditions.',
				'The progress tracking feature not only shows current achievements but also provides motivating estimates of goal completion based on workout consistency.'
			],
			src: progressFeature,
			alt: "BoomFit's exercise tracking interface"
		}
	]);

	let about = $state({
		title: 'About',
		text: [
			'BoomFit was created during the CMU XHacks hackathon in 2022, a design/UX focused event centered around accessibility.',
			'As fitness enthusiasts, my friend Natalie and I identified a gap in the fitness app market for older users, leading us to create a prototype that makes fitness more approachable and accessible for this demographic.'
		],
		src: ProblemSpace,
		alt: "BoomFit's problem space visualization"
	});
</script>

{#snippet title(text: string)}
	<h2 class="text-xl font-bold text-stone-800 md:text-3xl lg:text-4xl">{text}</h2>
{/snippet}

{#snippet info(section: SectionDescription)}
	<div class="flex flex-col gap-6">
		{@render title(section.title)}
		<div class="flex flex-col gap-4">
			{#each section.text as paragraph}
				<p class="text-pretty text-lg leading-relaxed text-stone-600 md:text-xl">{paragraph}</p>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet section(section: SectionDescription)}
	<div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
		{#if section.src}
			<div class="flex items-center justify-center">
				<img
					class="w-full max-w-2xl rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
					src={section.src}
					alt={section.alt ?? ''}
					loading="lazy"
				/>
			</div>
		{/if}
		<div class="flex items-center">
			{@render info(section)}
		</div>
	</div>
{/snippet}

<main class="flex w-full flex-col items-center gap-16 bg-stone-50 py-16">
	<div class="container px-6 md:px-8">
		<header class="mb-16 flex flex-col items-center gap-8">
			<GradientText
				text="BoomFit"
				twclass="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
				from="#FF6B6B"
				to="#4ECDC4"
			/>
			{@render section(about)}
		</header>

		<div class="flex flex-col gap-24">
			{#each sections as sec}
				{@render section(sec)}
			{/each}
		</div>
	</div>
</main>
