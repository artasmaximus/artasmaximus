<script lang="ts">
	import { onMount } from 'svelte';
	import { navTheme } from '$lib/components/Navbar/NavbarState.svelte';

	// Dark, sticky-pinned section whose video frame is driven by scroll
	// position rather than time. Expects an all-intraframe encode so
	// arbitrary-frame seeks during scrubbing stay smooth.
	let { src, poster }: { src: string; poster?: string } = $props();

	let container: HTMLDivElement | undefined = $state();
	let video: HTMLVideoElement | undefined = $state();

	function onScroll() {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const vh = window.innerHeight;

		// Mirror the browser's sticky-positioning math to find where the
		// pinned stage currently sits, so the navbar can match its color.
		let stickyTop: number;
		if (rect.top >= 0) {
			stickyTop = rect.top;
		} else if (rect.bottom >= vh) {
			stickyTop = 0;
		} else {
			stickyTop = rect.bottom - vh;
		}
		navTheme.dark = stickyTop <= navTheme.height && stickyTop + vh > 0;

		if (!video || !video.duration) return;
		const range = rect.height - vh;
		const progress = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
		video.currentTime = progress * video.duration;
	}

	onMount(() => {
		onScroll();
		return () => {
			navTheme.dark = false;
		};
	});
</script>

<svelte:window onscroll={onScroll} />

<div
	bind:this={container}
	class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[250vh] w-screen"
>
	<div
		class="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#05060a]"
	>
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={video}
			{src}
			{poster}
			onloadedmetadata={onScroll}
			muted
			playsinline
			preload="auto"
			class="h-full w-full object-cover"
		></video>
	</div>
</div>
