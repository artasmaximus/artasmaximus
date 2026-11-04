<script lang="ts">
	import { LINK_CURSOR_SHAPE, LINK_CURSOR_STYLE } from '../CursorState.svelte';
	import HoverEffect from './HoverEffect.svelte';

	// Anything clickable that isn't a button gets the pulsing ring, so the whole
	// target reads as a link without the pointer having to find an arrow.
	let { children, twclass = '' }: { children: () => any; twclass?: string } = $props();
</script>

<HoverEffect hoverShape={() => LINK_CURSOR_SHAPE} hoverStyle={LINK_CURSOR_STYLE} {twclass}>
	{@render children()}
</HoverEffect>
