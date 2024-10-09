<script lang="ts">
	import { appDetail } from '$lib/stores/appDetail';
	import arcdbg from '$lib/assets/arcdPage/arcdbg.png';
</script>

<div class="bg" style="top: {$appDetail.navBarHeight}">
	<img src={arcdbg} alt="arcdbg" />
</div>

<style lang="scss">
	.bg {
		position: fixed;
		top: auto;
		left: 0;
		width: 100%;
		max-height: 100%;
		z-index: 1;
		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}
</style>
