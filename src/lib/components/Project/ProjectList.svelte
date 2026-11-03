<script lang="ts">
	import Reveal from '$lib/components/Reveal.svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { projects } from '$lib/projects';
</script>

<ul class="flex flex-col gap-16 md:gap-24">
	{#each projects as project (project.slug)}
		<li>
			<Reveal>
				<a
					href="/projects/{project.slug}"
					class="group grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10"
				>
					<div class="md:col-span-8">
						<GlassEffect>
							<div class="aspect-[3/2] overflow-hidden rounded-lg border border-line bg-surface">
								<img
									src={project.cover}
									alt={project.coverAlt}
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover"
								/>
							</div>
						</GlassEffect>
					</div>
					<div class="flex flex-col gap-2 md:col-span-4">
						<h2 class="text-heading text-ink">{project.name}</h2>
						<p class="text-body text-ink-muted">{project.summary}</p>
					</div>
				</a>
			</Reveal>
		</li>
	{/each}
</ul>
