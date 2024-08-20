<!-- layout for all routes in the page -->
<!-- all pages contain a navigation header -->

<script>
	import Background from '$lib/components/Background.svelte';
</script>

<Background />
<nav>
	<div class="logo">
		<a href="/">artas maximus</a>
	</div>

	<div class="navLinks">
		<a href={'/projects'}>projects</a>
		<a href={'/illustrations'}>illustrations</a>
		<a href={'/contact'}>contact</a>
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
		font-weight: black;
		font-size: clamp(24px, 5vw, 32px);
		color: rgb(36, 36, 36);
		text-decoration: none;
	}

	.logo a:hover {
		color: black;
	}

	.navLinks {
		font-family: 'Urbanist';
		font-weight: 100;
		display: flex;
		gap: 4rem;
	}

	.navLinks a {
		text-decoration: none;
		color: #1a1a1a;
	}

	.navLinks a:hover {
		color: black;
	}
</style>
