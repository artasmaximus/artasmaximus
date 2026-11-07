<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import NameTrace from '$lib/components/NameTrace.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Text from '$lib/components/Text.svelte';
	import ProjectIndex from '$lib/components/Project/ProjectIndex.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { RESUME_FILENAME, resumeUrl } from '$lib/nav';
	import AtSign from '$lib/icons/AtSign.svelte';
	import { featuredProjects } from '$lib/projects';

	// One small photo above the name. Drop a file named me.jpg (or .png, .webp) into
	// src/lib/assets/about/ and it appears; with none there, the header simply starts at the name.
	const photos = import.meta.glob('/src/lib/assets/about/me.{jpg,jpeg,png,webp}', {
		eager: true,
		import: 'default'
	});
	const photo = Object.values(photos)[0] as string | undefined;
</script>

<Seo
	description="Artas Alajbegu is a design engineer working across research, Figma, and production code."
/>

<Section>
	<div class="flex flex-col gap-24 md:gap-32">
		<Reveal>
			<header class="flex flex-col gap-8 pt-6 md:gap-10 md:pt-16">
				{#if photo}
					<img
						src={photo}
						alt="Artas Alajbegu"
						class="size-20 rounded-full object-cover md:size-24"
					/>
				{/if}
				<div class="flex flex-col gap-6">
					<Heading size="display" twclass="font-semibold">
						<span class="sr-only">artas alajbegu</span>
						<NameTrace />
					</Heading>
					<div class="flex-col">
						<Text tone="muted" twclass="max-w-prose text-lead">software + design</Text>
						<Text tone="muted" twclass="max-w-prose text-lead">math + cs <AtSign
							height="0.95em"
							fill="currentColor"
							style="display: inline-block; vertical-align: -0.14em; margin-inline: 0.05em"
						/> carnegie mellon</Text
					>
					</div>
				</div>
				<Text tone="muted" twclass="max-w-prose text-body">
					feel free to explore what I've designed, prototyped, built, and more . . .
				</Text>
			</header>
		</Reveal>

		<section aria-label="Selected work" class="flex flex-col gap-8">
			<Reveal>
				<div class="flex items-end justify-between gap-6">
					<Text as="h2" twclass="text-heading">Selected work</Text>
					<Button href="/projects">All projects</Button>
				</div>
			</Reveal>
			<Reveal>
				<ProjectIndex items={featuredProjects} />
			</Reveal>
		</section>

		<ProjectSection
			title="About"
			text={[
				"I put my heart into everything I make, especially when the work means something to me. I love art, visual design, and experiences that feel satisfying to use.",
				"I'm obsessive about the details and getting things just right: interfaces that are easy to use, on top of software that's robust and efficient under the hood.",
				"Away from the screen I climb, hike now and then, and spend as much time at the beach as I can. I draw constantly, listen to a lot of music, and play a little piano."
			]}
		/>

		<Reveal>
			<section class="grid grid-cols-1 border-t border-line py-10 md:grid-cols-2 md:py-12">
				<div class="flex items-center justify-between gap-6 py-4 md:pr-8">
					<Text as="h2" twclass="text-heading">Artwork</Text>
					<Button href="/artwork">View</Button>
				</div>
				<div
					class="flex items-center justify-between gap-6 border-t border-line py-4 md:border-l md:border-t-0 md:pl-8"
				>
					<Text as="h2" twclass="text-heading">Resume</Text>
					<Button href={resumeUrl} download={RESUME_FILENAME}>Download</Button>
				</div>
			</section>
		</Reveal>
	</div>
</Section>
