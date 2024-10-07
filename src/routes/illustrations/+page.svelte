<script lang="ts">
	import IllustrationGrid from '$lib/components/ui/IllustrationGrid.svelte';
	import { appDetail } from '$lib/stores/appDetail';

	const images = Array.from({ length: 14 }, (_, i) => ({
		src: `Art${i + 1}`,
		alt: `Art ${i + 1}`
	}));
</script>

<div class="wrapper" style="width: {$appDetail.contentWidth}px">
	<div class="hero">
		<h1>Illustrations</h1>
		<p>
			From rough sketches to longer studies, each illustration was crafted with care using Procreate
			on iPad Pro with Apple Pencil.
		</p>
	</div>
	<IllustrationGrid {images} />
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-items: space-around;
	}

	.hero {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		gap: 25px;
		padding: 120px 0px;
		text-align: center;
		h1 {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 42px;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			letter-spacing: -2px;
		}

		p {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 24px;
			font-style: normal;
			font-weight: 300;
			line-height: normal;
			letter-spacing: -0.24px;
			width: 80%;
			margin: 0;
		}
	}

	p {
		max-width: 500px;
	}
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		place-items: center;
		gap: 80px;
	}

	@media (max-width: 768px) {
		.grid-container {
			gap: 30px;
		}
	}
</style>
