<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '$lib/components/Button/Button.svelte';
	import { cursorState } from '$lib/cursor/CursorState.svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// A full-screen viewer: one image at a time, centered. Arrows (or the keyboard) step
	// through them; Escape, the close button, or a click on the backdrop or image closes it.
	// Set `current` to an index to open it, and to null to close it.
	let {
		items,
		current = $bindable(null),
		label = 'Image viewer',
		/* Singular, for the arrow buttons' screen-reader text. */
		noun = 'image',
		/* Sets the image on a white card, for transparent images that need a light ground. */
		mat = false
	}: {
		items: { src: string; alt: string }[];
		current?: number | null;
		label?: string;
		noun?: string;
		mat?: boolean;
	} = $props();

	let dialog = $state<HTMLDivElement>();
	let opener: HTMLElement | null = null;
	const fadeMs = prefersReducedMotion() ? 0 : 200;

	function close() {
		// The image is removed from under the pointer, so no mouseleave will hand the cursor back.
		cursorState.reset();
		current = null;
	}

	function step(by: number) {
		if (current === null) return;
		current = (current + by + items.length) % items.length;
	}

	// Remember what had focus, lock page scroll while open, focus the dialog, and hand focus
	// back after. `opener` is captured before the dialog takes focus.
	$effect(() => {
		if (current === null) return;
		opener = document.activeElement as HTMLElement | null;
		document.body.style.overflow = 'hidden';
		dialog?.focus();
		return () => {
			document.body.style.overflow = '';
			opener?.focus({ preventScroll: true });
		};
	});

	// Warm the neighbors so stepping never waits on a download.
	$effect(() => {
		if (current === null) return;
		for (const by of [-1, 1]) new Image().src = items[(current + by + items.length) % items.length].src;
	});

	function onKeydown(e: KeyboardEvent) {
		if (current === null) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if current !== null}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		bind:this={dialog}
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 outline-none backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-label={label}
		transition:fade={{ duration: fadeMs }}
		onclick={(e) => {
			if (e.target === e.currentTarget) close();
		}}
	>
		<!-- The row ignores clicks itself, so the gaps count as the backdrop. -->
		<div class="pointer-events-none flex items-center gap-1 md:gap-8">
			{#if items.length > 1}
				<div class="pointer-events-auto">
					<Button
						blend
						fill="transparent"
						fillText="#FFFFFF"
						border={false}
						br={12}
						twclass="flex h-14 w-9 items-center justify-center p-0 md:h-16 md:w-11"
						onClick={() => step(-1)}
					>
						<span class="sr-only">Previous {noun}</span>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
							<path
								d="M11 3 5 9l6 6"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</Button>
				</div>
			{/if}

			<!-- The glass wrapper stays put while the image keys underneath it, so stepping never strands the cursor. -->
			<GlassEffect twclass="pointer-events-auto flex">
				{#key current}
					<img
						src={items[current].src}
						alt={items[current].alt}
						class="max-h-[80vh] max-w-[calc(100vw-7.5rem)] object-contain md:max-w-[min(70vw,1100px)] {mat
							? 'rounded-lg bg-surface'
							: ''}"
						in:fade={{ duration: fadeMs }}
						onclick={close}
					/>
				{/key}
			</GlassEffect>

			{#if items.length > 1}
				<div class="pointer-events-auto">
					<Button
						blend
						fill="transparent"
						fillText="#FFFFFF"
						border={false}
						br={12}
						twclass="flex h-14 w-9 items-center justify-center p-0 md:h-16 md:w-11"
						onClick={() => step(1)}
					>
						<span class="sr-only">Next {noun}</span>
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
							<path
								d="m7 3 6 6-6 6"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</Button>
				</div>
			{/if}
		</div>

		<div class="absolute right-5 top-5 md:right-8 md:top-8">
			<Button
				blend
				fill="transparent"
				fillText="#FFFFFF"
				border={false}
				br={50}
				twclass="flex h-11 w-11 items-center justify-center p-0"
				onClick={close}
			>
				<span class="sr-only">Close</span>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
					<path
						d="M4 4l10 10M14 4 4 14"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</Button>
		</div>

		{#if items.length > 1}
			<p
				class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-small text-white/70 md:bottom-8"
				aria-live="polite"
			>
				{current + 1} / {items.length}
			</p>
		{/if}
	</div>
{/if}
