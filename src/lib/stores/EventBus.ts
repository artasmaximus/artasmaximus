import { writable, type Writable } from 'svelte/store';

interface CustomCursorShapeEvent {
	width: number;
	height: number;
	left: number;
	top: number;
	borderRadius?: string;
}

interface CustomCursorFocusEvent {
	isFocused: boolean;
}

interface MouseMoveEvent {
	x: number;
	y: number;
}

// This store will hold the data of the last hovered clickable element
export let cursorShapeEvent: Writable<CustomCursorShapeEvent> = writable({
	width: 0,
	height: 0,
	left: 0,
	top: 0
});

// This store will hold the data of the last focused clickable element
export let cursorFocusEvent: Writable<CustomCursorFocusEvent> = writable({
	isFocused: false
});

export let mouseMoveEvent: Writable<MouseMoveEvent> = writable({
	x: 0,
	y: 0
});
