import { writable, type Writable } from 'svelte/store';

interface MouseMoveEvent {
	mousex: number;
	mousey: number;
}

export let mouseMoveEvent: Writable<MouseMoveEvent> = writable({
	mousex: 0,
	mousey: 0
});
