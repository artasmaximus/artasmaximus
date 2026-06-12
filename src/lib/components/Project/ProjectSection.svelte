<script lang="ts">
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';

	let {
		index,
		title,
		accent,
		text = [],
		src,
		alt = '',
		imageSide = 'right',
		frame = true,
		media,
		children
	}: {
		index: number;
		title: string;
		accent: string;
		text?: string[];
		src?: string;
		alt?: string;
		imageSide?: 'left' | 'right';
		frame?: boolean;
		media?: () => any;
		children?: () => any;
	} = $props();

	let num = $derived(String(index).padStart(2, '0'));
</script>

<IntersectionOberserver>
	<section class="flex flex-col gap-8">
		<div
			class="grid grid-cols-1 items-center gap-8 {src || media ? 'md:grid-cols-2 md:gap-12' : ''}"
		>
			{#if src || media}
				<div class={imageSide === 'right' ? 'md:order-2' : ''}>
					{#if media}
						{@render media()}
					{:else}
						<img
							{src}
							{alt}
							loading="lazy"
							class="w-full {frame ? 'rounded-xl border border-stone-900/10 shadow-sm' : ''}"
						/>
					{/if}
				</div>
			{/if}

			<div class="flex flex-col gap-3 {(src || media) && imageSide === 'right' ? 'md:order-1' : ''}">
				<div class="flex items-center gap-3">
					<span class="text-xs font-medium tracking-[0.2em]" style="color: {accent}">{num}</span>
					<span class="h-px w-8 bg-stone-300"></span>
				</div>
				<h2 class="text-2xl font-semibold tracking-tight text-stone-900">{title}</h2>
				{#each text as paragraph}
					<p class="max-w-prose text-[15px] leading-relaxed text-stone-600 md:text-base">
						{paragraph}
					</p>
				{/each}
			</div>
		</div>

		{#if children}
			{@render children()}
		{/if}
	</section>
</IntersectionOberserver>
