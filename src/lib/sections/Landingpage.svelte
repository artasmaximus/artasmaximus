<script lang="ts">
	import Section from '../layout/Section.svelte';
	import GradientText from '../components/GradientText.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import pic1 from '$lib/assets/selfies/pic1.jpg';
	import pic2 from '$lib/assets/selfies/pic2.jpg';
	import pic3 from '$lib/assets/selfies/pic3.jpg';
	import pic4 from '$lib/assets/selfies/pic4.jpg';
	import IntersectionOberserver from '$lib/components/IntersectionObserver/IntersectionOberserver.svelte';

	const lgText = 'text-3xl md:text-4xl lg:text-5xl';
	const mdText = 'text-3xl md:text-4xl lg:text-4xl';
	const smText = 'text-xl md:text-2xl lg:text-xl';
</script>

{#snippet images()}
	<img
		in:scale={{
			start: 0.9,
			duration: 800,
			delay: 200
		}}
		src={pic1}
		class="photo mobile"
		alt="Artas - Professional Shot 1"
	/>
	<img
		in:scale={{
			start: 0.9,
			duration: 800,
			delay: 400
		}}
		src={pic2}
		class="photo mobile"
		alt="Artas - Professional Shot 2"
	/>
	<img
		in:scale={{
			start: 0.9,
			duration: 800,
			delay: 600
		}}
		src={pic3}
		class="photo mobile"
		alt="Artas - Professional Shot 3"
	/>
	<img
		in:scale={{
			start: 0.9,
			duration: 800,
			delay: 800
		}}
		src={pic4}
		class="photo mobile"
		alt="Artas - Professional Shot 4"
	/>
{/snippet}

<IntersectionOberserver>
	<Section>
		<div
			class="flex h-full w-full flex-col items-center justify-start pt-[6vh]"
			in:fade={{ duration: 100 }}
		>
			<div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-20">
				<div
					class="order-1 flex flex-col space-y-24 md:order-none md:space-y-10"
					in:fly={{ y: 20, duration: 400, delay: 200 }}
				>
					<div
						class="flex flex-col items-center space-y-1 md:items-start md:space-y-2"
						in:fly={{ y: 20, duration: 300, delay: 200 }}
					>
						<GradientText text="Hey I'm Artas!" twclass="whitespace-nowrap text-start {lgText}" />
						<GradientText text="your next . . . " twclass={smText} />
					</div>

					<div class="mx-auto grid grid-cols-2 gap-4 p-0 md:hidden">
						{@render images()}
					</div>

					<div
						class="flex h-full flex-col items-center justify-around gap-[0.1vh] md:items-start md:space-y-3"
						in:fly={{ y: 20, duration: 400, delay: 400 }}
					>
						<GradientText
							text="Frontend Developer,"
							to="#9747FF"
							glow={true}
							twclass="whitespace-nowrap text-start {mdText}"
						/>
						<GradientText text="UX Designer," to="#56D82E" glow={true} twclass={mdText} />
						<GradientText text="Collaborator," to="#FF4992" glow={true} twclass={mdText} />
						<GradientText text="+ Friend ;)" to="#FFA21F" glow={false} twclass={smText} />
					</div>
				</div>

				<div
					class="hidden md:block"
					in:scale={{
						start: 0.95,
						duration: 1000,
						delay: 600
					}}
				>
					<div class="grid aspect-square w-full max-w-md grid-cols-2 gap-4">
						{@render images()}
					</div>
				</div>
			</div>
		</div>

		<div
			class="m-0 flex w-full justify-center align-middle"
			in:fly={{ y: 20, duration: 400, delay: 750 }}
		>
			<p
				class="m-0 w-3/4 pt-10 text-center text-base font-normal leading-relaxed text-stone-600 md:w-3/4 md:text-xl lg:text-xl xl:w-1/2"
			>
				Through ideation, research, design, development, and iteration, I strive to create user
				experiences that are both functional and engagingly beautiful.
			</p>
		</div>
	</Section>
</IntersectionOberserver>

<style>
	.photo {
		aspect-ratio: 1;
		border-radius: 1rem;
		object-fit: cover;
		box-shadow:
			0 1px 1px var(--shadow-color),
			0 3px 3px var(--shadow-color),
			0 6px 6px var(--shadow-color),
			0 12px 12px var(--shadow-color),
			0 24px 24px var(--shadow-color),
			0 48px 48px var(--shadow-color);
		z-index: -1;
	}

	.mobile {
		width: 28vw;
	}

	.desktop {
		width: 100%;
	}

	:root {
		--shadow-color: rgba(30, 30, 30, 0.1);
	}
</style>
