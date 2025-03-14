<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from './Button/Button.svelte';
	import GradientText from './GradientText.svelte';
	import IntersectionOberserver from './IntersectionObserver/IntersectionOberserver.svelte';

	const { title, info, href, textColor, buttonColor, buttonLabel } = $props();

	let buttontwclass = 'z-10 flex w-full cursor-none whitespace-nowrap px-6 py-3 text-center';
</script>

<IntersectionOberserver>
	<div class="flex h-full flex-col justify-between rounded-lg p-3">
		<div class="flex flex-col gap-4">
			<div in:fade={{ duration: 500, delay: 100 }} class="title">
				<GradientText text={title} to={textColor} twclass="text-2xl md:text-3xl" />
			</div>
			<p
				in:fade={{ duration: 500, delay: 300 }}
				class="text-base leading-relaxed text-stone-700 md:text-lg"
			>
				{info}
			</p>
		</div>

		<a transition:fade={{ duration: 500, delay: 500 }} {href} class="mt-6 h-fit w-fit">
			<Button color={buttonColor} twclass={buttontwclass}>
				{buttonLabel}
			</Button>
		</a>
	</div>
</IntersectionOberserver>
