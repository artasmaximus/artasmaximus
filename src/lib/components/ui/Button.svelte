<script lang="ts">
	import Clickable from '../cursor/Clickable.svelte';
	import { createElementMeasureStore } from '$lib/stores/elementMeasure';

	export let href = '';
	export let active = false;
	export let label = '';
	export let downloadName: string = '';

	let measureStore = createElementMeasureStore();
</script>

<Clickable {measureStore}>
	<div
		class="container {active ? 'active' : ''}"
		use:measureStore.bubble={{ hPadding: 3, vPadding: 3 }}
	>
		{#if !downloadName}
			<a {href} class:active>
				{label}
			</a>
		{:else}
			<a {href} download={downloadName}>
				{label}
			</a>
		{/if}
	</div>
</Clickable>

<style lang="scss">
	.container {
		display: flex;
		padding: 8px 16px;
		justify-content: center;
		align-items: center;
		gap: 8px;
		border-radius: 32px;
		border: 1px solid #000;
		border: 1px solid color(display-p3 0 0 0);
		border-width: 2px;
		font-size: 14px;
		color: color(display-p3 0 0 0);
		color: #000;
		box-sizing: border-box;

		a {
			text-decoration: none;
			font-weight: 500;
			color: inherit;
			font-size: 16px;
			background-color: transparent;
			cursor: none;
		}
	}
	.active {
		color: #fff;
		background-color: #000;
		font-size: inherit;
	}
</style>
