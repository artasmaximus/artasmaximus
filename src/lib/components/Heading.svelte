<script lang="ts">
	import { textCursor, type CursorShapeParams } from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import { INK, SURFACE } from '$lib/theme';

	let {
		as = 'h1',
		size = 'title',
		light = false,
		twclass = '',
		children
	}: {
		as?: 'h1' | 'h2' | 'h3';
		size?: 'display' | 'title' | 'heading';
		/* For headings on a dark ground. */
		light?: boolean;
		twclass?: string;
		children: () => any;
	} = $props();

	const sizes = { display: 'text-display', title: 'text-title', heading: 'text-heading' };

	let el = $state<HTMLElement>();
	let cursorColor = $derived(light ? SURFACE : INK);

	// The cursor becomes a text caret one line tall, however many lines wrap.
	function hoverShape(): CursorShapeParams {
		const lineHeight = el ? parseFloat(getComputedStyle(el).lineHeight) : 40;
		return textCursor(cursorColor, 3, lineHeight).shape;
	}
	let hoverStyle = $derived(textCursor(cursorColor, 3, 40).style);
</script>

<HoverEffect {hoverShape} {hoverStyle} twclass="w-fit">
	<svelte:element
		this={as}
		bind:this={el}
		class="{sizes[size]} text-balance {light ? 'text-white' : 'text-ink'} {twclass}"
	>
		{@render children()}
	</svelte:element>
</HoverEffect>
