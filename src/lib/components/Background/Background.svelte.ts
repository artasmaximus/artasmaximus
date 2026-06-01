// Background.svelte.ts
export const DEFAULT_PRIMARY = '#E8E8E8';
export const DEFAULT_BLINK = '#C8C8C8';

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
