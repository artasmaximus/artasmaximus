// NavbarState.svelte.ts
// Lets a page section (e.g. a dark scroll-video stage) tell the navbar to
// switch to a light color scheme while that section sits behind it, and lets
// an immersive page (artwork) run its content underneath the bar.
export class NavTheme {
	dark: boolean = $state(false);
	height: number = $state(0);
	/* Content starts at the very top, under the bar, instead of below its space. */
	overlay: boolean = $state(false);
}

export const navTheme = new NavTheme();
