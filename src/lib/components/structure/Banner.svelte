<script lang="ts">
	export let title: string;
	import { appDetail } from '$lib/stores/appDetail';
	import { slide, type SlideParams } from 'svelte/transition';
</script>

<div class="banner" style="top: {$appDetail.navBarHeight}px" in:slide>
	<div class="bannerConent" style="width: {$appDetail.contentWidth}px;">
		<div class="title">
			{title}
		</div>
	</div>
</div>

<style lang="scss">
	.banner {
		display: flex;
		flex-direction: row;
		place-content: center;
		position: sticky;
		box-sizing: border-box;
		padding: 18px 0px;
		left: 0;
		width: 100%;
		color: #fafafa;
		background: #101010;
		.title {
			font-size: 22px;
			font-weight: 700;
			font-family: 'Urbanist', serif;
		}
		animation: 2s ease-in slidein;
		z-index: 10;
		transition: draw;
	}
</style>
