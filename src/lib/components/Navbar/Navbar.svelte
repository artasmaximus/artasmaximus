<script lang="ts">
	import Logo from '../Logo.svelte';
	import Socials from '../Socials.svelte';
	import Button from '../Button/Button.svelte';
	import MobileMenu from './MobileMenu.svelte';
	import { navTheme } from './NavbarState.svelte';

	let nav = $state<HTMLElement>();
	let navHeight = $state(0);

	$effect(() => {
		navTheme.height = navHeight;
	});
</script>

<nav
	bind:this={nav}
	bind:clientHeight={navHeight}
	class:dark={navTheme.dark}
	class="sticky left-0 top-0 z-10 flex w-full items-center justify-between bg-none px-[6vw] py-[4vw]"
>
	<div class="gradient-blur pointer-events-none absolute left-0 top-0 h-full w-full">
		<div
			class="z-1 absolute inset-0"
			style="backdrop-filter: blur(1px); mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 90%);"
		></div>
		{#each [1, 3, 10, 18, 36, 64] as blur, i}
			<div
				class="absolute inset-0"
				style="backdrop-filter: blur({blur}px); 
		   mask-image: linear-gradient(
			 to top,
			 rgba(0,0,0,0) {12.5 * (i + 1)}%, 
			 rgba(0,0,0,1) {25 * (i + 1)}%, 
			 rgba(0,0,0,1) {37.5 * (i + 1)}%, 
			 rgba(0,0,0,0) {50 * (i + 1)}%
		   );"
			></div>
		{/each}
	</div>
	<Logo />
	<div class="flex gap-10">
		<div class="hidden flex-row gap-4 lg:flex">
			<a href="/Projects">
				<Button color="#1e1e1e" twclass="px-3 py-1" br={50} border={false}>Projects</Button>
			</a>
			<a href="/Artwork">
				<Button color="#1e1e1e" twclass="px-3 py-1" br={50} border={false}>Artwork</Button>
			</a>
			<a href="/Resume">
				<Button color="#1e1e1e" twclass="px-3 py-1" br={50} border={false}>Resume</Button>
			</a>
		</div>
		<div class="flex items-center gap-10">
			<MobileMenu />
			<Socials />
		</div>
	</div>
</nav>

<style>
	nav {
		transition: color 0.4s ease;
	}

	nav :global(button),
	nav :global(.atSignButton svg path),
	nav :global(.icon-container svg path) {
		transition: color 0.4s ease, fill 0.4s ease;
	}

	/* Logo text and the mobile menu icon use inherited/currentColor, so they
	   follow this automatically. Button text and the social icon SVGs set
	   their own color/fill and need explicit overrides. */
	nav.dark {
		color: #fafafa;
	}

	nav.dark :global(button) {
		color: #fafafa !important;
	}

	nav.dark :global(.atSignButton svg path),
	nav.dark :global(.icon-container svg path) {
		fill: #fafafa !important;
	}
</style>
