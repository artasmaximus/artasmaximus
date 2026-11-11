<script lang="ts">
	import Navbar from '../components/Navbar/Navbar.svelte';
	import { navTheme } from '../components/Navbar/NavbarState.svelte';
</script>

<Navbar />
<!-- The bar is fixed so it can hide; this keeps its space on ordinary pages. -->
{#if !navTheme.overlay}
	<div aria-hidden="true" style:height="{navTheme.height}px"></div>
{/if}
