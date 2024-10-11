<script lang="ts">
	let isViewing = false;

	let defaultStyle = {
		x: 0,
		y: 0,
		scale: 1
	};

	let transformStyle = defaultStyle;

	function selectedStyle(e: MouseEvent) {
		let vw = window.innerWidth;
		let vh = window.innerHeight;
		let target = e.currentTarget as HTMLElement;
		let rect = target.getBoundingClientRect();

		// div center
		let centerX = rect.x + rect.width / 2;
		let centerY = rect.y + rect.height / 2;

		// center of screen
		let screenCenterX = vw / 2;
		let screenCenterY = vh / 2;

		// distance from center
		let x = screenCenterX - centerX;
		let y = screenCenterY - centerY;

		// scale
		let scale = Math.min(vw / rect.width, vh / rect.height);

		return { x, y, scale };
	}

	function selectImage(e: MouseEvent) {
		transformStyle = selectedStyle(e);
		isViewing = true;
	}

	function deselectImage() {
		transformStyle = defaultStyle;
		isViewing = false;
	}
</script>

{#if isViewing}
	<div class="dimmedOverlay" style="z-index: {isViewing ? 200 : -10}"></div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="content" on:click={selectImage}>
	{#if isViewing}
		<div class="closeButton">
			<button on:click={deselectImage}>Close</button>
		</div>
	{/if}
	<slot name="media" class="block" style="z-index: {isViewing ? 201 : 'inherit'}"></slot>
</div>

<style>
	.closeButton {
		position: relative;
		z-index: 10;
		top: 20px;
		right: 20px;
	}

	.block {
		display: block;
	}
</style>
