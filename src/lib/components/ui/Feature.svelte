<script lang="ts">
	export let imgSrc: any;
	export let title: string;
	export let description: string;
</script>

<div class="feature">
	<div class="feature-img">
		<img src={imgSrc} alt={title} />
	</div>
	<div class="feature-content">
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
</div>

<style lang="scss">
	.feature {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 16px;
		margin-bottom: 32px;
		.feature-img {
			max-height: 250px;
			width: 100%;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		.feature-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8px;
			text-align: center;
			width: 300px;
			h3 {
				font-size: 24px;
				font-weight: 700;
				font-family: 'Urbanist', serif;
			}
			p {
				font-size: 16px;
				font-weight: 400;
				font-family: 'Urbanist', serif;
			}
		}
	}
</style>
