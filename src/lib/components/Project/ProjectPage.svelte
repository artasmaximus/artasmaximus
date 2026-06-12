<script lang="ts">
	import GradientText from '$lib/components/GradientText.svelte';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { bgDotColor } from '$lib/components/Background/Background.svelte.ts';
	import { scale } from 'svelte/transition';
	import type { ProjectTheme } from './theme';

	let {
		theme,
		meta = [],
		links = [],
		summary,
		children
	}: {
		theme: ProjectTheme;
		meta?: string[];
		links?: { label: string; href: string }[];
		summary: string;
		children: () => any;
	} = $props();

	$effect(() => {
		bgDotColor.updatePrimary(theme.dotPrimary);
		bgDotColor.updateBlink(theme.dotBlink);
		return () => bgDotColor.reset();
	});
</script>

<article class="flex w-full max-w-2xl flex-col gap-16 md:gap-24">
	<IntersectionOberserver>
		<header class="flex flex-col gap-5">
			<div
				class="flex flex-wrap items-center justify-between gap-3 text-xs tracking-wide text-stone-500"
			>
				<span>{meta.join(' · ')}</span>
				{#if links.length}
					<span class="flex gap-2">
						{#each links as link}
							<a href={link.href} target="_blank" rel="noreferrer">
								<Button color={theme.accent} br={50} border={false} twclass="px-3 py-1">
									{link.label} ↗
								</Button>
							</a>
						{/each}
					</span>
				{/if}
			</div>
			<div in:scale={{ duration: 500 }}>
				<GradientText
					text={theme.name}
					twclass="text-4xl md:text-5xl whitespace-nowrap"
					from={theme.from}
					to={theme.to}
				/>
			</div>
			<p class="max-w-prose text-[17px] leading-relaxed text-stone-700">{summary}</p>
			<hr class="border-stone-200" />
		</header>
	</IntersectionOberserver>

	{@render children()}
</article>
