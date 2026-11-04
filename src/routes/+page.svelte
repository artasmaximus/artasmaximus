<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Text from '$lib/components/Text.svelte';
	import ProjectIndex from '$lib/components/Project/ProjectIndex.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { RESUME_FILENAME, resumeUrl } from '$lib/nav';
</script>

<Seo
	description="Artas Alajbegu is a design engineer working across research, Figma, and production code."
/>

<Section>
	<div class="flex flex-col gap-24 md:gap-32">
		<Reveal>
			<header class="flex flex-col gap-8 pt-6 md:gap-10 md:pt-16">
				<div class="flex flex-col gap-6">
					<Heading size="display" twclass="font-semibold">artas alajbegu</Heading>
					<div class="flex-col">
						<Text tone="muted" twclass="max-w-prose text-lead">software + design</Text>
						<Text tone="muted" twclass="max-w-prose text-lead">math + cs @ carnegie mellon</Text>
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
				<ProjectIndex />
			</Reveal>
		</section>

		<Reveal>
			<section class="grid grid-cols-1 gap-10 border-t border-line pt-6 md:grid-cols-2">
				<div class="flex flex-col items-start gap-3 mt-12">
					<Text as="h2" twclass="text-heading">Artwork</Text>
					<div class="pt-2"><Button href="/artwork">View artwork</Button></div>
				</div>
				<div class="flex flex-col items-start gap-3 mt-12">
					<Text as="h2" twclass="text-heading">Resume</Text>

					<div class="pt-2">
						<Button href={resumeUrl} download={RESUME_FILENAME}>Download PDF</Button>
					</div>
				</div>
			</section>
		</Reveal>
	</div>
</Section>
