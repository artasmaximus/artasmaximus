<!-- Logo.svelte -->
<script lang="ts">
	import '@fontsource-variable/urbanist/wght.css';
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
			return {
				width: contentRect.width,
				height: 3,
				borderRadius: 2
			};
		}
		return DEFAULT_SHAPE;
	}

	let hoverStyle = DEFAULT_STYLE;

	function lockPos(contentRect: DOMRect | undefined): CursorPositionParams {
		// return the bottom center of the logo
		if (contentRect) {
			const { top, left, width, height } = contentRect;
			return {
				x: left + width / 2,
				y: top + height
			};
		}
		return { x: cursorState.position.current.x, y: cursorState.position.current.y };
	}
</script>

<HoverEffect {hoverShape} {hoverStyle}>
	<LockEffect {lockPos}>
		<a href="/" aria-label="Artas Alajbegu, home" class="block font-logo text-heading font-semibold"
			>AA</a
		>
	</LockEffect>
</HoverEffect>
