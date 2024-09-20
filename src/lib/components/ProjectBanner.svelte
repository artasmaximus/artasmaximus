<script lang="ts">
	export let title: string;
</script>

<div class="container">
	<div class="bannerFullWidth"></div>
	<div class="bannerNavWidth">
		<p>{title}</p>
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
	}

	.bannerFullWidth {
		width: 100%;
		height: 50px; /* Adjust the height as needed */
		background-color: darkgray;
	}

	.bannerNavWidth {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px; /* Adjust the height to match .bannerFullWidth */
		display: flex;
		align-items: center;
		padding-left: 32px; /* Adjust the padding to match the navigation content start */
	}

	.bannerNavWidth p {
		margin: 0;
		color: white; /* Adjust the text color as needed */
	}
</style>
