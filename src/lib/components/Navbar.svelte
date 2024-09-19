<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import NavLink from './NavLink.svelte';
	import { page } from '$app/stores';

	interface NavbarItem {
		label: string;
		href: string;
	}

	let title = 'artas maximus';
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
		isMenuOpen = false;
	}

	let isMenuOpen = false;
	let isMobile = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	onMount(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				title = 'am';
				isMobile = true;
			} else {
				if (window.innerWidth < 889) {
					title = 'am';
				} else {
					title = 'artas maximus';
				}
				isMobile = false;
				isMenuOpen = false;
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<nav>
	<div class="navContent">
		<div class="logo">
			<a href="/" class:active={currPage === ''}>{title}</a>
		</div>
		{#if isMobile}
			<button class="hamburger" on:click={toggleMenu}>
				<span class="sr-only">Toggle menu</span>
				<div class="hamburger-icon" class:open={isMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</button>
		{:else}
			<div class="navLinks">
				{#each items as item}
					<NavLink href={item.href} active={currPage === item.label} on:click={handleClick}
						>{item.label}</NavLink
					>
				{/each}
			</div>
		{/if}
	</div>
</nav>

{#if isMobile && isMenuOpen}
	<div class="mobile-menu">
		{#each items as item}
			<NavLink href={item.href} active={currPage === item.label} on:click={handleClick}
				>{item.label}</NavLink
			>
		{/each}
	</div>
{/if}

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
		cursor: none;
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
		gap: auto;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
	}

	.hamburger {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.hamburger-icon {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 24px;
		height: 24px;
	}

	.hamburger-icon span {
		display: block;
		width: 100%;
		height: 2px;
		background-color: #000;
		transition: all 0.3s ease-in-out;
	}

	.hamburger-icon.open span:nth-child(1) {
		transform: translateY(8px) rotate(45deg);
	}

	.hamburger-icon.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger-icon.open span:nth-child(3) {
		transform: translateY(-8px) rotate(-45deg);
	}

	.mobile-menu {
		position: relative;
		top: 0px;
		left: 0;
		right: 0;
		width: auto;
		/* margin: 32px; */
		box-sizing: border-box;
		background: rgba(250, 250, 250, 0.5);
		backdrop-filter: blur(15px);
		padding: 32px 20px;
		display: flex;
		flex-direction: column;
		gap: 30px;
		/* border-radius: 15px;
		border: 1px solid rgba(219, 219, 219, 0.5);
		border: 1px solid color(display-p3 0.8587 0.8587 0.8587 / 0.5); */
		box-shadow: inset 0 30px 30px -35px rgba(0, 0, 0, 0.1);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	@media (min-width: 768px) {
		.navLinks {
			gap: 32px;
		}
	}
</style>
