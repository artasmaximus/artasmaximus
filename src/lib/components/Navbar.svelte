<!-- Navbar component -->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import NavLink from './NavLink.svelte';
	import Clickable from './Clickable.svelte';
	import { page } from '$app/stores';

	interface NavbarItem {
		label: string;
		href: string;
	}

	let logoClickableOptions = { padding_x: 16, padding_y: 8, borderRadius: '15px' };

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
		<div class="navWrapper">
			<div class="navContent">
				<div class="logo">
					<Clickable options={logoClickableOptions}>
						<a href="/">{title}</a>
					</Clickable>
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
		<div class="border"></div>
	</div>
</nav>

<style>
	.logo {
		font-family: 'Playfair Display';
	}
	.logo a {
		text-decoration: none;
		color: #000;
		color: color(display-p3 0 0 0);
		font-size: 32px;
		font-style: normal;
		font-weight: 800;
		line-height: 93%;
		letter-spacing: -1.6px;
		cursor: none;
	}

	.navLinks {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: auto;
		gap: 50px;
	}

	.navWrapper {
		display: flex;
		width: 100%;
		height: 100px;
		padding: 0px 64px 0px 64px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.navContent {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 50px;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		padding: 32px 32px;
	}

	@media (max-width: 768px) {
		.navWrapper {
			padding: 0px 32px 0px 32px;
		}
		.navLinks {
			gap: 32px;
		}
		.logo a {
			font-size: 24px;
		}
	}

	@media (max-width: 480px) {
		.navWrapper {
			padding: 0px 16px 0px 16px;
		}
		.navLinks {
			gap: 16px;
		}
		.logo a {
			font-size: 20px;
		}
	}

	.border {
		width: 100%;
		height: 1px;
		background: linear-gradient(to right, #fff, #000, #fff);
		mix-blend-mode: normal;
	}

	nav {
		display: flex;
		flex-direction: row;
		place-content: center;
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
