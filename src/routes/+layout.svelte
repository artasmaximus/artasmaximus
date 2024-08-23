<!-- layout for all routes in the page -->
<!-- all pages contain a navigation header -->

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import SocialIcon from '$lib/components/SocialIcon.svelte';
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';

	$: currPage = $page.url.pathname.split('/')[1];
</script>

<div class="app">
	<Background />
	<nav id="navbar">
		<div class="logo">
			<a href="/">artas maximus</a>
		</div>

		<div class="navLinks">
			<Link href={'/projects'} active={currPage === 'projects'}>projects</Link>
			<Link href={'/illustrations'} active={currPage === 'illustrations'}>illustrations</Link>
			<Link href={'/contact'} active={currPage === 'contact'}>contact</Link>
		</div>
	</nav>
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
	.app {
		display: flex;
		flex-direction: column;
		font-family: 'Urbanist', sans-serif;
		justify-content: space-between;
		height: 100vh;
	}

	.footer {
		display: flex;
		justify-content: left;
		width: auto;
		height: auto;
		padding: 32px;
	}

	.socialIcons {
		display: flex;
		gap: 3rem;
	}

	nav {
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
		height: auto;
	}
</style>
