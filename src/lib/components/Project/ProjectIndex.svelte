<script lang="ts">
	import {
		cursorState,
		GOLDEN_RATIO,
		LINK_CURSOR_SHAPE,
		LINK_CURSOR_STYLE,
		type CursorShapeParams,
		type CursorStyleParams
	} from '$lib/cursor/CursorState.svelte';
	import { projects } from '$lib/projects';

	// Over a row the cursor is the usual ring. Come near the arrow and it snaps onto it
	// as a flat disc (difference-blended, so the arrow inverts); drift away and it relaxes.
	const DISC_SHAPE: CursorShapeParams = { width: 32, height: 32, borderRadius: 16 };
	const DISC_STYLE: CursorStyleParams = {
		background: 'white',
		'mix-blend-mode': 'difference',
		'border-color': 'transparent',
		'border-width': '0px',
		'backdrop-filter': 'none',
		'z-index': 9999
	};
	const SNAP_IN = 36;
	const SNAP_OUT = 56;

	let snapped = false;

	function enter() {
		snapped = false;
		cursorState.isHovering = true;
		cursorState.shape.target = LINK_CURSOR_SHAPE;
		cursorState.setStyle(LINK_CURSOR_STYLE);
	}

	function move(e: MouseEvent) {
		const arrow = (e.currentTarget as HTMLElement).querySelector('[data-arrow]');
		if (!arrow) return;
		const rect = arrow.getBoundingClientRect();
		const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		const dist = Math.hypot(e.clientX - center.x, e.clientY - center.y);

		if (!snapped && dist < SNAP_IN) {
			snapped = true;
			cursorState.isLockedPos = true;
			cursorState.lockPull = 0.06;
			cursorState.HoverTargetPos = center;
			cursorState.setPosition(center);
			cursorState.shape.target = DISC_SHAPE;
			cursorState.setStyle(DISC_STYLE);
		} else if (snapped && dist > SNAP_OUT) {
			snapped = false;
			cursorState.isLockedPos = false;
			cursorState.lockPull = GOLDEN_RATIO;
			cursorState.shape.target = LINK_CURSOR_SHAPE;
			cursorState.setStyle(LINK_CURSOR_STYLE);
		}
	}

	function leave() {
		snapped = false;
		cursorState.reset();
	}
</script>

<!-- A catalog-style index: a hairline above each project, none after the last. -->
<ul>
	{#each projects as project (project.slug)}
		<li class="border-t border-line">
			<a
				href="/projects/{project.slug}"
				onmouseenter={enter}
				onmousemove={move}
				onmouseleave={leave}
				class="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 md:grid-cols-12 md:gap-x-10 md:py-9"
			>
				<span
					class="text-title text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 motion-reduce:transition-none md:col-span-5"
				>
					{project.name}
				</span>
				<span
					class="col-span-2 row-start-2 max-w-prose text-small text-ink-muted md:col-span-6 md:row-start-auto"
				>
					{project.blurb}
				</span>
				<span
					aria-hidden="true"
					data-arrow
					class="col-start-2 row-start-1 flex h-8 w-8 items-center justify-center justify-self-end text-ink transition-transform duration-500 ease-out group-hover:translate-x-0.5 md:col-span-1 md:col-start-auto md:row-start-auto"
				>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M3 9h12m0 0-5-5m5 5-5 5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</a>
		</li>
	{/each}
</ul>
