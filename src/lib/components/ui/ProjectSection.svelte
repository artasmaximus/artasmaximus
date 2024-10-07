<script lang="ts">
	import { appDetail } from '$lib/stores/appDetail';
	export let title: string = '';
	export let description: string[] = [];
	export let layout: 'L' | 'R' = 'L';
	export let imageSrc: any;
	export let maxImageHeight: number = 300;
	export let maxImageWidth: number = 400;

	let RLayout = 'grid-template-columns: 3fr 4fr; grid-template-rows: 1fr';
	let LLayout = 'grid-template-columns: 4fr 3fr; grid-template-rows: 1fr';
	let mobileLayout = 'grid-template-rows: 1fr 1fr; grid-template-columns: 1fr';
	$: isTooSmall = $appDetail.vw < 700;
</script>

{#if isTooSmall}
	<div class="wrapper" style="width: {$appDetail.contentWidth}px; {mobileLayout};">
		<div class="image" style="max-height: {maxImageHeight}px; max-width: {maxImageWidth}px;">
			<img src={imageSrc} alt={title} />
		</div>
		<div class="info">
			<h2>{title}</h2>
			{#each description as desc}
				<p>{desc}</p>
			{/each}
		</div>
	</div>
{:else if layout === 'L'}
	<div class="wrapper" style="width: {$appDetail.contentWidth}px; {LLayout}">
		<div class="info">
			<h2>{title}</h2>
			{#each description as desc}
				<p>{desc}</p>
			{/each}
		</div>
		<div class="image" style="max-height: {maxImageHeight}px; max-width: {maxImageWidth}px;">
			<img src={imageSrc} alt={title} />
		</div>
	</div>
{:else if layout === 'R'}
	<div class="wrapper" style="width: {$appDetail.contentWidth}px; {RLayout}">
		<div class="image" style="max-height: {maxImageHeight}px; max-width: {maxImageWidth}px;">
			<img src={imageSrc} alt={title} />
		</div>
		<div class="info">
			<h2>{title}</h2>
			{#each description as desc}
				<p>{desc}</p>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.wrapper {
		display: grid;
		align-items: center; // Vertically align the content
		justify-items: center;
	}

	.info {
		h {
			color: #000;
			color: color(display-p3 0 0 0);
			font-family: Urbanist;
			font-size: 32px;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
		}
		p {
			max-width: 430px; // Limit the width of the text
			color: #000;
			color: color(display-p3 0 0 0);
			font-family: Urbanist;
			font-size: 16px;
			font-style: normal;
			font-weight: 300;
			line-height: normal;
			letter-spacing: 0.6px;
		}
	}

	.image {
		display: block;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	.image img {
		height: 100%;
		width: 100%;
		object-fit: contain; // Scale the image to fit within the container
	}
</style>
