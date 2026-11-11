<script lang="ts">
	import { liveWater, resetWater, WATER_CONTROLS } from './controls.svelte';

	// A floating panel for exploring the water live on a page. Temporary by
	// design: drop it from the page once the values are settled.
	let open = $state(true);
</script>

<aside
	aria-label="Water settings"
	class="fixed bottom-4 right-4 z-20 flex w-72 flex-col rounded-lg border border-line bg-surface/90 text-ink shadow-lg backdrop-blur"
>
	<div class="flex items-center justify-between gap-2 px-4 py-3">
		<span class="text-small font-medium">Water</span>
		<div class="flex items-center gap-3 text-label text-ink-muted">
			{#if open}
				<button type="button" class="hover:text-ink" onclick={resetWater}>Reset</button>
			{/if}
			<button
				type="button"
				class="hover:text-ink"
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				{open ? 'Hide' : 'Show'}
			</button>
		</div>
	</div>

	{#if open}
		<div class="flex max-h-[65vh] flex-col gap-5 overflow-y-auto border-t border-line px-4 py-4">
			{#each WATER_CONTROLS as group}
				<fieldset class="flex flex-col gap-3">
					<legend class="mb-2 flex flex-col">
						<span class="text-small font-medium">{group.label}</span>
						<span class="text-label text-ink-subtle">{group.hint}</span>
					</legend>
					{#each group.controls as c}
						<label class="flex flex-col gap-1 text-label text-ink-muted">
							<span class="flex justify-between">
								{c.label}<span class="tabular-nums">{liveWater[c.key]}</span>
							</span>
							<input
								type="range"
								min={c.min}
								max={c.max}
								step={c.step}
								bind:value={liveWater[c.key]}
								class="accent-[#1A1A1A]"
							/>
						</label>
					{/each}
				</fieldset>
			{/each}
		</div>
	{/if}
</aside>
