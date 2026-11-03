<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { ObserverEventDetails } from 'svelte-inview';

	let { children, twclass = '' }: { children: () => any; twclass?: string } = $props();
	let visible = $state(false);

	const options = { rootMargin: '-40px', unobserveOnEnter: true };

	function onChange({ detail }: CustomEvent<ObserverEventDetails>) {
		if (detail.inView) visible = true;
	}
</script>

<!-- Content is always in the DOM. Only its entrance waits for the viewport. -->
<div
	use:inview={options}
	oninview_change={onChange}
	class="reveal {twclass}"
	class:is-visible={visible}
>
	{@render children()}
</div>
