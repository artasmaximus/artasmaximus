<!-- page for slime simulation project -->

<script lang="ts">
	import GradientText from '$lib/components/GradientText.svelte';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';
	import { scale, fly } from 'svelte/transition';

	// TODO: import your screenshots here, e.g.:
	// import screenshot1 from '$lib/assets/slimesimulation/colony.png';
	// import screenshot2 from '$lib/assets/slimesimulation/sparse.png';

	let sections = [
		{
			title: 'Three Rules',
			text: [
				'Each agent does exactly three things: move forward, deposit a chemical trail, and steer toward the strongest nearby trail. That is the entire specification.',
				'From those three local rules, the simulation produces global structures — branching networks, spiral arms, and dense colonies — that no single agent is aware of.'
			]
			// image: screenshot1
		},
		{
			title: 'Emergence',
			text: [
				'The structure is never drawn. It is a side effect of thousands of agents following simple local rules — the same phenomenon behind slime mold, ant trails, and vascular networks.',
				'Adjusting the sensor angle, deposit rate, or decay speed shifts the entire character of the system: sparse exploratory tendrils at low deposit rates, dense territorial masses at high ones.'
			]
			// image: screenshot2
		}
	];

	// TODO: set this to your demo URL if hosted, or remove the iframe section below
	let demoSrc = '';
</script>

<div class="flex w-full flex-col items-center gap-24">
	<IntersectionOberserver>
		<div in:scale={{ duration: 500 }}>
			<GradientText
				text="Slime Simulation"
				twclass="text-4xl whitespace-nowrap"
				from="#1aff8c"
				to="#0066ff"
			/>
		</div>
	</IntersectionOberserver>

	{#each sections as section}
		<IntersectionOberserver>
			<div
				class="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-32 xl:gap-48"
			>
				{#if section.image}
					<div in:fly={{ x: -50, duration: 600 }} class="w-1/2 md:w-[100%] md:max-w-80">
						<img
							src={section.image}
							alt={section.title}
							class="w-full rounded-lg shadow-lg"
						/>
					</div>
				{/if}

				<div
					in:fly={{ x: section.image ? 50 : 0, y: section.image ? 0 : 20, duration: 600, delay: 200 }}
					class="flex w-full min-w-64 flex-col gap-4 text-center md:text-left {section.image ? 'md:w-1/3' : 'md:w-2/3'}"
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

	{#if demoSrc}
		<div class="flex w-full flex-col gap-[3vw] px-[5vw] sm:items-center md:items-start xl:px-[10vw]">
			<h2 class="text-3xl font-bold tracking-tight">Try It Live</h2>
			<iframe
				title="Slime Simulation Demo"
				class="aspect-video w-full rounded-xl shadow-xl"
				src={demoSrc}
				allowfullscreen
			></iframe>
		</div>
	{/if}
</div>
