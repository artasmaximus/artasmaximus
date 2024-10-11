<!-- layout for all pages in /routes -->

<script lang="ts">
	import { cursorPosition, customCursorPosition, isCursorHovered } from '$lib/stores/cursor';
	import { appDetail, isTouchInputDevice } from '$lib/stores/appDetail';
	import { onMount } from 'svelte';

	// components
	import Navbar from '$lib/components/structure/Navbar.svelte';
	import Footer from '$lib/components/structure/Footer.svelte';
	import Cursor from '$lib/components/cursor/Cursor.svelte';
	import Background from '$lib/components/structure/Background.svelte';

	function onPointerMove(event: any) {
		if (!$isCursorHovered) {
			cursorPosition.set({
				x: event.clientX,
				y: event.clientY
			});
		}

		// if (!$isCursorHovered) {
		// 	$customCursorPosition.x.set($cursorPosition.x);
		// 	$customCursorPosition.y.set($cursorPosition.y);
		// }
	}

	function handleResize(e: any) {
		$appDetail.vw = window.innerWidth;
		$appDetail.vh = window.innerHeight;

		let windowWidth = window.innerWidth;
		if (windowWidth < 700) {
			$appDetail.contentWidth = windowWidth * 0.9;
			$appDetail.title = 'am';
			$appDetail.collapseNav = true;
		} else if (windowWidth < 768) {
			$appDetail.contentWidth = windowWidth * 0.9;
			$appDetail.title = 'am';
			$appDetail.collapseNav = false;
		} else if (windowWidth < 1024) {
			$appDetail.contentWidth = windowWidth * 0.9;
			$appDetail.title = 'artas maximus';
			$appDetail.collapseNav = false;
		} else {
			$appDetail.contentWidth = Math.min(windowWidth * 0.7, 1400);
			$appDetail.title = 'artas maximus';
			$appDetail.collapseNav = false;
		}
	}

	onMount(() => {
		handleResize(null);
		window.addEventListener('resize', handleResize);
		$appDetail.isTouchInput = isTouchInputDevice();
	});
</script>

<div class="app" on:pointermove={onPointerMove}>
	<Background />
	{#if !$appDetail.isTouchInput}
		<Cursor />
	{/if}
	<div class="topOfPage">
		<Navbar />
		<div class="content">
			<slot></slot>
		</div>
	</div>
	<Footer />
</div>

<style lang="scss">
	* {
		cursor: none;
	}

	.app {
		display: flex;
		flex-direction: column;
		font-family: 'Urbanist', sans-serif;
		justify-content: space-between;
		min-height: 100vh;
		width: 100%;
		box-sizing: border-box;
		background: #fff;
		scroll-behavior: smooth;
	}

	.content {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: fit-content;
		place-content: center;
		place-items: center;
		position: relative;
		z-index: 1;
	}
</style>
