<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
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
				<Heading size="display">I design interfaces and build them.</Heading>
				<p class="max-w-prose text-lead text-ink-muted">
					I'm Artas Alajbegu, a design engineer working across research, Figma, and production code.
					I studied math and computer science at Carnegie Mellon, and I like turning complex systems
					into clear, interactive tools.
				</p>
			</header>
		</Reveal>

		<section aria-labelledby="work" class="flex flex-col gap-8">
			<h2 id="work" class="border-t border-line pt-6 text-label text-ink-subtle">Selected work</h2>
			<ProjectList />
		</section>

		<Reveal>
			<section class="grid grid-cols-1 gap-10 border-t border-line pt-6 md:grid-cols-2">
				<div class="flex flex-col items-start gap-3">
					<h2 class="text-heading text-ink">Artwork</h2>
					<p class="max-w-prose text-body text-ink-muted">
						Drawings from over the years, each made in Procreate on iPad Pro.
					</p>
					<div class="pt-2"><Button href="/artwork">View artwork</Button></div>
				</div>
				<div class="flex flex-col items-start gap-3">
					<h2 class="text-heading text-ink">Resume</h2>
					<p class="max-w-prose text-body text-ink-muted">
						Experience, education, and skills on one page.
					</p>
					<div class="pt-2">
						<Button href={resumeUrl} download={RESUME_FILENAME}>Download PDF</Button>
					</div>
				</div>
			</section>
		</Reveal>
	</div>
</Section>
