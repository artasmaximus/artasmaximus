<script lang="ts">
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { cursorState, type CursorStyleParams } from '$lib/cursor/CursorState.svelte';
	import { INK } from '$lib/theme';
	import { Spring } from 'svelte/motion';

	let {
		tint = INK,
		href,
		download,
		external = false,
		border = true,
		br = 12,
		twclass = 'px-5 py-2.5',
		onClick,
		children
	}: {
		/* Fill of the cursor bubble on hover. The label stays ink at rest. */
		tint?: string;
		/* Renders a link when set, a button otherwise. */
		href?: string;
		download?: string;
		external?: boolean;
		border?: boolean;
		br?: number;
		twclass?: string;
		onClick?: () => void;
		children: () => any;
	} = $props();

	let cursorStyle: CursorStyleParams = $derived({
		background: tint,
		'mix-blend-mode': 'normal',
		'border-color': 'none',
		'backdrop-filter': 'none',
		'z-index': -1
	});

	const translation = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.6 });

	function onclick() {
		cursorState.reset();
		onClick?.();
	}

	function onmousemove(e: MouseEvent) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		translation.set({
			x: e.clientX - rect.left - rect.width / 2,
			y: e.clientY - rect.top - rect.height / 2
		});
	}

	function onmouseleave() {
		translation.set({ x: 0, y: 0 });
	}
</script>

<BubbleEffect padding={0} {br} {cursorStyle} twclass="w-fit">
	<!-- Always a link or a button, both natively interactive. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<svelte:element
		this={href ? 'a' : 'button'}
		{href}
		{download}
		target={external ? '_blank' : undefined}
		rel={external ? 'noreferrer' : undefined}
		type={href ? undefined : 'button'}
		class="btn block whitespace-nowrap text-small font-medium {twclass}"
		class:has-border={border}
		style="--tint: {tint}; --tX: {translation.current.x}; --tY: {translation.current
			.y}; --br: {br}px;"
		{onclick}
		{onmousemove}
		{onmouseleave}
	>
		{@render children()}
	</svelte:element>
</BubbleEffect>

<style>
	.btn {
		color: theme('colors.ink.DEFAULT');
		background: none;
		border-radius: var(--br);
		transition:
			border-color 0.1618s ease-out,
			background 0.1618s ease-out,
			color 0.1618s ease-out;

		transform: translateX(calc(var(--tX) * 0.1618px)) translateY(calc(var(--tY) * 0.1618px));
	}

	.has-border {
		border: 1px solid theme('colors.line');
	}

	.btn:hover {
		color: theme('colors.bg');
		background: var(--tint);
		border-color: transparent;
	}
</style>
