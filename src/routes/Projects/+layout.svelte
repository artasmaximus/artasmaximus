<script lang="ts">
	import Section from '$lib/layout/Section.svelte';
	let { children } = $props();
</script>

<Section>
	<div class="flex w-full flex-col items-center gap-24 pb-24 pt-12 md:gap-32 md:pt-0">
		{@render children()}
	</div>
</Section>
