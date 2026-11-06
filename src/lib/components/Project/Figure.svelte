<script lang="ts">
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';

	let {
		src,
		alt,
		mat = false,
		bare = false,
		onOpen
	}: {
		src: string;
		alt: string;
		/* Hangs a smaller or white-ground image centered on a white mat. */
		mat?: boolean;
		/* Drops the card, so a transparent image sits straight on the page. */
		bare?: boolean;
		/* Makes the image a button that calls this, e.g. to open it in a lightbox. */
		onOpen?: () => void;
	} = $props();
</script>

<figure>
	<GlassEffect>
		<div
			class={bare
				? ''
				: `overflow-hidden rounded-lg border border-line bg-surface ${
						mat ? 'flex justify-center p-8 md:p-16' : ''
					}`}
		>
			{#if onOpen}
				<button type="button" class="block w-full" aria-label="Expand {alt}" onclick={onOpen}>
					<img
						{src}
						{alt}
						loading="lazy"
						decoding="async"
						class={mat && !bare ? 'max-h-[70vh] w-auto' : 'w-full'}
					/>
				</button>
			{:else}
				<img
					{src}
					{alt}
					loading="lazy"
					decoding="async"
					class={mat && !bare ? 'max-h-[70vh] w-auto' : 'w-full'}
				/>
			{/if}
		</div>
	</GlassEffect>
</figure>
