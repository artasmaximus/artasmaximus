<script lang="ts">
	import MockWindow from './MockWindow.svelte';

	// One table open, as the tool left it after Auto-infer. The rest stay collapsed.
	const open = {
		name: 'bets',
		groups: [
			{ label: 'Trend total', columns: ['stake', 'total_win_amount'] },
			{ label: 'Trend distinct', columns: ['game_id', 'customer_id'] },
			{ label: 'Distribution', columns: ['game_type', 'status'] }
		]
	};
	const closed = ['games', 'customers', 'transactions'];
</script>

<MockWindow
	title="etl-tool.internal/sanity-check"
	label="A Streamlit panel titled Configure analyses, with an Auto-infer button and one expanded table showing columns chosen for total trends, distinct trends, and distributions"
>
	<div class="bg-surface p-5 text-[#31333F] md:p-8">
		<div class="mb-5 flex items-center justify-between gap-4">
			<span class="text-[22px] font-semibold tracking-tight">Configure Analyses</span>
			<span
				class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D6D8DF] py-1.5 pl-2.5 pr-3 text-[14px]"
			>
				<!-- Material Symbols Rounded: auto_awesome -->
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="m19.46 8 .79-1.75L22 5.46a.5.5 0 0 0 0-.91l-1.75-.79L19.46 2a.5.5 0 0 0-.91 0l-.79 1.75-1.76.79a.5.5 0 0 0 0 .91l1.75.79.79 1.76c.18.39.74.39.92 0zM11.5 9.5 9.91 6c-.35-.78-1.47-.78-1.82 0L6.5 9.5 3 11.09c-.78.36-.78 1.47 0 1.82l3.5 1.59L8.09 18c.36.78 1.47.78 1.82 0l1.59-3.5 3.5-1.59c.78-.36.78-1.47 0-1.82L11.5 9.5zm7.04 6.5-.79 1.75-1.75.79a.5.5 0 0 0 0 .91l1.75.79.79 1.76a.5.5 0 0 0 .91 0l.79-1.75 1.76-.79a.5.5 0 0 0 0-.91l-1.75-.79-.79-1.76a.508.508 0 0 0-.92 0z"
					/>
				</svg>
				Auto Configure
			</span>
		</div>

		<div class="rounded-lg border border-[#DCDFE6]">
			<div
				class="flex items-center justify-between px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-wider"
			>
				{open.name}
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					stroke="#808080"
					stroke-width="1.6"
				>
					<path d="M3 9l4-4 4 4" />
				</svg>
			</div>
			<div class="grid grid-cols-1 gap-4 px-4 pb-5 md:grid-cols-3">
				{#each open.groups as group}
					<div>
						<div class="mb-1.5 text-[13px]">{group.label}</div>
						<div
							class="flex items-center justify-between gap-2 rounded-lg bg-[#F0F0F0] px-2 py-1.5"
						>
							<div class="flex flex-wrap gap-1.5">
								{#each group.columns as column}
									<span
										class="inline-flex items-center gap-1.5 rounded-md bg-[#006FFF] py-0.5 pl-2 pr-1.5 font-mono text-[12px] font-medium text-white"
									>
										{column}
										<svg
											width="9"
											height="9"
											viewBox="0 0 9 9"
											fill="none"
											stroke="currentColor"
											stroke-width="1.6"
										>
											<path d="M1.5 1.5l6 6M7.5 1.5l-6 6" />
										</svg>
									</span>
								{/each}
							</div>
							<svg
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
								stroke="#808080"
								stroke-width="1.6"
								class="shrink-0"
							>
								<path d="M3 5l4 4 4-4" />
							</svg>
						</div>
					</div>
				{/each}
			</div>
		</div>

		{#each closed as name}
			<div
				class="mt-2 flex items-center justify-between rounded-lg border border-[#DCDFE6] px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-wider"
			>
				{name}
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					stroke="#808080"
					stroke-width="1.6"
				>
					<path d="M3 5l4 4 4-4" />
				</svg>
			</div>
		{/each}
	</div>
</MockWindow>
