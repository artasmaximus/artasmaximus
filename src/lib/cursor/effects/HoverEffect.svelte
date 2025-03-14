<script lang="ts">
	import {
		cursorState,
		DEFAULT_SHAPE,
		DEFAULT_STYLE,
		type CursorShapeParams,
		type CursorStyleParams
	} from '../CursorState.svelte';

	const {
		hoverShape = () => DEFAULT_SHAPE,
		hoverStyle = DEFAULT_STYLE,
		children,
		twclass
	}: {
		hoverShape: (contentRect?: DOMRect | undefined) => CursorShapeParams;
		hoverStyle: CursorStyleParams;
		children: () => any;
		twclass?: string;
	} = $props();

	let hoverEffect: HTMLElement;
	let contentRect = $state<DOMRect>();

	$effect(() => {
		if (hoverEffect) {
			contentRect = hoverEffect.getBoundingClientRect();
		}
	});

	function onmouseleave() {
		cursorState.isHovering = false;
		cursorState.reset();
	}

	function onmouseenter() {
		cursorState.isHovering = true;
		cursorState.shape.target = hoverShape(contentRect);
		cursorState.setStyle(hoverStyle);
	}
</script>

<div
	bind:this={hoverEffect}
	{onmouseenter}
	{onmouseleave}
	class="hoverEffect {twclass ?? ''}"
	role="complementary"
>
	{@render children()}
</div>

<style>
	.hoverEffect {
		display: block;
		position: relative;
	}
</style>
