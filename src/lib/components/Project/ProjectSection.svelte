<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';

	let {
		title,
		text = [],
		children
	}: {
		title: string;
		text?: string[];
		children?: () => any;
	} = $props();
</script>

<section class="flex flex-col gap-10">
	<Reveal>
		<div class="grid grid-cols-1 gap-4 border-t border-line pt-6 md:grid-cols-12 md:gap-10">
			<div class="md:col-span-4">
				<Heading as="h2" size="heading">{title}</Heading>
			</div>
			<div class="flex flex-col gap-4 md:col-span-8">
				{#each text as paragraph}
					<p class="max-w-prose text-body text-ink-muted">{paragraph}</p>
				{/each}
			</div>
		</div>
	</Reveal>

	{#if children}
		<Reveal>
			{@render children()}
		</Reveal>
	{/if}
</section>
