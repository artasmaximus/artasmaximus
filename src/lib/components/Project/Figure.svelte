<script lang="ts">
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';

	let {
		src,
		alt,
		mat = false
	}: {
		src: string;
		alt: string;
		/* Hangs a smaller or white-ground image centered on a white mat. */
		mat?: boolean;
	} = $props();
</script>

<figure>
	<GlassEffect>
		<div
			class="overflow-hidden rounded-lg border border-line bg-surface {mat
				? 'flex justify-center p-8 md:p-16'
				: ''}"
		>
			<img
				{src}
				{alt}
				loading="lazy"
				decoding="async"
				class={mat ? 'max-h-[70vh] w-auto' : 'w-full'}
			/>
		</div>
	</GlassEffect>
</figure>
