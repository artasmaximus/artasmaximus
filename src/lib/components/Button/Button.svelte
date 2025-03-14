<script lang="ts">
	import BubbleEffect from '$lib/cursor/effects/BubbleEffect.svelte';
	import { cursorState, type CursorStyleParams } from '$lib/cursor/CursorState.svelte';
	import { Spring } from 'svelte/motion';
	import type { Button } from './Button.svelte.ts';

	let {
		color,
		border = true,
		br = 15,
		twclass = 'z-10 flex w-full cursor-none whitespace-nowrap px-6 py-3 text-center',
		onClick,
		children
	}: Button = $props();

	let button = $state<HTMLElement>();
	let buttonCenter = $state<Pos>({ x: 0, y: 0 });

	let cursorStyle: CursorStyleParams = {
		background: color,
		'mix-blend-mode': 'normal',
		'border-color': 'none',
		'backdrop-filter': 'none',
		'z-index': -1
	};

	type Pos = { x: number; y: number };

	const translation = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.1,
			damping: 0.6
		}
	);

	$effect(() => {
		if (button) {
			let { top, left, width, height } = button.getBoundingClientRect();
			buttonCenter.x = left + width / 2;
			buttonCenter.y = top + height / 2;
		}
	});

	function onclick() {
		cursorState.reset();
		if (onClick) {
			onClick();
		}
	}

	function onmousemove(e: MouseEvent) {
		if (!button) return;

		const rect = button.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		translation.set({ x, y });
	}

	function onmouseleave() {
		translation.set({ x: 0, y: 0 });
	}
</script>

<BubbleEffect padding={0} {br} {cursorStyle} twclass="w-full place-content-center">
	<button
		class="{twclass} cursor-none"
		class:border
		style="--color: {color}; --border-color: {color}30; --tX: {translation.current
			.x}; --tY: {translation.current.y}; --br: {br}px;"
		{onclick}
		{onmousemove}
		{onmouseleave}
		bind:this={button}
	>
		{@render children()}
	</button>
</BubbleEffect>

<style>
	button {
		color: var(--color);
		background: none;
		border-radius: var(--br);
		transition:
			border-color 0.1618s ease-out,
			background 0.1618s ease-out,
			color 0.1618s ease-out;

		transform: translateX(calc(var(--tX) * 0.1618px)) translateY(calc(var(--tY) * 0.1618px));
	}

	.border {
		border-radius: var(--br);
		border-width: 2px;
		border-color: var(--border-color);
	}

	button:hover {
		color: #fafafa;
		background: var(--color);
		border-color: #fafafa00;
	}
</style>
