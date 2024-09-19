import { writable, type Writable } from 'svelte/store';

// storing data for the SVG Cursor shape
export interface CursorShape {
	position: CursorPosition;
	width: number;
	height: number;
	borderRadius: number;
	blendMode: string;
	fill: string;
	zIndex: number;
}

export interface CursorPosition {
	x: number;
	y: number;
}

export let cursorShape = writable<CursorShape>({
	position: {
		x: 0,
		y: 0
	},
	width: 20,
	height: 20,
	borderRadius: 10,
	blendMode: 'difference',
	fill: 'white',
	zIndex: 1000
});

export let cursorPosition = writable<CursorPosition>({
	x: 0,
	y: 0
});

export let isCursorHovered = writable<boolean>(false);
