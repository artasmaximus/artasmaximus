<!-- Modal.svelte -->
<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { DEFAULT_STYLE } from '$lib/cursor/CursorState.svelte';

	let { showModal = $bindable(), children } = $props();

	function close() {
		showModal = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
		}
	}
</script>

{#if showModal}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
		role="dialog"
		aria-modal="true"
		onclick={close}
		onkeydown={handleKeydown}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative mx-4 w-full max-w-2xl rounded-xl bg-white p-6"
			role="document"
			transition:scale={{ duration: 300, start: 0.95 }}
		>
			<div class="relative">
				{@render children()}
			</div>

			<BubbleEffect padding={8} br={9999} cursorStyle={DEFAULT_STYLE}>
				<button
					type="button"
					onclick={close}
					class="absolute right-4 top-4 rounded-full p-2 text-black/60 transition-colors hover:text-black"
					aria-label="Close modal"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
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
				</button>
			</BubbleEffect>
		</div>
	</div>
{/if}
