<script lang="ts">
	import Clickable from '../cursor/Clickable.svelte';
	import { createElementMeasureStore } from '$lib/stores/elementMeasure';
	export let direction: 'left' | 'right' = 'right';
	let measureStore = createElementMeasureStore();
</script>

{#if direction === 'right'}
	<Clickable {measureStore}>
		<svg
			width="57"
			height="37"
			viewBox="0 0 57 37"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			use:measureStore.bubble={{ hPadding: 3, vPadding: 3 }}
		>
			<rect
				x="1"
				y="1"
				width="55"
				height="35"
				rx="17.5"
				stroke="black"
				style="stroke:black;stroke-opacity:1;"
				stroke-width="2"
			/>
			<path
				d="M36.5635 18.6367C36.5635 18.9355 36.4404 19.2344 36.2207 19.4453L30.4551 25.2109C30.2178 25.4395 29.9541 25.5449 29.6816 25.5449C29.0488 25.5449 28.6006 25.0967 28.6006 24.5078C28.6006 24.1826 28.7324 23.9189 28.9346 23.7256L30.9033 21.7393L33.2236 19.6211L31.2285 19.7354H20.8662C20.1982 19.7354 19.7412 19.2871 19.7412 18.6367C19.7412 17.9863 20.1982 17.5381 20.8662 17.5381H31.2285L33.2148 17.6523L30.9033 15.5342L28.9346 13.5479C28.7324 13.3457 28.6006 13.082 28.6006 12.7656C28.6006 12.168 29.0488 11.7197 29.6816 11.7197C29.9541 11.7197 30.2178 11.834 30.4639 12.0801L36.2207 17.8281C36.4404 18.0391 36.5635 18.3379 36.5635 18.6367Z"
				fill="black"
				style="fill:black;fill-opacity:1;"
			/>
		</svg>
	</Clickable>
{:else}
	<Clickable {measureStore}>
		<svg
			width="57"
			height="37"
			viewBox="0 0 57 37"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			use:measureStore.bubble={{ hPadding: 3, vPadding: 3 }}
		>
			<rect
				x="-1"
				y="1"
				width="55"
				height="35"
				rx="17.5"
				transform="matrix(-1 0 0 1 55 0)"
				stroke="black"
				style="stroke:black;stroke-opacity:1;"
				stroke-width="2"
			/>
			<path
				d="M20.4365 18.6367C20.4365 18.9355 20.5596 19.2344 20.7793 19.4453L26.5449 25.2109C26.7822 25.4395 27.0459 25.5449 27.3184 25.5449C27.9512 25.5449 28.3994 25.0967 28.3994 24.5078C28.3994 24.1826 28.2676 23.9189 28.0654 23.7256L26.0967 21.7393L23.7764 19.6211L25.7715 19.7354H36.1338C36.8018 19.7354 37.2588 19.2871 37.2588 18.6367C37.2588 17.9863 36.8018 17.5381 36.1338 17.5381H25.7715L23.7852 17.6523L26.0967 15.5342L28.0654 13.5479C28.2676 13.3457 28.3994 13.082 28.3994 12.7656C28.3994 12.168 27.9512 11.7197 27.3184 11.7197C27.0459 11.7197 26.7822 11.834 26.5361 12.0801L20.7793 17.8281C20.5596 18.0391 20.4365 18.3379 20.4365 18.6367Z"
				fill="black"
				style="fill:black;fill-opacity:1;"
			/>
		</svg>
	</Clickable>
{/if}
