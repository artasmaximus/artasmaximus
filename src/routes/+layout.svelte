<script lang="ts">
	import '../app.css';
	import Background from '$lib/components/Background/Background.svelte';
	import Header from '$lib/layout/Header.svelte';
	import Cursor from '$lib/cursor/Cursor.svelte';
	import { onMount } from 'svelte';
	let { children } = $props();
	let isTouchscreen = $state(false);

	onMount(() => {
		isTouchscreen = navigator.maxTouchPoints > 0;
	});
</script>

<div class="app">
	{#if !isTouchscreen}
		<Cursor />
	{/if}
	<Background dotRadius={35} />
	<Header />
	{@render children()}
</div>

<style>
	:global(body) {
		font-family: 'Outfit', serif;
		font-stretch: condensed;
		font-optical-sizing: auto;
		cursor: none;
	}
</style>
