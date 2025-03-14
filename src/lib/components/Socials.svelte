<script lang="ts">
	interface SocialButton {
		platform: string;
		bg: string;
	}

	import AtSign from '../icons/AtSign.svelte';
	import SocialIcon from '../icons/SocialIcon.svelte';
	import BubbleEffect from '../cursor/effects/BubbleEffect.svelte';
	import { DEFAULT_STYLE } from '../cursor/CursorState.svelte';
	import { fly } from 'svelte/transition';

	let open = $state(false);

	const ANIMATION_DURATION = 100; // Made this shorter for snappier animations
	const STAGGER_DELAY = 50;

	const socialIcons: SocialButton[] = $state([
		{ platform: 'linkedin', bg: '#006699' },
		{ platform: 'github', bg: '#333333' },
		{
			platform: 'instagram',
			bg: 'linear-gradient(to bottom right, #5B4FE9 0%, #8F39CE 21%, #D53692 38%, #F75274 52%, #FCBB45 74%, #FBE18A 100%);'
		},
		{ platform: 'facebook', bg: '#337FFF' }
	]);
</script>

<div class="wrapper items-center">
	<BubbleEffect padding={4} br={10} cursorStyle={DEFAULT_STYLE}>
		<button
			class="atSignButton"
			onclick={() => (open = !open)}
			aria-label={open ? 'Hide social links' : 'Show social links'}
		>
			<AtSign />
		</button>
	</BubbleEffect>

	<div class="socialLinks">
		{#if open}
			{#each socialIcons as { platform, bg }, i}
				<div
					class="icon"
					in:fly|global={{ y: 20, duration: ANIMATION_DURATION, delay: i * STAGGER_DELAY }}
					out:fly|global={{
						y: 20,
						duration: ANIMATION_DURATION,
						delay: (socialIcons.length - 1 - i) * STAGGER_DELAY
					}}
				>
					<SocialIcon {platform} {bg} />
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
		top: 3rem;
	}
	.icon:nth-child(3) {
		top: 6rem;
	}
	.icon:nth-child(4) {
		top: 9rem;
	}

	.atSignButton {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover {
		cursor: none;
	}
</style>
