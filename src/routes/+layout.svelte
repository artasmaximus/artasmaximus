<!-- layout for all pages in /routes -->

<script lang="ts">
	import SocialIcon from '$lib/components/SocialIcon.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import { mouseMoveEvent } from '$lib/stores/EventBus';
	import { onMount } from 'svelte';

	function handlePointerMove(event: PointerEvent) {
		mouseMoveEvent.set({ mousex: event.clientX, mousey: event.clientY });
	}

	let horizontalPadding: number = 32;

	function handleResize(e: any) {
		let windowWidth = window.innerWidth;

		if (windowWidth <= 576) {
			horizontalPadding = windowWidth * 0.1;
		} else if (windowWidth <= 768) {
			horizontalPadding = windowWidth * 0.15;
		} else {
			horizontalPadding = windowWidth * 0.2;
		}
	}

	onMount(() => {
		handleResize(null);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="app" on:pointermove={handlePointerMove}>
	<Cursor />
	<div class="navigation" style="--hpadding: 32px {horizontalPadding}px"><Navbar /></div>
	<div class="content" style="--hpadding: 32px {horizontalPadding}px">
		<slot></slot>
	</div>
	<div class="footer" style="--hpadding: 32px {horizontalPadding}px">
		<div class="socialIcons">
			<SocialIcon
				iconName="facebook"
				href="https://www.facebook.com/profile.php?id=100009427889455"
			/>
			<SocialIcon iconName="github" href="https://github.com/artasmaximus" />
			<SocialIcon iconName="instagram" href="https://www.instagram.com/artasmaximus.a" />
			<SocialIcon iconName="linkedin" href="https://www.linkedin.com/in/artasalajbegu/" />
		</div>
	</div>
</div>

<style lang="scss">
	* {
		/* cursor: none; */
		::-webkit-scrollbar {
			display: none;
		}
		scrollbar-width: 0px;
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
	}

	.footer {
		display: flex;
		justify-content: right;
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: var(--hpadding);
	}

	.socialIcons {
		display: flex;
		height: auto;
		width: auto;
		gap: 4rem;
	}

	.content {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: fit-content;
		place-content: center;
		place-items: center;
		position: relative;
		padding: var(--hpadding);
	}

	.navigation {
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		z-index: 100;
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: space-between;
		flex-shrink: 0;
		background: rgba(250, 250, 250, 0.5);
		background: color(display-p3 0.9804 0.9804 0.9804 / 0.5);
		-webkit-backdrop-filter: blur(15px);
		backdrop-filter: blur(15px);
		padding: var(--hpadding);
	}
</style>
