<script lang="ts">
	import Logo from '../Logo.svelte';
	import Socials from '../Socials.svelte';
	import Button from '../Button/Button.svelte';
	import MobileMenu from './MobileMenu.svelte';
	import { navTheme } from './NavbarState.svelte';
	import { navItems } from '$lib/nav';

	let navHeight = $state(0);

	$effect(() => {
		navTheme.height = navHeight;
	});

	// ---- auto-hide ------------------------------------------------------------
	// The bar waits offscreen. A pointer near the top calls it, keyboard focus
	// inside it keeps it, and on touch, scrolling up does. On ordinary pages it
	// also shows at the very top, where its space is kept; on an overlay page
	// (artwork) the content runs underneath it instead.
	let nearTop = $state(false);
	let focused = $state(false);
	let scrolledUp = $state(false);
	let atTop = $state(true);
	let hint = $state(false);

	let shown = $derived(
		nearTop || focused || scrolledUp || hint || (atTop && !navTheme.overlay)
	);

	$effect(() => {
		const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

		// Show it once on arrival, so people learn it's there.
		hint = true;
		const hintTimer = setTimeout(() => (hint = false), 1400);

		// Called within 80px of the top; once open it stays until the pointer is
		// clearly below it, so it doesn't flicker at the edge.
		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== 'mouse') return;
			nearTop = e.clientY < (nearTop ? navHeight + 32 : 80);
		};
		const onLeave = () => (nearTop = false);

		let lastY = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			atTop = y < 8;
			if (!finePointer) scrolledUp = y < lastY - 2 || atTop;
			lastY = y;
		};
		onScroll();

		window.addEventListener('pointermove', onMove);
		document.documentElement.addEventListener('pointerleave', onLeave);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			clearTimeout(hintTimer);
			window.removeEventListener('pointermove', onMove);
			document.documentElement.removeEventListener('pointerleave', onLeave);
			window.removeEventListener('scroll', onScroll);
			nearTop = scrolledUp = hint = false;
		};
	});
</script>

<nav
	aria-label="Main"
	bind:clientHeight={navHeight}
	class:dark={navTheme.dark}
	class:hidden-bar={!shown}
	onfocusin={() => (focused = true)}
	onfocusout={() => (focused = false)}
	class="fixed left-0 top-0 z-10 w-full bg-none py-5"
>
	<!-- Runs 1.5rem past the bar, so the blur ramp reaches further down over the labels.
	     Every layer's blur and the ramp's reach scale with --nav-reveal, so the
	     blur itself grows in and drains away when the bar enters and leaves. -->
	<div class="gradient-blur pointer-events-none absolute left-0 top-0 w-full">
		<div
			class="absolute inset-0"
			style="backdrop-filter: blur(calc(1px * var(--nav-reveal))); mask-image: linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 90%);"
		></div>
		{#each [1, 3, 10, 18, 36, 64] as blur, i}
			<div
				class="absolute inset-0"
				style="backdrop-filter: blur(calc({blur}px * var(--nav-reveal)));
		   mask-image: linear-gradient(
			 to top,
			 rgba(0,0,0,0) {12.5 * (i + 1)}%,
			 rgba(0,0,0,1) {25 * (i + 1)}%,
			 rgba(0,0,0,1) {37.5 * (i + 1)}%,
			 rgba(0,0,0,0) {50 * (i + 1)}%
		   );"
			></div>
		{/each}
	</div>
	<!-- Each feature drops in from the top edge, outside in: the logo and the
	     socials first, then the links toward the middle (--rank 0 is outermost). -->
	<div class="page relative flex items-center justify-between">
		<span class="fly" style:--rank={0}><Logo /></span>
		<div class="flex items-center gap-8">
			<div class="hidden flex-row gap-2 lg:flex">
				{#each navItems as { label, href, download }, i}
					<span class="fly" style:--rank={navItems.length - i}>
						<Button {href} {download} twclass="px-3 py-1" br={50} border={false}>{label}</Button>
					</span>
				{/each}
			</div>
			<div class="flex items-center gap-8">
				<span class="fly" style:--rank={1}><MobileMenu /></span>
				<span class="fly" style:--rank={0}><Socials /></span>
			</div>
		</div>
	</div>
</nav>

<style>
	/* Entering, the blur grows first and the features start dropping in once it
	   is about a third of the way (0.336 x 320ms). Leaving, the features lift
	   out first, inside out, and the blur drains after them. */
	nav {
		--nav-reveal: 1;
		--blur-time: 320ms;
		--drop-start: calc(var(--blur-time) * 0.336);
		transition:
			color 0.4s ease,
			--nav-reveal var(--blur-time) cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	nav.hidden-bar {
		--nav-reveal: 0;
		pointer-events: none;
		transition:
			color 0.4s ease,
			--nav-reveal var(--blur-time) cubic-bezier(0.2, 0.7, 0.2, 1) 110ms;
	}

	.fly {
		display: inline-flex;
		transition:
			transform 0.36s cubic-bezier(0.2, 0.9, 0.3, 1.12) calc(var(--drop-start) + var(--rank) * 35ms),
			opacity 0.18s ease calc(var(--drop-start) + var(--rank) * 35ms);
	}

	/* Up past the top edge of the page. */
	nav.hidden-bar .fly {
		transform: translateY(-72px);
		opacity: 0;
		transition:
			transform 0.2s cubic-bezier(0.5, 0, 0.75, 0) calc((3 - var(--rank)) * 20ms),
			opacity 0.14s ease calc((3 - var(--rank)) * 20ms + 50ms);
	}

	/* The blur ramp's reach grows and shrinks with the reveal. */
	.gradient-blur {
		height: calc((100% + 1.5rem) * var(--nav-reveal));
	}

	nav :global(.btn),
	nav :global(.icon-container svg path) {
		transition:
			color 0.4s ease,
			fill 0.4s ease;
	}

	/* Logo text and the mobile menu icon use inherited/currentColor, so they
	   follow this automatically. Button text and the social icon SVGs set
	   their own color/fill and need explicit overrides. */
	nav.dark {
		color: #fafafa;
	}

	nav.dark :global(.btn) {
		color: #fafafa !important;
	}

	nav.dark :global(.icon-container svg path) {
		fill: #fafafa !important;
	}
</style>
