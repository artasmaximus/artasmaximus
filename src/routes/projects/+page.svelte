<script lang="ts">
	import Heading from '$lib/components/Heading.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ProjectList from '$lib/components/Project/ProjectList.svelte';
</script>

<Seo title="Projects" description="Design and engineering projects by Artas Alajbegu." />

<div class="flex flex-col gap-16">
	<Heading>Projects</Heading>
	<ProjectList />
</div>
