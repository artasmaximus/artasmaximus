<!-- ArtworkModal.svelte -->
<script lang="ts">
	import { DEFAULT_STYLE } from '$lib/cursor/CursorState.svelte';
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { fade, scale } from 'svelte/transition';

	let { src, alt, onClose } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/80"
	onclick={onClose}
	transition:fade={{ duration: 200 }}
>
	<div class="max-w-7x relative mx-4" transition:scale={{ duration: 300, start: 0.95 }}>
		<img {src} {alt} class="max-h-[90vh] rounded-xl" />
		<button
			class="absolute right-4 top-4 z-50 cursor-none rounded-full bg-black/40 p-2 text-white/80 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
			onclick={onClose}
		>
			<BubbleEffect padding={9} br={24} cursorStyle={DEFAULT_STYLE}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="z-50 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</BubbleEffect>
		</button>
	</div>
</div>
