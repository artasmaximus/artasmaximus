<script lang="ts">
	import '@fontsource-variable/jetbrains-mono/wght.css';
	import type { Snippet } from 'svelte';
	import GlassEffect from '$lib/cursor/effects/GlassEffect.svelte';

	let {
		label,
		title = '',
		children
	}: {
		/* What the screen shows, read out in place of its markup. */
		label: string;
		title?: string;
		children: Snippet;
	} = $props();
</script>

<!-- A recreated screen: purely visual, so it reads as one image. -->
<figure>
	<GlassEffect>
		<div
			role="img"
			aria-label={label}
			class="select-none overflow-hidden rounded-lg border border-line bg-surface"
		>
			<div class="flex h-9 items-center gap-1.5 border-b border-line bg-bg px-3.5">
				<span class="h-2.5 w-2.5 rounded-full bg-[#D4D4D4]"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-[#D4D4D4]"></span>
				<span class="h-2.5 w-2.5 rounded-full bg-[#D4D4D4]"></span>
				<span class="flex-1 truncate pr-12 text-center font-mono text-[11px] text-ink-subtle">
					{title}
				</span>
			</div>
			<div aria-hidden="true">
				{@render children()}
			</div>
		</div>
	</GlassEffect>
</figure>
