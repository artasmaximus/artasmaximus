<!-- layout for all routes in the page -->
<!-- all pages contain a navigation header -->

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import { page } from '$app/stores';

	$: currPage = $page.url.pathname.split('/')[1];
	console.log(currPage);
</script>

<Background />
<nav>
	<div class="logo">
		<a href="/">artas maximus</a>
	</div>

	<div class="navLinks">
		<a href={'/projects'} class:active={currPage === 'projects'}>projects</a>
		<a href={'/illustrations'} class:active={currPage === 'illustrations'}>illustrations</a>
		<a href={'/contact'} class:active={currPage === 'contact'}>contact</a>
	</div>
</nav>
<slot></slot>

<style>
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
		font-family: 'Urbanist';
		font-weight: 300;
		display: flex;
		gap: 4rem;
	}

	.navLinks a {
		text-decoration: none;
		color: #1a1a1a;
		font-weight: 300;
		min-width: 100px; /* Adjust this value to match the longest link */
		display: inline-block; /* Ensure that the min-width applies correctly */
		text-align: center; /* Optional: to center the text within the block */
		transition:
			font-weight 0.07s ease-in,
			color 0.07s ease-in-out,
			letter-spacing 0.07s ease-in-out;
	}

	.navLinks a.active {
		font-weight: 700;
	}

	.navLinks a:hover {
		color: black;
	}
</style>
