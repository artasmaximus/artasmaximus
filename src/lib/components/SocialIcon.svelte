<script lang="ts">
	export let iconName: string;
	export let href: string;
	import { onMount } from 'svelte';

	let src: any;

	onMount(async () => {
		src = (await import(`$lib/assets/${iconName}.png`)).default;
	});
</script>

<div class="socialIcon">
	<a {href}><img {src} alt={iconName} /></a>
</div>

<style>
	.socialIcon {
		display: flex;
		align-items: center; /* Centers vertically */
		justify-content: center; /* Centers horizontally */
		cursor: pointer;
		transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
		width: 16px;
		height: 16px;
	}

	.socialIcon img {
		width: 100%;
		height: 100%;
	}

	.socialIcon:hover {
		transform: scale(1.35);
		transition: 0.07s ease-in-out;
	}

	.socialIcon a {
		text-decoration: none;
		color: black;
	}
</style>
