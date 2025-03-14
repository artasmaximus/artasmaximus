<script lang="ts">
	import GradientText from '$lib/components/GradientText.svelte';
	import rulesImg from '$lib/assets/minimotorways/rules.jpg';

	interface SectionDescription {
		title: string;
		text: string[];
		src?: string;
	}

	let about = {
		title: 'About',
		text: [
			'My Mini Motorways recreation started as a term project in my first year of college as part of my intro to programming course.',
			'Armed with Python and PyGame, I dove into the complex world of pathfinding algorithms and traffic simulation.'
		]
	};

	let sections = [
		{
			title: 'Technical Architecture',
			text: [
				'The core of the game revolves around a custom A* pathfinding implementation, handling real-time route calculations for multiple vehicles.',
				'We developed a modular event system that manages everything from user input to traffic flow optimization, creating a responsive and dynamic gameplay experience.'
			]
		},
		{
			title: 'Gameplay Elements',
			text: [
				'Players must strategically connect colorful buildings with matching destinations, creating an efficient road network that grows increasingly complex.',
				'The challenge intensifies as more buildings appear and traffic increases, requiring careful planning and quick thinking to prevent gridlock.'
			],
			src: rulesImg
		}
	];
</script>

{#snippet title(text: string)}
	<div class="flex text-xl font-bold md:text-3xl">{text}</div>
{/snippet}

{#snippet video()}
	<iframe
		title="Mini Motorways Video"
		src="https://www.youtube.com/embed/GaAHKJQ6lcY?si=5lAKeFCLD4c0Rsce"
		class="flex h-full w-full"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
{/snippet}

{#snippet info(section: SectionDescription)}
	<div class="flex flex-col gap-4">
		{@render title(section.title)}
		<div class="flex flex-col gap-2">
			{#each section.text as text}
				<p class="flex text-pretty text-lg leading-relaxed text-stone-600">{text}</p>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet section(section: SectionDescription)}
	<div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
		{#if section.src}
			<img
				class="flex aspect-auto h-full w-full max-w-xl rounded-lg shadow-lg"
				src={section.src}
				alt=""
			/>
		{/if}
		{@render info(section)}
	</div>
{/snippet}

<div class="flex w-full flex-col items-center gap-16 py-12">
	<GradientText
		text="Mini Motorways"
		twclass="text-4xl whitespace-nowrap"
		from="#494435"
		to="#F7D282"
	/>

	<div class="flex w-full flex-col gap-24 px-6 md:px-16">
		{@render section(about)}

		{#each sections as sec}
			{@render section(sec)}
		{/each}
	</div>

	<!-- Video section at the bottom -->
	<div class="mt-16 flex w-full max-w-4xl flex-col items-center gap-8">
		{@render title('See It In Action')}
		<div class="aspect-video w-full overflow-clip rounded-xl shadow-xl md:rounded-3xl">
			{@render video()}
		</div>
	</div>
</div>
