<script lang="ts">
	import { onMount } from 'svelte';
	import Clickable from '../cursor/Clickable.svelte';
	import { createElementMeasureStore } from '$lib/stores/elementMeasure';

	export let iconName: string;
	export let href: string;
	export let borderRadius: number | undefined = undefined;

	let measureStore = createElementMeasureStore();

	let src: any;

	onMount(async () => {
		src = (await import(`$lib/assets/${iconName}.png`)).default;
	});
</script>

<Clickable {measureStore}>
	<div
		class="socialIcon"
		use:measureStore.bubble={{ hPadding: 5, vPadding: 5, borderRadius: borderRadius }}
	>
		<a {href}><img {src} alt={iconName} /></a>
	</div>
</Clickable>

<style>
	.socialIcon {
		display: flex;
		align-items: center; /* Centers vertically */
		justify-content: center; /* Centers horizontally */
		width: 25px;
		height: 25px;
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
