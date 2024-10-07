<script lang="ts">
	import arcdbg from '$lib/assets/arcdpage/arcdbg.png';
</script>

<div class="bg">
	<img src={arcdbg} alt="arcdbg" />
</div>

<style lang="scss">
	.bg {
		position: fixed;
		top: auto;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
