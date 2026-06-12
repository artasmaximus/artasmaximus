<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button/Button.svelte';
	import IntersectionOberserver from './IntersectionObserver/IntersectionOberserver.svelte';
	import RingEffect from '$lib/cursor/effects/RingEffect.svelte';
	import { fly, scale } from 'svelte/transition';

	interface ProjectCardProps {
		title: string;
		description: string;
		thumbnailName: string;
		color?: string;
		href?: string;
	}

	let { title, description, thumbnailName, href, color = '#1e1e1e' }: ProjectCardProps = $props();

	let src = $state<string>();

	onMount(async () => {
		src = (await import(`$lib/assets/thumbnails/${thumbnailName}.jpg`)).default;
	});
</script>

<IntersectionOberserver>
	<div class="group flex w-full max-w-sm flex-col gap-4 rounded-2xl p-4 transition-colors">
		<div in:scale={{ start: 0.93, duration: 600 }}>
			<RingEffect accent={color}>
				<a
					{href}
					class="block aspect-video w-full cursor-none overflow-hidden rounded-xl border-2 border-stone-700 border-opacity-15"
					aria-label="Open {title}"
				>
					{#if src}
						<img {src} alt={title} class="h-full w-full overflow-clip object-cover" />
					{/if}
				</a>
			</RingEffect>
		</div>

		<a in:fly={{ duration: 600, y: -20, delay: 150 }} {href} class="h-fit w-fit">
			<Button {color} twclass="w-full px-3 py-1 text-lg font-medium">
				{title}
			</Button>
		</a>

		<p
			in:fly={{ duration: 600, y: -20, delay: 300 }}
			class="text-pretty font-thin text-stone-700 md:text-lg"
		>
			{description}
		</p>
	</div>
</IntersectionOberserver>
