<!-- Navbar component -->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import NavLink from './NavLink.svelte';
	import { page } from '$app/stores';

	interface NavbarItem {
		label: string;
		href: string;
	}

	export let title = 'artas maximus';
	export let items: NavbarItem[] = [
		{ label: 'projects', href: '/projects' },
		{ label: 'illustrations', href: '/illustrations' },
		{ label: 'contact', href: '/contact' }
	];

	// get current path from store
	$: currPage = $page.url.pathname.split('/')[1];

	const dispatch = createEventDispatcher();

	function handleClick(item: any) {
		dispatch('click', item);
	}
</script>

<nav>
	<div class="wrapper">
		<div class="navContent">
			<div class="logo">
				<a href="/" class:active={currPage === ''}>{title}</a>
			</div>
			<div class="navLinks">
				{#each items as item}
					<NavLink href={item.href} active={currPage === item.label} on:click={handleClick}
						>{item.label}</NavLink
					>
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.logo {
		font-family: 'Playfair Display';
	}

	.logo a {
		text-decoration: none;
		color: #000;
		font-size: 24px;
		font-style: normal;
		font-weight: 800;
		line-height: 93%;
		letter-spacing: -1.6px;
		/* cursor: none; */
	}

	.navLinks {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: auto;
		gap: 50px;
	}

	.navContent {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		padding: 18px 24px;
		border-radius: 15px;
		border: 1px solid rgba(219, 219, 219, 0.5);
		border: 1px solid color(display-p3 0.8587 0.8587 0.8587 / 0.5);
		background: rgba(250, 250, 250, 0.5);
		background: color(display-p3 0.9804 0.9804 0.9804 / 0.5);
		backdrop-filter: blur(15px);
	}

	@media (min-width: 768px) {
		.navLinks {
			gap: 32px;
		}
		.navContent {
			gap: 30vw;
		}
	}

	@media (max-width: 768px) {
		.wrapper {
			padding: 0px 32px 0px 32px;
		}
		.navLinks {
			gap: 32px;
		}
		.navContent {
			gap: 20vw;
		}
	}

	@media (max-width: 480px) {
		.wrapper {
			padding: 0px 16px 0px 16px;
		}
		.navLinks {
			gap: 16px;
		}
		.navContent {
			gap: 10vw;
		}
	}

	nav {
		display: flex;
		flex-direction: row;
		place-content: center;
		margin: 0;
		padding: 32px;
		background-color: none;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
	}
</style>
