<script lang="ts">
	import Section from '$lib/layout/Section.svelte';
	let { children } = $props();
</script>

<Section>
	{@render children()}
</Section>
