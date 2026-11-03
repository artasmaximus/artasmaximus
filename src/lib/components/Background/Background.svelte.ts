// Background.svelte.ts
export const DEFAULT_PRIMARY = '#E8E8E8';
// export const DEFAULT_PRIMARY = '#E8E8E8';
export const DEFAULT_BLINK = '#1E1E1E';
// export const DEFAULT_BLINK = '#C8C8C8';

export class Color {
	primary: string = $state(DEFAULT_PRIMARY);
	blink: string = $state(DEFAULT_BLINK);

	updatePrimary(color: string) {
		this.primary = color;
	}

	updateBlink(color: string) {
		this.blink = color;
	}

	reset() {
		this.primary = DEFAULT_PRIMARY;
		this.blink = DEFAULT_BLINK;
	}
}

export const bgDotColor = new Color();

// When set, click ripples use this color instead of the page's blink color — e.g. the
// Artwork page tints ripples with the hovered piece's dominant color.
export class RippleTint {
	color: string | null = $state(null);
}

export const rippleTint = new RippleTint();
