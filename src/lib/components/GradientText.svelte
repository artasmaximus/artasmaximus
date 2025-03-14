<script lang="ts">
	import { textCursor } from '../cursor/CursorState.svelte';
	import HoverEffect from '../cursor/effects/HoverEffect.svelte';

	let {
		text,
		from = '#333333',
		to = '#B7B7B7',
		glow = false,
		twclass = 'text-start'
	}: {
		text: string;
		from?: string;
		to?: string;
		glow?: boolean;
		twclass?: string;
	} = $props();

	let textNode = $state<HTMLElement>();
	let height = $derived(textNode ? textNode.getBoundingClientRect().height : 40);

	$effect(() => {
		textNode = textNode;
	});

	let { shape, style } = $derived(textCursor(to, 4, height));
	let hoverShape = () => shape;
	let hoverStyle = $derived(style);
</script>

<HoverEffect {hoverShape} {hoverStyle} twclass="w-fit">
	<div
		class="gradient-text {twclass} tracking-tight"
		class:glow-effect={glow}
		data-text={text}
		style="--to: {to}; --from: {from};"
		bind:this={textNode}
	>
		{text}
	</div>
</HoverEffect>

<style>
	.gradient-text {
		font-weight: bolder;
		color: #1e1e1e;
		background: linear-gradient(90deg, var(--from), var(--to));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
		width: fit-content;
	}

	.gradient-text::selection {
		background-color: var(--to);
	}

	.glow-effect::before {
		opacity: 0.25;
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		color: transparent;
		text-shadow:
			0 1px 1px var(--to),
			0 2px 2px var(--to),
			0 4px 4px var(--to),
			0 8px 8px var(--to),
			0 16px 16px var(--to),
			0 32px 29px var(--to);
		z-index: -1;
	}
</style>
