<script lang="ts">
	import { textCursor, type CursorShapeParams } from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import { INK } from '$lib/theme';

	let {
		as = 'h1',
		size = 'title',
		twclass = '',
		children
	}: {
		as?: 'h1' | 'h2' | 'h3';
		size?: 'display' | 'title' | 'heading';
		twclass?: string;
		children: () => any;
	} = $props();

	const sizes = { display: 'text-display', title: 'text-title', heading: 'text-heading' };

	let el = $state<HTMLElement>();

	// The cursor becomes a text caret one line tall, however many lines wrap.
	function hoverShape(): CursorShapeParams {
		const lineHeight = el ? parseFloat(getComputedStyle(el).lineHeight) : 40;
		return textCursor(INK, 3, lineHeight).shape;
	}
	const hoverStyle = textCursor(INK, 3, 40).style;
</script>

<HoverEffect {hoverShape} {hoverStyle} twclass="w-fit">
	<svelte:element this={as} bind:this={el} class="{sizes[size]} text-balance text-ink {twclass}">
		{@render children()}
	</svelte:element>
</HoverEffect>
