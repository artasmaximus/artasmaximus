<script lang="ts">
	import MockWindow from './MockWindow.svelte';

	// Sixteen copies of one notebook, passed around by hand. Marks follow git's
	// letters: modified, untracked, conflicted.
	const files: [string, string][] = [
		['historical sanity check_v1.ipynb', ''],
		['historical sanity check_v2.ipynb', ''],
		['historical sanity check_v2 (maya).ipynb', 'M'],
		['historical sanity check_v2_jordan.ipynb', ''],
		['historical sanity check_v3.ipynb', 'M'],
		['historical sanity check_v3_FINAL.ipynb', ''],
		['historical sanity check_v3_final_priya.ipynb', 'M'],
		['historical sanity check_v3 copy.ipynb', ''],
		['historical sanity check_v4_ben.ipynb', 'U'],
		['historical sanity check_v4_maya.ipynb', 'C'],
		['historical sanity check_v4 (1).ipynb', ''],
		['historical sanity check_v4.1_jordan.ipynb', 'M'],
		['historical sanity check_v5_DO_NOT_USE.ipynb', ''],
		['historical sanity check_v5_luis.ipynb', 'U'],
		['historical sanity check_v5_luis_fixed.ipynb', 'C'],
		['historical sanity check_v6?.ipynb', 'U']
	];
	const active = 9;
	// One red drives every error shade. The tints are mixed from it, so change it here only.
	const ERROR_RED = '#FF2634';
	const red = {
		text: 'text-[color:var(--err)]',
		border: 'border-[color:color-mix(in_srgb,var(--err)_70%,transparent)]',
		rule: 'border-[color:color-mix(in_srgb,var(--err)_25%,transparent)]',
		wash: 'bg-[color:color-mix(in_srgb,var(--err)_7%,white)]',
		strong: 'bg-[color:color-mix(in_srgb,var(--err)_50%,white)]',
		light: 'bg-[color:color-mix(in_srgb,var(--err)_25%,white)]'
	};

	const markTone: Record<string, string> = {
		M: 'text-ink-muted',
		U: 'text-ink-muted',
		C: red.text
	};

	const tabs = [
		'v4_maya',
		'v3_FINAL',
		'v4.1_jordan',
		'v5_luis_fixed',
		'v3_final_priya',
		'v2 (maya)'
	];

	// Each cell is a few bars of code: [first width, second width, indent]. The list
	// runs longer than the window on purpose, like a notebook that keeps scrolling.
	const cells: { n: string; error?: boolean; rows: [number, number, number][] }[] = [
		{
			n: '1',
			rows: [
				[60, 140, 0],
				[90, 70, 0]
			]
		},
		{
			n: '7',
			rows: [
				[110, 60, 0],
				[40, 180, 20],
				[70, 120, 20],
				[50, 90, 40]
			]
		},
		{
			n: '3',
			rows: [
				[80, 200, 0],
				[120, 60, 20]
			]
		},
		{
			n: '*',
			error: true,
			rows: [
				[60, 90, 0],
				[150, 50, 20],
				[90, 110, 20]
			]
		},
		{ n: '12', rows: [[100, 160, 0]] },
		{
			n: '9',
			rows: [
				[70, 150, 0],
				[130, 80, 20],
				[50, 170, 20]
			]
		},
		{
			n: '14',
			rows: [
				[90, 120, 0],
				[60, 200, 20],
				[110, 70, 20],
				[80, 140, 40]
			]
		},
		{
			n: '22',
			rows: [
				[120, 90, 0],
				[70, 160, 0]
			]
		}
	];

	function bar(error: boolean | undefined, strong: boolean) {
		if (error) return strong ? red.strong : red.light;
		return strong ? 'bg-[#A3A3A3]' : 'bg-[#D4D4D4]';
	}
</script>

<MockWindow
	title="sanity_checks / historical"
	label="A code editor with sixteen copies of one notebook, named v1 through v6, with other people's names and version suffixes, several tabs open at once, and a long notebook with one cell that errored"
>
	<div class="flex" style="--err: {ERROR_RED}">
		<div class="w-full shrink-0 border-line py-3.5 font-mono text-[12px] sm:w-[330px] sm:border-r">
			<div class="px-4 pb-2 text-[10px] font-semibold tracking-widest text-ink-subtle">
				EXPLORER
			</div>
			{#each files as [name, mark], i}
				<div
					class="flex items-center gap-2.5 px-4 py-[5px] {i === active
						? 'bg-[#F0F0F0] text-ink'
						: 'text-ink-muted'}"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
						class="shrink-0 {mark === 'C' ? red.text : 'text-ink-subtle'}"
					>
						<rect x="2.5" y="1.5" width="9" height="11" rx="1.5" />
						<path d="M5 5h4M5 7.5h4M5 10h2" />
					</svg>
					<span class="flex-1 truncate">{name}</span>
					{#if mark}
						<span class="text-[11px] font-medium {markTone[mark]}">{mark}</span>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Sized by the explorer beside it; the cells inside run past the bottom edge. -->
		<div class="relative hidden min-w-0 flex-1 sm:block">
			<div class="absolute inset-0 flex flex-col overflow-hidden">
				<div
					class="flex h-[38px] shrink-0 overflow-hidden border-b border-line bg-bg font-mono text-[11.5px]"
				>
					{#each tabs as tab, i}
						<div
							class="flex shrink-0 items-center gap-2 border-r border-line px-3.5 {i === 0
								? 'bg-surface text-ink'
								: 'text-ink-subtle'}"
						>
							{tab}
							<span class="h-1.5 w-1.5 rounded-full {i === 0 ? 'bg-ink' : 'bg-[#D4D4D4]'}"></span>
						</div>
					{/each}
				</div>

				<div class="flex flex-col gap-3.5 px-6 py-5">
					{#each cells as cell}
						<div class="flex gap-3">
							<span
								class="w-10 shrink-0 pt-2.5 font-mono text-[11px] {cell.error
									? `font-medium ${red.text}`
									: 'text-ink-subtle'}">[{cell.n}]</span
							>
							<div
								class="flex flex-1 flex-col gap-2 rounded-lg border px-3.5 py-3 {cell.error
									? `${red.border} ${red.wash}`
									: 'border-line bg-bg'}"
							>
								{#each cell.rows as [a, b, indent], r}
									<div class="flex gap-1.5" style="padding-left: {indent}px">
										<span
											class="h-[7px] rounded-full {bar(cell.error, r % 2 === 0)}"
											style="width: {a}px"
										></span>
										<span class="h-[7px] rounded-full {bar(cell.error, false)}" style="width: {b}px"
										></span>
									</div>
								{/each}
								{#if cell.error}
									<div class="mt-1 flex flex-col gap-2 border-t pt-2.5 {red.rule}">
										<span class="h-[7px] w-[55%] rounded-full {red.strong}"></span>
										<span class="h-[7px] w-[35%] rounded-full {red.light}"></span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</MockWindow>
