<script lang="ts">
	import Button from '../Button/Button.svelte';
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { DEFAULT_STYLE } from '$lib/cursor/CursorState.svelte';
	import MenuIcon from './MenuIcon.svelte';
	import { navItems } from '$lib/nav';
	import { fly } from 'svelte/transition';
	import { dismiss } from '$lib/utils/dismiss';

	let open = $state(false);

	const ANIMATION_DURATION = 100;
	const STAGGER_DELAY = 50;
</script>

<div class="relative lg:hidden" use:dismiss={{ open, close: () => (open = false) }}>
	<BubbleEffect padding={2} br={10} cursorStyle={DEFAULT_STYLE}>
		<button
			class="menu-button"
			onclick={() => (open = !open)}
			aria-label={open ? 'Close menu' : 'Open menu'}
			aria-expanded={open}
		>
			<MenuIcon {open} />
		</button>
	</BubbleEffect>

	<div class="menu-links" class:open>
		{#if open}
			{#each navItems as { label, href, download }, i}
				<div
					class="menu-item"
					in:fly|global={{ y: 20, duration: ANIMATION_DURATION, delay: i * STAGGER_DELAY }}
					out:fly|global={{
						y: 20,
						duration: ANIMATION_DURATION,
						delay: (navItems.length - 1 - i) * STAGGER_DELAY
					}}
				>
					<Button
						{href}
						{download}
						onClick={() => (open = false)}
						twclass="px-3 py-1"
						br={50}
						border={false}
					>
						{label}
					</Button>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.menu-button {
		background: none;
		border: none;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-links {
		position: absolute;
		top: 200%;
		right: 0;
		/* The items are absolutely positioned, so this box needs its own size. It then covers the
		   gaps between them and counts as part of the menu for the mouse-leave check. */
		width: 7rem;
		height: 9rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1.5rem;
		z-index: 10;
		/* Closed, the box is still there (so the items can animate out) but must not block clicks. */
		pointer-events: none;
	}

	.menu-links.open {
		pointer-events: auto;
	}

	/* Bridges the gap between the button and the first item. */
	.menu-links::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -1.5rem;
		height: 1.5rem;
	}

	.menu-item {
		position: absolute;
		right: 0;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		z-index: 10;
		will-change: transform, opacity;
	}

	.menu-item:nth-child(1) {
		top: 0;
	}
	.menu-item:nth-child(2) {
		top: 3rem;
	}
	.menu-item:nth-child(3) {
		top: 6rem;
	}
</style>
