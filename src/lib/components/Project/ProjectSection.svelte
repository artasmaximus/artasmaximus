<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';

	let {
		index,
		title,
		text = [],
		children
	}: {
		index: number;
		title: string;
		text?: string[];
		children?: () => any;
	} = $props();

	let num = $derived(String(index).padStart(2, '0'));
</script>

<section class="flex flex-col gap-10">
	<Reveal>
		<div class="grid grid-cols-1 gap-4 border-t border-line pt-6 md:grid-cols-12 md:gap-10">
			<div class="flex flex-col gap-2 md:col-span-4">
				<span class="text-label tabular-nums text-ink-subtle">{num}</span>
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
