<script lang="ts">
	import '@fontsource-variable/inter/opsz.css';
	import '../app.css';
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import Cursor from '$lib/cursor/Cursor.svelte';
	import { cursorState } from '$lib/cursor/CursorState.svelte';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children } = $props();
	let hasFinePointer = $state(false);

	onMount(() => {
		hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		document.documentElement.classList.toggle('custom-cursor', hasFinePointer);
	});

	// The hovered element is gone after navigating, so its mouseleave never fires.
	afterNavigate(() => cursorState.reset());
</script>

<div class="app overflow-x-clip">
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-small focus:text-bg"
	>
		Skip to content
	</a>
	{#if hasFinePointer}
		<Cursor />
	{/if}
	<Header />
	<main id="main" tabindex="-1" class="outline-none">
		{@render children()}
	</main>
	<Footer />
</div>
