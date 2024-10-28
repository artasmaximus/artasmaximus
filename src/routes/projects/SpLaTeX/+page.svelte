<script>
	import Banner from '$lib/components/structure/Banner.svelte';
</script>

<Banner title="SpLaTeX" />
<div class="wrapper">
	<div class="greeting">Curious about SpLaTeX?</div>
	<p>Don't worry, I'm working on this page right now! Check back soon for more information.</p>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 64px;
	}

	.greeting {
		font-size: 24px;
		font-weight: 600;
	}
</style>
