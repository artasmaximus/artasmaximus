<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Clickable from '../cursor/Clickable.svelte';
	import { createElementMeasureStore, type UnderlineOptions } from '$lib/stores/elementMeasure';
	import { cursorShape, GLASS_CURSOR_SHAPE, DEFAULT_CURSOR_SHAPE } from '$lib/stores/cursor';
	import Description from './Description.svelte';

	export let title: string;
	export let description: string;
	export let href: string;
	export let imgSrc: any;
	export let imgAlt: string;

	let measureStore = createElementMeasureStore();

	onDestroy(() => {
		measureStore.reset();
	});

	function handleMouseEnter() {
		cursorShape.update(() => GLASS_CURSOR_SHAPE);
	}

	function handleLeave() {
		cursorShape.update(() => DEFAULT_CURSOR_SHAPE);
	}
</script>

<div class="card">
	<div
		class="image"
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleLeave}
		role="complementary"
	>
		<img src={imgSrc} alt={imgAlt} />
	</div>
	<div class="titlebar">
		<h3>{title}</h3>
		<Clickable {measureStore}>
			<a {href}>
				<!-- arrow button -->
				<svg
					width="57"
					height="37"
					viewBox="0 0 57 37"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					use:measureStore.bubble={{ hpad: 3, vpad: 3 }}
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
			</a>
		</Clickable>
	</div>
	<div class="description">
		<p>
			{description}
		</p>
	</div>
</div>

<style lang="scss">
	.card {
		display: flex;
		width: 300px;
		height: 342px;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
		gap: 0px;
	}
	.image {
		height: 200px;
		flex-shrink: 0;
		align-self: stretch;
		border-radius: 6px;
		border: 1.5px solid #e2e2e2;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.description {
		align-self: stretch;
		color: #000;
		color: color(display-p3 0 0 0);
		font-family: Urbanist;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		p {
			margin: 0;
		}
	}

	.titlebar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		align-self: stretch;
	}

	a {
		text-decoration: none;
		cursor: none;
	}
</style>
