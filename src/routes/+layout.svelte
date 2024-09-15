<!-- layout for all pages in /routes -->

<script lang="ts">
	import SocialIcon from '$lib/components/SocialIcon.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import { mouseMoveEvent } from '$lib/stores/EventBus';

	function handlePointerMove(event: PointerEvent) {
		mouseMoveEvent.set({ x: event.clientX, y: event.clientY });
	}
</script>

<div class="app" on:pointermove={handlePointerMove}>
	<Navbar />
	<Cursor />
	<div class="content">
		<slot></slot>
	</div>
	<div class="footer">
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

<style>
	* {
		cursor: none;
	}
	.app {
		display: flex;
		flex-direction: column;
		font-family: 'Urbanist', sans-serif;
		justify-content: space-between;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		background: #fff;
	}

	.footer {
		display: flex;
		justify-content: left;
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
		padding: 32px;
		box-sizing: border-box;
	}

	.socialIcons {
		display: flex;
		height: auto;
		width: auto;
		gap: 4rem;
	}

	nav {
		padding: 1rem 2rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: auto;
		height: auto;
		position:
			sticky,
			-webkit-sticky;
		box-sizing: border-box;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 100;
	}

	.logo a {
		font-family: 'Playfair Display', serif;
		font-weight: 800;
		font-size: clamp(24px, 5vw, 32px);
		color: rgb(36, 36, 36);
		text-decoration: none;
	}

	.logo a:hover {
		color: black;
	}

	.navLinks {
		display: flex;
	}

	.content {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 32px;
		flex: auto;
		height: auto;
		overflow-y: scroll;
	}
</style>
