<script lang="ts">
	import { page } from '$app/stores';
	import { appDetail } from '$lib/stores/appDetail';
	import { createElementMeasureStore } from '$lib/stores/elementMeasure';
	import { afterUpdate } from 'svelte';
	import { slide } from 'svelte/transition';

	import Clickable from '../cursor/Clickable.svelte';
	import Button from '../ui/Button.svelte';

	let isMenuOpen = false;
	let navHeight: number;

	let logoMeasureStore = createElementMeasureStore();

	interface NavbarItem {
		label: string;
		href: string;
	}

	export let items: NavbarItem[] = [
		{ label: 'projects', href: '/projects' },
		{ label: 'illustrations', href: '/illustrations' },
		{ label: 'contact', href: '/contact' },
		{ label: 'resume', href: '/resume' }
	];

	// get current path from store
	$: currPage = $page.url.pathname.split('/')[1];

	function toggleMenu() {
		console.log(`switching menu from ${isMenuOpen} to ${!isMenuOpen}`);
		isMenuOpen = !isMenuOpen;
	}

	afterUpdate(() => {
		$appDetail.navBarHeight = navHeight;
	});
</script>

<nav class="blur" bind:clientHeight={navHeight}>
	<div class="navContent" style="width: {$appDetail.contentWidth}px">
		<Clickable measureStore={logoMeasureStore}>
			<div class="logo" use:logoMeasureStore.underline={{}}>
				<a href="/" class:active={currPage === ''}>{$appDetail.title}</a>
			</div>
		</Clickable>
		{#if $appDetail.collapseNav}
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
					<Button
						href={item.href}
						active={currPage === item.label}
						label={item.label}
						on:click={toggleMenu}
					></Button>
				{/each}
			</div>
		{/if}
	</div>
</nav>
{#if $appDetail.collapseNav && isMenuOpen}
	<div class="mobile-menu blur" in:slide={{ duration: 150 }} out:slide={{ duration: 150 }}>
		{#each items as item}
			<Button
				href={item.href}
				active={currPage === item.label}
				on:click={toggleMenu}
				label={item.label}
			></Button>
		{/each}
	</div>
{/if}

<style>
	.logo {
		font-family: 'Urbanist';
	}

	.logo a {
		text-decoration: none;
		color: #000;
		font-size: 32px;
		font-style: normal;
		font-weight: 800;
		line-height: 93%;
		letter-spacing: -1px;
		cursor: none;
	}
	.blur {
		background: rgba(250, 250, 250, 0.7);
		background: color(display-p3 0.9804 0.9804 0.9804 / 0.7);
		-webkit-backdrop-filter: blur(15px);
		backdrop-filter: blur(15px);
	}
	nav {
		padding: 32px;
		position: sticky;
		box-sizing: border-box;
		top: 0;
		left: 0;
		z-index: 10;
		place-content: center;
		display: flex;
		margin: 0%;
	}

	.navLinks {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		width: auto;
		gap: 50px;
	}

	.navContent {
		height: fit-content;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-shrink: 0;
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
		display: flex;
		flex-direction: column;
		position: fixed;
		place-items: center;
		box-sizing: border-box;
		top: auto;
		right: 0;
		padding: 32px 64px;
		width: fit-content;
		gap: 42px;
		z-index: 10;
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
