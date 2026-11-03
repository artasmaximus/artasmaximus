<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { nextProject, type Project } from '$lib/projects';
	import { INK, SURFACE } from '$lib/theme';

	let {
		project,
		dark = false,
		hero,
		children
	}: {
		project: Project;
		/* Puts the header on black, up behind the navbar and down into a dark first section. */
		dark?: boolean;
		hero?: () => any;
		children: () => any;
	} = $props();

	let next = $derived(nextProject(project.slug));
</script>

<Seo title={project.name} description={project.summary} image={project.cover} />

<article class="flex w-full flex-col gap-16 md:gap-24">
	<div
		class={dark
			? 'relative isolate before:absolute before:-bottom-16 before:-top-[100vh] before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-black md:before:-bottom-24'
			: ''}
	>
		<Reveal>
			<header class="flex flex-col gap-10">
				<div class="flex flex-col gap-5">
					<Heading light={dark}>{project.name}</Heading>
					<p class="max-w-prose text-lead {dark ? 'text-white/70' : 'text-ink-muted'}">
						{project.summary}
					</p>
				</div>

				{#if project.links?.length}
					<div class="flex gap-2">
						{#each project.links as link}
							<Button
								href={link.href}
								external
								tint={project.accent}
								fill={dark ? SURFACE : undefined}
								fillText={dark ? INK : undefined}
								br={50}
								twclass="px-4 py-1.5"
							>
								{link.label} ↗
							</Button>
						{/each}
					</div>
				{/if}
			</header>
		</Reveal>
	</div>

	{#if hero}
		<Reveal>
			{@render hero()}
		</Reveal>
	{/if}

	{@render children()}

	{#if next.slug !== project.slug}
		<Reveal>
			<nav aria-label="Next project" class="border-t border-line pt-6">
				<Button href="/projects/{next.slug}" tint={next.accent} twclass="px-4 py-1.5" br={50}>
					{next.name} →
				</Button>
			</nav>
		</Reveal>
	{/if}
</article>
