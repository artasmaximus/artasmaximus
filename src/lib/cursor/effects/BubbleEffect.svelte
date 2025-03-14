<script lang="ts">
	import {
		cursorState,
		DEFAULT_SHAPE,
		type CursorShapeParams,
		type CursorStyleParams
	} from '../CursorState.svelte';
	import HoverEffect from './HoverEffect.svelte';
	import LockEffect from './LockEffect.svelte';

	const {
		children,
		padding,
		br,
		cursorStyle,
		twclass
	}: {
		children: () => any;
		padding: number;
		br: number;
		cursorStyle: CursorStyleParams;
		twclass?: string;
	} = $props();

	function getShape(contentRect?: DOMRect): CursorShapeParams {
		if (contentRect) {
			return {
				width: contentRect.width + padding * 2,
				height: contentRect.height + padding * 2,
				borderRadius: br
			};
		}
		return DEFAULT_SHAPE;
	}

	function getCenter(contentRect?: DOMRect) {
		if (!contentRect) return { x: 0, y: 0 };
		return {
			x: contentRect.left + contentRect.width / 2,
			y: contentRect.top + contentRect.height / 2
		};
	}
</script>

<HoverEffect hoverShape={getShape} hoverStyle={cursorStyle} twclass={'w-fit'}>
	<LockEffect lockPos={getCenter} twclass={twclass ?? ''}>
		{@render children()}
	</LockEffect>
</HoverEffect>
