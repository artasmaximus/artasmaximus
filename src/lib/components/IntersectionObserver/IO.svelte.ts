// IO.svelte.ts
import type { Options } from 'svelte-inview';

export const defaultOptions: Options = {
	rootMargin: '0px',
	threshold: [0, 0.1, 0.5, 1],
	unobserveOnEnter: false
};
