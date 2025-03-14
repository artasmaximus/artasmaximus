<script lang="ts">
	export let open = false;
</script>

<svg
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if open}
		<path d="M18 6L6 18M6 6l12 12" />
	{:else}
		<path d="M4 6h16M4 12h16M4 18h16" />
	{/if}
</svg>
