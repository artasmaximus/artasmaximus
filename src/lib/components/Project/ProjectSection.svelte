<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import Text from '$lib/components/Text.svelte';

	let {
		title,
		text = [],
		aside,
		divider,
		children
	}: {
		title: string;
		text?: string[];
		/* Small art that sits under the text, in place of a full-width figure. */
		aside?: () => any;
		/* Replaces the hairline above the section, for a page that wants its own. */
		divider?: () => any;
		children?: () => any;
	} = $props();
</script>

<section class="flex flex-col gap-10">
	<Reveal>
		{#if divider}
			{@render divider()}
		{/if}
		<div
			class="grid grid-cols-1 gap-4 pt-6 md:grid-cols-12 md:gap-10 {divider
				? ''
				: 'border-t border-line'}"
		>
			<div class="md:col-span-4">
				<Heading as="h2" size="heading">{title}</Heading>
			</div>
			<div class="flex flex-col gap-8 md:col-span-8">
				<div class="flex flex-col gap-4">
					{#each text as paragraph}
						<Text tone="muted" twclass="max-w-prose text-body">{paragraph}</Text>
					{/each}
				</div>
				{#if aside}
					<div class="max-w-full">
						{@render aside()}
					</div>
				{/if}
			</div>
		</div>
	</Reveal>

	{#if children}
		<Reveal>
			{@render children()}
		</Reveal>
	{/if}
</section>
