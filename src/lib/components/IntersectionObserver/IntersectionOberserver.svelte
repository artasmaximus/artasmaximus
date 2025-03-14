<!-- IntersectionObserver.svelte -->
<script lang="ts">
	import { inview } from 'svelte-inview';
	import { fade, fly } from 'svelte/transition';
	import type { ObserverEventDetails } from 'svelte-inview';

	let { children, className = '' } = $props();
	let isInView = $state(false);

	const options = {
		rootMargin: '-50px',
		threshold: 0.1,
		unobserveOnEnter: true
	};

	function handleChange({ detail }: CustomEvent<ObserverEventDetails>) {
		isInView = detail.inView;
		console.log('inview');
	}
</script>

<div use:inview={options} oninview_change={handleChange} class={className}>
	{#if isInView}
		<div in:fly={{ y: 50, duration: 400, delay: 100 }} out:fade={{ duration: 200 }}>
			{@render children()}
		</div>
	{/if}
</div>
