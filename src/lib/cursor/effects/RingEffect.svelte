<script lang="ts">
	import { cursorState, ringCursor } from '../CursorState.svelte';

	let {
		accent = '#1e1e1e',
		size = 32,
		children,
		twclass = ''
	}: {
		accent?: string;
		size?: number;
		children: () => any;
		twclass?: string;
	} = $props();

	let hovered = $state(false);

	function onmouseenter() {
		hovered = true;
	}

	function onmouseleave() {
		hovered = false;
		cursorState.isHovering = false;
		cursorState.reset();
	}

	// Applying via effect (not just the enter handler) keeps the ring tint live
	// if the accent changes mid-hover, e.g. a dominant color resolving async.
	$effect(() => {
		if (!hovered) return;
		const { shape, style } = ringCursor(accent, size);
		cursorState.isHovering = true;
		cursorState.setShape(shape);
		cursorState.setStyle(style);
	});
</script>

<div {onmouseenter} {onmouseleave} class="ringEffect {twclass}" role="presentation">
	{@render children()}
</div>

<style>
	.ringEffect {
		display: block;
		position: relative;
	}
</style>
