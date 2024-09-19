<script lang="ts">
	export let iconName: string;
	export let href: string;
	import { onMount } from 'svelte';
	import Clickable from './Clickable.svelte';
	import type { CursorShape } from '$lib/stores/EventBus';

	export let socialIconCursorShape: CursorShape = {
		position: { x: 0, y: 0 },
		width: 40,
		height: 40,
		borderRadius: 20,
		blendMode: 'difference',
		fill: 'white',
		zIndex: 11
	};

	let src: any;

	onMount(async () => {
		src = (await import(`$lib/assets/${iconName}.png`)).default;
	});
</script>

<Clickable hoveredCursorShape={socialIconCursorShape}>
	<div class="socialIcon">
		<a {href}><img {src} alt={iconName} /></a>
	</div>
</Clickable>

<style>
	.socialIcon {
		display: flex;
		align-items: center; /* Centers vertically */
		justify-content: center; /* Centers horizontally */
		width: 20px;
		height: 20px;
	}

	.socialIcon a:hover {
		cursor: none;
	}

	.socialIcon a {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.socialIcon img {
		width: 100%;
		height: 100%;
	}

	.socialIcon a {
		text-decoration: none;
		color: black;
	}
</style>
