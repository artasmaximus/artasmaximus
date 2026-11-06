<script lang="ts">
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import type { CursorStyleParams } from '$lib/cursor/CursorState.svelte';
	import { SocialsInfo } from './IconPaths';
	import { BG, INK } from '$lib/theme';
	const {
		platform,
		bg
	}: {
		platform: string;
		bg: string;
	} = $props();

	let iconInfo = (SocialsInfo as any)[platform];

	let path = iconInfo.path;
	let width = iconInfo.width;
	let height = iconInfo.height;
	let viewBox = iconInfo.viewBox;
	let href = iconInfo.href;

	let hovered = $state(false);
	let fill = $derived.by(() => (hovered ? BG : INK));

	let cursorStyle: CursorStyleParams = {
		background: bg,
		'mix-blend-mode': 'normal',
		'border-color': 'none',
		'backdrop-filter': 'none',
		'z-index': 10
	};

	function onmouseenter() {
		hovered = true;
	}

	function onmouseleave() {
		hovered = false;
	}
</script>

<BubbleEffect padding={4} br={10} {cursorStyle}>
	<a {href} aria-label={platform} target="_blank" rel="noreferrer" {onmouseenter} {onmouseleave}>
		<div class="icon-container">
			<svg xmlns="http://www.w3.org/2000/svg" {width} {height} {viewBox}>
				<path d={path} {fill} style="fill-opacity:1;" />
			</svg>
		</div>
	</a>
</BubbleEffect>

<style>
	.icon-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 18px;
		height: 18px;
		z-index: 3;
	}

	.icon-container svg {
		width: 100%;
		height: 100%;
	}
</style>
