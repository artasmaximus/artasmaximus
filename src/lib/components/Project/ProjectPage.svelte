<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { bgDotColor } from '$lib/components/Background/Background.svelte.ts';
	import { nextProject, type Project } from '$lib/projects';

	let {
		project,
		hero,
		children
	}: {
		project: Project;
		hero?: () => any;
		children: () => any;
	} = $props();

	let facts = $derived(
		[
			{ label: 'Year', value: project.year },
			{ label: 'Role', value: project.role },
			{ label: 'Stack', value: project.stack },
			{ label: 'Context', value: project.context }
		].filter((fact) => fact.value)
	);

	let next = $derived(nextProject(project.slug));

	$effect(() => {
		bgDotColor.updatePrimary(project.dotPrimary);
		bgDotColor.updateBlink(project.dotBlink);
		return () => bgDotColor.reset();
	});
</script>

<Seo title={project.name} description={project.summary} image={project.cover} />

<article class="flex w-full flex-col gap-16 md:gap-24">
	<Reveal>
		<header class="flex flex-col gap-10">
			<div class="flex flex-col gap-5">
				<Heading>{project.name}</Heading>
				<p class="max-w-prose text-lead text-ink-muted">{project.summary}</p>
			</div>

			<div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
				<dl class="flex flex-wrap gap-x-12 gap-y-4">
					{#each facts as { label, value }}
						<div class="flex flex-col gap-1">
							<dt class="text-label text-ink-subtle">{label}</dt>
							<dd class="text-small tabular-nums text-ink">{value}</dd>
						</div>
					{/each}
				</dl>
				{#if project.links?.length}
					<div class="flex gap-2">
						{#each project.links as link}
							<Button href={link.href} external tint={project.accent} br={50} twclass="px-4 py-1.5">
								{link.label} ↗
							</Button>
						{/each}
					</div>
				{/if}
			</div>
		</header>
	</Reveal>

	{#if hero}
		<Reveal>
			{@render hero()}
		</Reveal>
	{/if}

	{@render children()}

	{#if next.slug !== project.slug}
		<Reveal>
			<nav aria-label="Next project" class="flex flex-col gap-4 border-t border-line pt-6">
				<span class="text-label text-ink-subtle">Next project</span>
				<Button href="/projects/{next.slug}" tint={next.accent} twclass="px-4 py-1.5" br={50}>
					{next.name} →
				</Button>
			</nav>
		</Reveal>
	{/if}
</article>
