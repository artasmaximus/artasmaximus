<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { page } from '$app/stores';

	$: currProject = $page.url.pathname.split('/')[2];
</script>

<div class="projectsContainer" id="projectsContainer">
	<div class="projectLinks">
		<Link href={'/projects/arcd'} active={currProject === 'arcd'}>arcd</Link>
		<Link href={'/projects/SpLaTeX'} active={currProject === 'SpLaTeX'}>SpLaTeX</Link>
		<Link href={'/projects/BoomFit'} active={currProject === 'BoomFit'}>Boom Fit</Link>
		<Link href={'/projects/ContentWrangling'} active={currProject === 'ContentWrangling'}
			>Content Wrangling</Link
		>
	</div>
	<div class="projectContent">
		<slot></slot>
	</div>
</div>

<style>
	.projectsContainer {
		display: flex;
		flex: 1;
		height: 100%;
		overflow-y: scroll;
		flex-direction: row;
		place-content: center;
	}

	.projectLinks {
		display: flex;
		flex-direction: column;
		width: 20%; /* Fixed width to ensure stability */
		gap: 1rem;
		border-right: 1px solid black;
		padding: 2rem;
	}

	.projectContent {
		width: 80%; /* Takes up the remaining space */
		padding: 2rem;
	}
</style>
