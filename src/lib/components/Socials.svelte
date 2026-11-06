<script lang="ts">
	import AtSign from '../icons/AtSign.svelte';
	import SocialIcon from '../icons/SocialIcon.svelte';
	import BubbleEffect from '../cursor/effects/BubbleEffect.svelte';
	import { DEFAULT_STYLE } from '../cursor/CursorState.svelte';
	import { INK } from '$lib/theme';
	import { fly } from 'svelte/transition';

	let open = $state(false);

	const ANIMATION_DURATION = 100; // Made this shorter for snappier animations
	const STAGGER_DELAY = 50;

	const socialIcons = ['linkedin', 'github'];
</script>

<div class="wrapper items-center">
	<BubbleEffect padding={4} br={10} cursorStyle={DEFAULT_STYLE}>
		<button
			class="atSignButton"
			aria-label={open ? 'Hide social links' : 'Show social links'}
			onclick={() => (open = !open)}
		>
			<AtSign height="20px" fill="currentColor" />
		</button>
	</BubbleEffect>

	<div class="socialLinks">
		{#if open}
			{#each socialIcons as platform, i}
				<div
					class="icon"
					in:fly|global={{ y: 20, duration: ANIMATION_DURATION, delay: i * STAGGER_DELAY }}
					out:fly|global={{
						y: 20,
						duration: ANIMATION_DURATION,
						delay: (socialIcons.length - 1 - i) * STAGGER_DELAY
					}}
				>
					<SocialIcon {platform} bg={INK} />
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		will-change: transform;
	}

	.socialLinks {
		position: absolute;
		top: 200%;
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		z-index: 10;
	}

	.icon {
		position: absolute;
		left: 50%;
		width: 100%;
		display: flex;
		justify-content: center;
		z-index: 10;
		will-change: transform, opacity;
		transform: translateX(-50%); /* Add this to center the icons */
	}

	.icon:nth-child(1) {
		top: 0;
	}
	.icon:nth-child(2) {
		top: 2.5rem;
	}

	.atSignButton {
		background: none;
		border: none;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
