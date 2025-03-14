<!-- ParallaxWrapper.svelte -->
<script lang="ts">
	import { Spring } from 'svelte/motion';

	let { speed = 0.5, twclass = '', children } = $props();
	let element: any;
	let scrollY = $state(0);

	// Create spring for smooth parallax movement
	const spring = new Spring(0, {
		stiffness: 0.015,
		damping: 0.8
	});

	// Track scroll position
	$effect(() => {
		const handleScroll = () => {
			if (!element) return;
			const rect = element.getBoundingClientRect();
			const scrollProgress = -rect.top;
			spring.set(scrollProgress * speed);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div
	bind:this={element}
	style="transform: translateY({spring.current}px)"
	class={`transition-transform will-change-transform ${twclass}`}
>
	{@render children()}
</div>
