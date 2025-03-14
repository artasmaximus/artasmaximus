<!-- Logo.svelte -->
<script lang="ts">
	import { fly } from 'svelte/transition';
	import {
		cursorState,
		DEFAULT_SHAPE,
		DEFAULT_STYLE,
		type CursorPositionParams,
		type CursorShapeParams
	} from '../cursor/CursorState.svelte';
	import HoverEffect from '../cursor/effects/HoverEffect.svelte';
	import LockEffect from '../cursor/effects/LockEffect.svelte';

	// underline the logo on hover
	function hoverShape(contentRect: DOMRect | undefined): CursorShapeParams {
		if (contentRect) {
			const { width, height, top, left } = contentRect;
			return {
				width: width,
				height: 4,
				borderRadius: 2
			};
		}
		return DEFAULT_SHAPE;
	}

	let hoverStyle = DEFAULT_STYLE;

	function lockPos(contentRect: DOMRect | undefined): CursorPositionParams {
		// return the bottom left corner of the logo
		if (contentRect) {
			const { top, left, width, height } = contentRect;
			return {
				x: left + width / 2,
				y: top + height
			};
		}
		return cursorState.getPosition();
	}

	const onclick = cursorState.reset;
</script>

<HoverEffect {hoverShape} {hoverStyle}>
	<LockEffect {lockPos}>
		<button in:fly={{ x: -50, duration: 200, opacity: 0 }} {onclick}>
			<a href="/" class="z-10 cursor-none">
				<div class="text-3xl font-bold">AM</div>
			</a>
		</button>
	</LockEffect>
</HoverEffect>
