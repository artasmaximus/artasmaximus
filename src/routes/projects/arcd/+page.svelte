<script lang="ts">
	import origins from '$lib/assets/arcdpics/origins.png';
	import symbols from '$lib/assets/arcdpics/symbols.png';
	import dap from '$lib/assets/arcdpics/designapproach.png';
	import GradientText from '$lib/components/GradientText.svelte';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';
	import { scale, fly } from 'svelte/transition';

	let sections = $state([
		{
			title: 'Origins',
			text: [
				"ARCD began over four years ago, inspired by my family's love for card games, a tradition that has always been a part of our gatherings.",
				'I aimed to create a deck that not only served its function in gameplay but also embodied the principles of modern design, with an emphasis on harmony and symmetry.'
			],
			image: origins,
			scale: '150%'
		},
		{
			title: 'Symbol Design',
			text: [
				'After several iterations, I finalized the design for the four suit symbols, each constructed using only rectangles and circular arcs to create a cohesive structure.',
				'Every symbol features an inner and outer stroke with opposing color gradients, as well as a solid-colored variant for the card corners.'
			],
			image: symbols
		},
		{
			title: 'Design Approach',
			text: [
				'ARCD reimagines traditional playing cards through a modern lens, emphasizing geometric symmetry and vibrant gradients.',
				'The relationship between vibrant colors and simple shapes creates a refined, expressive aesthetic, drawing from both traditional card motifs and contemporary design principles.'
			],
			image: dap
		}
	]);
</script>

<div class="flex w-full flex-col items-center gap-24">
	<IntersectionOberserver>
		<div in:scale={{ duration: 500 }}>
			<GradientText text="ARCD" twclass="text-4xl whitespace-nowrap" from="#D1005D" to="#6452FF" />
		</div>
	</IntersectionOberserver>

	{#each sections as section}
		<IntersectionOberserver>
			<div
				class="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-32 xl:gap-48"
			>
				<div in:fly={{ x: -50, duration: 600 }} class="w-1/2 md:w-[100%] md:max-w-80">
					<img
						src={section.image}
						alt={section.title}
						class="w-full"
						style="scale: {section.scale || '100%'}"
					/>
				</div>

				<div
					in:fly={{ x: 50, duration: 600, delay: 200 }}
					class="flex w-full min-w-64 flex-col gap-4 text-center md:w-1/3 md:text-left"
				>
					<h2 class="text-3xl font-bold tracking-tight">
						{section.title}
					</h2>

					{#each section.text as paragraph}
						<p class="w-full text-pretty text-lg leading-relaxed text-stone-600">
							{paragraph}
						</p>
					{/each}
				</div>
			</div>
		</IntersectionOberserver>
	{/each}

	<div class="flex w-full flex-col gap-[3vw] px-[5vw] sm:items-center md:items-start xl:px-[10vw]">
		<h2 class="text-3xl font-bold tracking-tight">View the Figma File</h2>

		<iframe
			style="border: 1px solid rgba(0, 0, 0, 0.1);"
			title="ARCD Figma File"
			class="aspect-video w-full"
			src="https://embed.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master?node-id=0-1&embed-host=share"
			allowfullscreen
		></iframe>
	</div>
</div>
