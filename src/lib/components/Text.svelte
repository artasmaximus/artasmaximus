<script lang="ts">
	import {
		textCursorShape,
		textCursorStyle,
		type CursorShapeParams
	} from '$lib/cursor/CursorState.svelte';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import { INK, INK_MUTED, INK_SUBTLE, SURFACE } from '$lib/theme';

	// One tone sets the text color and the caret color, so they always match.
	const tones = {
		ink: { cls: 'text-ink', color: INK },
		muted: { cls: 'text-ink-muted', color: INK_MUTED },
		subtle: { cls: 'text-ink-subtle', color: INK_SUBTLE },
		light: { cls: 'text-white', color: SURFACE },
		lightMuted: { cls: 'text-white/70', color: 'rgba(255, 255, 255, 0.7)' }
	};

	let {
		as = 'p',
		tone = 'ink',
		twclass = '',
		wrapClass = 'w-fit',
		children
	}: {
		as?: keyof HTMLElementTagNameMap;
		tone?: keyof typeof tones;
		/* Typography classes for the text itself. */
		twclass?: string;
		/* Classes for the hover wrapper. Narrow by default so only the text triggers the caret. */
		wrapClass?: string;
		children: () => any;
	} = $props();

	let el = $state<HTMLElement>();
	let hoverStyle = $derived(textCursorStyle(tones[tone].color));

	// The cursor becomes a text caret one line tall, however many lines wrap.
	function hoverShape(): CursorShapeParams {
		let lineHeight = 24;
		if (el) {
			const style = getComputedStyle(el);
			lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
		}
		return textCursorShape(lineHeight);
	}
</script>

<HoverEffect {hoverShape} {hoverStyle} twclass={wrapClass}>
	<svelte:element this={as} bind:this={el} class="{tones[tone].cls} {twclass}">
		{@render children()}
	</svelte:element>
</HoverEffect>
