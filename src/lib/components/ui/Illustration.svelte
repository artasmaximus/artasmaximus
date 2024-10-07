<script lang="ts">
	import { onMount } from 'svelte';
	import { cursorShape, DEFAULT_CURSOR_SHAPE, GLASS_CURSOR_SHAPE } from '$lib/stores/cursor';
	import { appDetail } from '$lib/stores/appDetail';
	import { writable } from 'svelte/store';
	import { zip, zoomIdentity } from 'd3';
	export let imgSrc: string;
	export let imgAlt: string;
	export let maxwidth: number;
	export let isSelected: boolean = false;

	let defaultStyle = {
		x: 0,
		y: 0,
		rotationX: $appDetail.isTouchInput ? '' : '25deg',
		rotationY: $appDetail.isTouchInput ? '' : '0deg',
		scale: 1,
		boxShadow: '0px 20px 30px -25px rgba(0, 0, 0, 1)',
		zIndex: 11
	};

	let hoverStyle = {
		x: 0,
		y: 0,
		rotationX: '-2deg',
		rotationY: '0deg',
		scale: 1.1,
		boxShadow:
			'rgba(22, 31, 39, 0.42) 0px 60px 123px -25px, rgba(19, 26, 32, 0.08) 0px 35px 75px -35px, rgba(19, 26, 32, 0.08) 0px 35px 75px -35px',
		zIndex: 11
	};

	let transformStyle = defaultStyle;

	let src: any;

	onMount(async () => {
		src = (await import(`$lib/assets/Illustrations/${imgSrc}.jpeg`)).default;
	});

	function selectedStyle(e: MouseEvent) {
		let vw = window.innerWidth;
		let vh = window.innerHeight;
		let target = e.currentTarget as HTMLElement;
		let rect = target.getBoundingClientRect();

		// div center
		let centerX = rect.x + rect.width / 2;
		let centerY = rect.y + rect.height / 2;

		// center of screen
		let screenCenterX = vw / 2;
		let screenCenterY = vh / 2;

		// distance from center
		let x = screenCenterX - centerX;
		let y = screenCenterY - centerY;

		// scale
		let scale = Math.min(vw / rect.width, vh / rect.height);

		return { x, y, rotationX: '', rotationY: '', scale, boxShadow: '', zIndex: 12 };
	}

	function selectImage(e: MouseEvent) {
		transformStyle = selectedStyle(e);
		isSelected = true;
		console.log((e.currentTarget as HTMLElement).style);
	}

	function handleMouseEnter(e: MouseEvent) {
		transformStyle = hoverStyle;
		cursorShape.update(() => GLASS_CURSOR_SHAPE);
	}

	function handleLeave(e: MouseEvent) {
		transformStyle = defaultStyle;
		cursorShape.update(() => DEFAULT_CURSOR_SHAPE);
		if (isSelected) {
			isSelected = true;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="imgContainer hoverable"
	class:selected={isSelected}
	style="
		transform: perspective(50em) translate({transformStyle.x}px, {transformStyle.y}px) rotateX({transformStyle.rotationX})  rotateY({transformStyle.rotationY}) scale({transformStyle.scale}) ;
		box-shadow: {transformStyle.boxShadow};
		width: {maxwidth}px;
		z-index: {transformStyle.zIndex} !important;
"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleLeave}
	on:click={selectImage}
	role="complementary"
>
	<img {src} alt={imgAlt} />
</div>

<!-- translate(var(--selected-x), var(--selected-y) )-->

<style lang="scss">
	.imgContainer {
		display: flex;
		place-items: center;
		position: relative;
		box-sizing: border-box;
		border-radius: 17px;
		overflow: hidden;
		box-shadow: rgba(22, 31, 39, 0.8) 0px 10px 20px -10px;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			z-index 0.3s ease;
		z-index: 11;

		img {
			display: block;
			align-self: center;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
