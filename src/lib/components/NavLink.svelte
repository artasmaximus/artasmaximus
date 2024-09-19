<script lang="ts">
	import Clickable from './Clickable.svelte';
	import type { CursorShape } from '$lib/stores/EventBus';
	import { onMount } from 'svelte';

	export let href = '';
	export let active = false;

	let link: any;
	let linkCursorShape: CursorShape;

	let hpadding = 15;
	let vpadding = 8;

	function getLinkCursorShape(): CursorShape {
		let rect;
		if (link) {
			rect = link.getBoundingClientRect();
		}

		return {
			position: { x: 0, y: 0 },
			width: rect.width + hpadding * 2,
			height: rect.height + vpadding * 2,
			borderRadius: (rect.height + vpadding * 2) / 2,
			blendMode: 'difference',
			fill: 'white',
			zIndex: 11
		};
	}
	onMount(() => {
		linkCursorShape = getLinkCursorShape();
	});
</script>

<div class="link">
	<Clickable hoveredCursorShape={linkCursorShape}>
		<a {href} class:active bind:this={link}>
			<slot></slot>
		</a>
	</Clickable>
</div>

<style>
	.link {
		display: flex;
		font-family: 'Urbanist', sans-serif;
		place-content: center;
		place-items: center;
		align-items: center;
		width: 100px;
	}
	.link a {
		text-decoration: none;
		font-weight: 300;
		width: auto;
		display: inline-block; /* Ensure that the min-width applies correctly */
		text-align: center; /* Optional: to center the text within the block */
		color: #000;
		color: color(display-p3 0 0 0);
		font-family: Urbanist;
		font-size: 18px;
		font-style: normal;
		line-height: normal;
		letter-spacing: -0.54px;
		position: relative;
		z-index: 12;
	}

	.link a.active {
		font-weight: 700;
		cursor: none;
	}

	.link a:hover {
		color: black;
		transition:
			color 0.2s,
			font-weight 0.2s;
		width: 0.3s;
		cursor: none;
	}
</style>
