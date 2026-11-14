<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Text from '$lib/components/Text.svelte';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import { fitTimes, parseBlock, type Block } from './rhythm';

	let { blocks, gap = 0.35 }: { blocks: Block[]; gap?: number } = $props();

	/* Text shows slightly before the sound so the eye leads the ear. */
	const LEAD = 0.06;

	type Unit = { text: string; time: number };
	type Layout = { block: Block; words: { units: Unit[] }[] };

	// Every word's syllables get a time from its block's audio peaks.
	let layouts = $derived<Layout[]>(
		blocks.map((block) => {
			const words = parseBlock(block);
			const total = words.reduce((n, w) => n + w.spokenSyllables, 0);
			const times = fitTimes(block.clip.peaks, total);
			let k = 0;
			return {
				block,
				words: words.map((w) => {
					const start = k;
					k += w.spokenSyllables;
					// A word spoken differently from how it is written appears whole.
					const units =
						w.syllables.length === w.spokenSyllables
							? w.syllables.map((text, i) => ({ text, time: times[start + i] }))
							: [{ text: w.text, time: times[start] }];
					return { units };
				})
			};
		})
	);

	let playing = $state(false);
	let shown = $state<Set<string>>(new Set());
	let audio: HTMLAudioElement | null = null;
	let raf = 0;
	let timer = 0;
	let run = 0;

	function stop() {
		run++;
		cancelAnimationFrame(raf);
		clearTimeout(timer);
		audio?.pause();
		audio = null;
		playing = false;
	}

	function reveal(key: string) {
		if (!shown.has(key)) shown = new Set(shown).add(key);
	}

	function playBlock(i: number, myRun: number) {
		if (myRun !== run) return;
		if (i >= layouts.length) {
			playing = false;
			return;
		}
		const { words } = layouts[i];
		const a = new Audio(layouts[i].block.audio);
		audio = a;
		const units = words.flatMap((w, wi) =>
			w.units.map((u, ui) => ({ key: `${i}-${wi}-${ui}`, time: u.time - LEAD }))
		);
		// audio.currentTime is the clock, so the text cannot drift from the sound.
		const tick = () => {
			if (myRun !== run) return;
			for (const u of units) if (a.currentTime >= u.time) reveal(u.key);
			if (!a.ended) raf = requestAnimationFrame(tick);
		};
		a.onended = () => {
			units.forEach((u) => reveal(u.key));
			timer = window.setTimeout(() => playBlock(i + 1, myRun), gap * 1000);
		};
		a.play()
			.then(() => (raf = requestAnimationFrame(tick)))
			.catch(stop);
	}

	function play() {
		stop();
		shown = new Set();
		playing = true;
		playBlock(0, run);
	}

	function showAll() {
		stop();
		shown = new Set(
			layouts.flatMap((l, i) =>
				l.words.flatMap((w, wi) => w.units.map((_, ui) => `${i}-${wi}-${ui}`))
			)
		);
	}

	// With reduced motion there is nothing to animate: show the text, offer the audio only.
	if (prefersReducedMotion()) showAll();

	// onMount's cleanup is browser-only; onDestroy would also run during SSR.
	onMount(() => stop);
</script>

<div class="flex flex-col gap-8">
	<p class="max-w-prose text-lead text-ink">
		{#each layouts as l, i}
			{#each l.words as w, wi}
				<span class="inline-block whitespace-nowrap">
					{#each w.units as u, ui}
						<span
							class="inline-block transition-[opacity,transform] duration-200 ease-out"
							style:opacity={shown.has(`${i}-${wi}-${ui}`) ? 1 : 0.08}
							style:transform={shown.has(`${i}-${wi}-${ui}`) ? 'none' : 'translateY(3px)'}
						>
							{u.text}
						</span>
					{/each}
				</span>
				{' '}
			{/each}
		{/each}
	</p>

	<div class="flex items-center gap-4">
		<Button onClick={playing ? stop : play}>
			{playing ? 'Stop' : shown.size ? 'Replay' : 'Play'}
		</Button>
		<Text tone="subtle" twclass="text-small">
			Timed to each clip's syllable peaks, found from its amplitude envelope.
		</Text>
	</div>
</div>
