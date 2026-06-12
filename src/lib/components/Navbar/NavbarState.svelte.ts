// NavbarState.svelte.ts
// Lets a page section (e.g. a dark scroll-video stage) tell the navbar to
// switch to a light color scheme while that section sits behind it.
export class NavTheme {
	dark: boolean = $state(false);
	height: number = $state(0);
}

export const navTheme = new NavTheme();
