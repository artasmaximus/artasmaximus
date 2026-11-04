<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Text from '$lib/components/Text.svelte';
	import ProjectList from '$lib/components/Project/ProjectList.svelte';
	import Section from '$lib/layout/Section.svelte';
	import { RESUME_FILENAME, resumeUrl } from '$lib/nav';
</script>

<Seo
	description="Artas Alajbegu is a design engineer working across research, Figma, and production code."
/>

<Section>
	<div class="flex flex-col gap-24 md:gap-32">
		<Reveal>
			<header class="flex flex-col gap-6 pt-6 md:gap-8 md:pt-16">
				<Heading size="display" twclass="font-semibold">artas alajbegu</Heading>
				<div class="flex-col">
					<Text tone="muted" twclass="max-w-prose text-lead">software + design</Text>
					<Text tone="muted" twclass="max-w-prose text-lead">math + cs @ carnegie mellon</Text>
				</div>
			</header>
		</Reveal>

		<section aria-labelledby="work">
			<h2 id="work" class="sr-only">Selected work</h2>
			<ProjectList />
		</section>

		<Reveal>
			<section class="grid grid-cols-1 gap-10 border-t border-line pt-6 md:grid-cols-2">
				<div class="flex flex-col items-start gap-3">
					<Text as="h2" twclass="text-heading">Artwork</Text>
					<Text tone="muted" twclass="max-w-prose text-body">
						Drawings from over the years, each made in Procreate on iPad Pro.
					</Text>
					<div class="pt-2"><Button href="/artwork">View artwork</Button></div>
				</div>
				<div class="flex flex-col items-start gap-3">
					<Text as="h2" twclass="text-heading">Resume</Text>
					<Text tone="muted" twclass="max-w-prose text-body">
						Experience, education, and skills on one page.
					</Text>
					<div class="pt-2">
						<Button href={resumeUrl} download={RESUME_FILENAME}>Download PDF</Button>
					</div>
				</div>
			</section>
		</Reveal>
	</div>
</Section>
