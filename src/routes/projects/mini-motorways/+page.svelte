<script>
	import Banner from '$lib/components/structure/Banner.svelte';
</script>

<Banner title="mini motorways" />
<div class="wrapper">
	<div class="greeting">Curious about mini motorways?</div>
	<iframe
		width="560"
		height="315"
		src="https://www.youtube.com/embed/GaAHKJQ6lcY?si=APNiv8m1zAWHF0sK"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
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

	iframe {
		margin-top: 32px;
	}
</style>
