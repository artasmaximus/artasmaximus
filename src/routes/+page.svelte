<script lang="ts">
	import MainContent from '$lib/layout/MainContent.svelte';
</script>

<MainContent />

<style>
	/* Optional: Disable snap scrolling on mobile */
	@media (max-width: 768px) {
		:global(main) {
			scroll-snap-type: none;
		}

		:global(section) {
			scroll-snap-align: none;
		}
	}
</style>
