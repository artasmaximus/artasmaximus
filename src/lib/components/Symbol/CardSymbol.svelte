<script lang="ts">
	import {
		type CursorShapeParams,
		DEFAULT_STYLE,
		GLASS_CURSOR_SHAPE,
		GLASS_CURSOR_STYLE,
		cursorState
	} from '$lib/cursor/CursorState.svelte.ts';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import type { Suit } from './CardSymbol.svelte.ts';
	import { onMount } from 'svelte';

	let { suit }: { suit: Suit } = $props();
	let src = $state<any>();
	let solidsrc = $state<any>();

	onMount(async () => {
		let file = `${suit}`;
		let filesolid = `${suit} Solid`;
		src = (await import(`$lib/assets/arcdpics/symbols/${file}.png`)).default;
		solidsrc = (await import(`$lib/assets/arcdpics/symbols/${filesolid}.png`)).default;
		console.log(document.getElementById('custom-cursor'));
	});

	const hoverShape = (): CursorShapeParams => ({
		...GLASS_CURSOR_SHAPE,
		width: 80,
		height: 80,
		borderRadius: 40
	});

	let pos = $derived(cursorState.getPosition());
</script>

<HoverEffect {hoverShape} hoverStyle={{ ...DEFAULT_STYLE, background: 'none' }}>
	<div class="relative">
		<img {src} alt={suit} class="aspect-square h-fit w-fit" />
		<img
			src={solidsrc}
			alt="{suit} Solid"
			class="absolute inset-0 aspect-square h-fit w-fit"
			style="mask: radial-gradient(circle at {cursorState.getPosition()
				.x}px {cursorState.getPosition().y}px, black 0%, transparent 40px)"
		/>
	</div>
</HoverEffect>
