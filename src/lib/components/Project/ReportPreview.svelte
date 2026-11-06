<script lang="ts">
	import MockWindow from './MockWindow.svelte';

	// The report's accent. Lines, bars, and the selected toggle share it.
	const ACCENT = '#5722C2';

	const tables = ['Bets', 'Games', 'Customers', 'Transactions'];
	const metrics = ['Net revenue', 'Deposits'];

	// A small seeded generator, so the made-up series are the same on every render.
	function seeded(seed: number) {
		let s = seed;
		return () => {
			s = (s * 1664525 + 1013904223) % 4294967292;
			return s / 4294967299;
		};
	}

	function series(seed: number, n: number, drift: number): [number, number][] {
		const next = seeded(seed);
		let v = 0.4;
		return Array.from({ length: n }, (_, i) => {
			v = Math.min(0.9, Math.max(0.12, v + (next() - 0.45) * 0.16 + drift));
			return [6 + i * (288 / (n - 1)), 90 - v * 76];
		});
	}

	// Catmull-Rom through the points, written as cubic curves for a smooth line.
	function smooth(p: [number, number][]) {
		let d = `M${p[0][0]},${p[0][1]}`;
		for (let i = 0; i < p.length - 1; i++) {
			const a = p[i - 1] ?? p[i];
			const b = p[i];
			const c = p[i + 1];
			const e = p[i + 2] ?? c;
			d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
		}
		return d;
	}

	const lines = [
		{ title: 'sum(stake)', d: smooth(series(3, 26, 0.008)) },
		{ title: 'sum(total_win_amount)', d: smooth(series(11, 26, 0.004)) },
		{ title: 'count(distinct game_id)', d: smooth(series(7, 26, 0.002)) }
	];
	const bars = {
		title: 'count(*) by game_type',
		labels: ['slots', 'live', 'table', 'sport', 'other'],
		heights: [0.86, 0.6, 0.42, 0.28, 0.16]
	};
	const grid = [14, 52, 90];
	const granularities = ['D', 'M', 'Y'];

	// The summary card: one number and two dates, each under a small badge.
	const summary = [
		{ badge: 'count(*)', value: '48,213,902' },
		{ badge: 'min(bet_date)', value: 'January 1, 2023' },
		{ badge: 'max(bet_date)', value: 'June 30, 2025' }
	];
</script>

<MockWindow
	title="etl-tool.internal/sanity-check"
	label="A sanity-check report in light colors with a purple accent: a sidebar with the report title, client name, and key metrics, and a page for the bets table with a summary card and four charts titled by their SQL"
