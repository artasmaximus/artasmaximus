export type Clip = { duration: number; rate: number; peaks: number[] };

export type Block = {
	id: string;
	text: string;
	audio: string;
	clip: Clip;
	/* Words the voice says differently from how they are written (numbers, symbols):
	   the syllable count it is spoken with. */
	spoken?: Record<string, number>;
};

export type Word = { text: string; syllables: string[]; spokenSyllables: number };

/* Rough English syllable splitter: vowel groups, with a trailing silent "e" folded in. */
export function syllabify(word: string): string[] {
	const m = word.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?|[^aeiouy]+$/gi);
	if (!m) return [word];
	if (m.length > 1 && /^[^aeiouy]*e$/i.test(m[m.length - 1]) && !/le$/i.test(word)) {
		m[m.length - 2] += m.pop();
	}
	return m;
}

export function parseBlock(block: Block): Word[] {
	return block.text
		.split(/\s+/)
		.filter(Boolean)
		.map((text) => {
			const override = block.spoken?.[text];
			if (override) return { text, syllables: [text], spokenSyllables: override };
			const syllables = syllabify(text);
			return { text, syllables, spokenSyllables: syllables.length };
		});
}

/* Time (seconds) each of `n` syllables should appear, spread over the clip's
   detected peaks. Equal counts pair one-to-one; otherwise positions along the
   peak list are interpolated. */
export function fitTimes(peaks: number[], n: number): number[] {
	if (n <= 0) return [];
	if (peaks.length === 0) return Array.from({ length: n }, (_, i) => i * 0.2);
	if (n === 1) return [peaks[0]];
	return Array.from({ length: n }, (_, i) => {
		const pos = (i * (peaks.length - 1)) / (n - 1);
		const lo = Math.floor(pos);
		const hi = Math.min(peaks.length - 1, lo + 1);
		return peaks[lo] + (peaks[hi] - peaks[lo]) * (pos - lo);
	});
}
