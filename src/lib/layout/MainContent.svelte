<script lang="ts">
	import Showcase from '$lib/sections/Showcase.svelte';
	import Landingpage from '../sections/Landingpage.svelte';
</script>

<main class="h-full snap-y snap-mandatory gap-24 overflow-y-auto overflow-x-hidden scroll-smooth">
	<Landingpage />
	<Showcase />
</main>

<style>
	main::-webkit-scrollbar {
		display: none;
	}
	main {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