>
	<div class="flex bg-surface text-[#31333F]">
		<div
			class="hidden w-[190px] shrink-0 px-3 py-5 font-mono text-[13px] text-white md:block"
			style="background: {ACCENT}"
		>
			<div class="mb-4 flex items-start justify-between gap-2 border-b border-white/20 px-2 pb-4">
				<div class="min-w-0 font-sans">
					<div class="text-[15px] font-semibold leading-tight">Sanity Check</div>
					<div class="mt-0.5 text-[12.5px] text-white/85">Harbor Gaming</div>
					<div class="mt-1.5 text-[10px] text-white/60">Generated Jun 30, 2025</div>
				</div>
				<!-- Material Symbols Rounded: download -->
				<svg
					width="20"
					height="20"
					viewBox="0 -960 960 960"
					fill="currentColor"
					class="mt-px shrink-0 text-white"
				>
					<path
						d="M469-327q-5-2-10-7L308-485q-9-9.27-8.5-21.64.5-12.36 9.11-21.36 9.39-9 21.89-9t21.5 9l98 99v-341q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v341l99-99q8.8-9 20.9-8.5 12.1.5 21.49 9.5 8.61 9 8.61 21.5t-9 21.5L501-334q-5 5-10.13 7-5.14 2-11 2-5.87 0-10.87-2ZM220-160q-24 0-42-18t-18-42v-113q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v113h520v-113q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v113q0 24-18 42t-42 18H220Z"
					/>
				</svg>
			</div>
			<div class="px-2 pb-2 font-sans text-[10.5px] font-medium tracking-wider text-white/60">
				TABLES
			</div>
			{#each tables as name, i}
				<div
					class="rounded-md px-2 py-1.5 uppercase {i === 0
						? 'bg-white/20 font-medium text-white'
						: 'text-white/85'}"
				>
					{name}
				</div>
			{/each}
			<div class="px-2 pb-2 pt-5 font-sans text-[10.5px] font-medium tracking-wider text-white/60">
				KEY METRICS
			</div>
			{#each metrics as name}
				<div class="rounded-md px-2 py-1.5 text-white/85">{name}</div>
			{/each}
		</div>

		<div class="min-w-0 flex-1 p-5 md:p-7">
			<div class="font-mono text-[28px] font-medium uppercase leading-tight tracking-wide">
				Bets
			</div>

			<div
				class="mb-5 mt-3 grid grid-cols-1 divide-y divide-[#E1E4EA] rounded-lg border border-[#E1E4EA] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
			>
				{#each summary as item}
					<div class="px-4 py-3.5">
						<span
							class="inline-block rounded bg-[#F0F2F6] px-1.5 py-0.5 font-mono text-[10.5px] uppercase text-[#555A6B]"
							>{item.badge}</span
						>
						<div class="mt-2 text-[20px] font-semibold leading-tight tracking-tight">
							{item.value}
						</div>
					</div>
				{/each}
			</div>

			<div class="mb-3 text-[18px] font-semibold tracking-tight">Analyses</div>

			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{#each lines as line}
					<div class="rounded-lg border border-[#E1E4EA] px-3 py-2.5">
						<div class="mb-1.5 flex items-center justify-between gap-2">
							<code class="truncate font-mono text-[11.5px] font-medium uppercase"
								>{line.title}</code
							>
							<div class="flex shrink-0 items-center gap-1.5">
								<!-- Day, month, year: the white pill sits on whichever is selected. -->
								<span
									class="flex rounded-md bg-[#F0F2F6] p-0.5 font-mono text-[10.5px] font-medium text-[#808495]"
								>
									{#each granularities as g}
										<span
											class="rounded px-1.5 py-0.5 {g === 'M'
												? 'bg-white text-[#31333F] shadow-[0_1px_2px_rgba(49,51,63,0.16)]'
												: ''}">{g}</span
										>
									{/each}
								</span>
								<span
									class="rounded border border-[#D9DCE3] px-1.5 font-mono text-[11px] text-[#555A6B]"
									>Table</span
								>
								<span
									class="rounded border border-[#D9DCE3] px-1.5 font-mono text-[11px] text-[#555A6B]"
									>SQL</span
								>
							</div>
						</div>
						<svg viewBox="0 0 300 100" preserveAspectRatio="none" class="block h-24 w-full">
							<g stroke="#ECEEF3">
								{#each grid as y}
									<line x1="0" x2="300" y1={y} y2={y} />
								{/each}
							</g>
							<path
								d={line.d}
								fill="none"
								stroke={ACCENT}
								stroke-width="2"
								stroke-linejoin="round"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
						<div class="flex justify-between font-mono text-[10px] text-[#808495]">
							<span>2023</span><span>2024</span><span>2025</span>
						</div>
					</div>
				{/each}

				<div class="rounded-lg border border-[#E1E4EA] px-3 py-2.5">
					<div class="mb-1.5 flex items-center justify-between gap-2">
						<code class="truncate font-mono text-[11.5px] font-medium uppercase">{bars.title}</code>
						<div class="flex shrink-0 items-center gap-1.5">
							<span
								class="rounded border border-[#D9DCE3] px-1.5 font-mono text-[11px] text-[#555A6B]"
								>Table</span
							>
							<span
								class="rounded border border-[#D9DCE3] px-1.5 font-mono text-[11px] text-[#555A6B]"
								>SQL</span
							>
						</div>
					</div>
					<svg viewBox="0 0 300 100" preserveAspectRatio="none" class="block h-24 w-full">
						<g stroke="#ECEEF3">
							<line x1="0" x2="300" y1="14" y2="14" />
							<line x1="0" x2="300" y1="52" y2="52" />
						</g>
						<line x1="0" x2="300" y1="90" y2="90" stroke="#D9DCE3" />
						{#each bars.heights as h, i}
							<rect
								x={6 + i * 57.6 + 11.5}
								y={90 - h * 74}
								width="34.5"
								height={h * 74}
								rx="2"
								fill={ACCENT}
							/>
						{/each}
					</svg>
					<div class="flex font-mono text-[10px] text-[#808495]">
						{#each bars.labels as label}
							<span class="flex-1 truncate text-center">{label}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</MockWindow>
