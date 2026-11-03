<script lang="ts">
	import { GLASS_CURSOR_SHAPE, GLASS_CURSOR_STYLE } from '../CursorState.svelte';
	import HoverEffect from './HoverEffect.svelte';

	// Every image on the site uses the same cursor: a glass circle.
	let { children, twclass = '' }: { children: () => any; twclass?: string } = $props();
</script>

<HoverEffect hoverShape={() => GLASS_CURSOR_SHAPE} hoverStyle={GLASS_CURSOR_STYLE} {twclass}>
	{@render children()}
</HoverEffect>
