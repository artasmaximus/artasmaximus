<script lang="ts">
	import Button from '../Button/Button.svelte';
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { DEFAULT_STYLE } from '$lib/cursor/CursorState.svelte';
	import MenuIcon from './MenuIcon.svelte';
	import { fly } from 'svelte/transition';

	let open = $state(false);

	const ANIMATION_DURATION = 100;
	const STAGGER_DELAY = 50;

	const menuItems = [
		{ href: '/Projects', label: 'Projects' },
		{ href: '/Artwork', label: 'Artwork' },
		{ href: '/Resume', label: 'Resume' }
	];
</script>

<div class="relative lg:hidden">
	<BubbleEffect padding={2} br={10} cursorStyle={DEFAULT_STYLE}>
		<button
			class="menu-button"
			onclick={() => (open = !open)}
			aria-label={open ? 'Close menu' : 'Open menu'}
		>
			<MenuIcon {open} />
		</button>
	</BubbleEffect>

	<div class="menu-links">
		{#if open}
			{#each menuItems as { href, label }, i}
				<div
					class="menu-item"
					in:fly|global={{ y: 20, duration: ANIMATION_DURATION, delay: i * STAGGER_DELAY }}
					out:fly|global={{
						y: 20,
						duration: ANIMATION_DURATION,
						delay: (menuItems.length - 1 - i) * STAGGER_DELAY
					}}
				>
					<a {href}>
						<Button
							onClick={() => (open = false)}
							color="#1e1e1e"
							twclass="w-full px-3 py-1"
							br={50}
							border={false}
						>
							{label}
						</Button>
					</a>
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
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-links {
		position: absolute;
		top: 200%;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1.5rem;
		z-index: 10;
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

	button:hover {
		cursor: none;
	}
</style>
