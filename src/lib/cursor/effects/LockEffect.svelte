<script lang="ts">
	import { cursorState, type CursorPositionParams } from '../CursorState.svelte';

	let { lockPos, children, twclass = '' } = $props();
	let lockEffect: HTMLElement;
	let contentRect = $state<DOMRect>();

	function updateContentRect() {
		if (lockEffect) {
			contentRect = lockEffect.getBoundingClientRect();
		}
	}

	function onmouseleave() {
		cursorState.isLockedPos = false;
	}

	function onmouseenter() {
		updateContentRect();
		cursorState.isLockedPos = true;
		const newPos = lockPos(contentRect);
		cursorState.HoverTargetPos = newPos;
		cursorState.setPosition(newPos);
	}
</script>

<div
	bind:this={lockEffect}
	{onmouseenter}
	{onmouseleave}
	class="lockEffect {twclass ?? ''}"
	role="complementary"
>
	{@render children()}
</div>

<style>
	.lockEffect {
		display: block;
		position: relative;
	}
</style>
