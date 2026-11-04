<script lang="ts">
	import Text from './Text.svelte';

	let {
		as = 'h1',
		size = 'title',
		light = false,
		twclass = '',
		children
	}: {
		as?: 'h1' | 'h2' | 'h3';
		size?: 'display' | 'title' | 'heading';
		/* For headings on a dark ground. */
		light?: boolean;
		twclass?: string;
		children: () => any;
	} = $props();

	const sizes = { display: 'text-display', title: 'text-title', heading: 'text-heading' };
</script>

<Text {as} tone={light ? 'light' : 'ink'} twclass="{sizes[size]} text-balance {twclass}">
	{@render children()}
</Text>
