<script lang="ts">
	import LinkEffect from '$lib/cursor/effects/LinkEffect.svelte';
	import { projects } from '$lib/projects';
</script>

<!-- A catalog-style index: a hairline above each project, none after the last. -->
<ul>
	{#each projects as project (project.slug)}
		<li class="border-t border-line">
			<LinkEffect>
			<a
				href="/projects/{project.slug}"
				class="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 md:grid-cols-12 md:gap-x-10 md:py-9"
			>
				<span
					class="text-title text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 motion-reduce:transition-none md:col-span-5"
				>
					{project.name}
				</span>
				<span
					class="col-span-2 row-start-2 max-w-prose text-small text-ink-muted md:col-span-6 md:row-start-auto"
				>
					{project.blurb}
				</span>
				<span
					aria-hidden="true"
					class="col-start-2 row-start-1 flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg md:col-span-1 md:col-start-auto md:row-start-auto"
				>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M3 9h12m0 0-5-5m5 5-5 5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
			</LinkEffect>
		</li>
	{/each}
</ul>
