import { writable, type Writable, get } from 'svelte/store';

export interface appDetail {
	vw: number;
	vh: number;
	isTouchInput: boolean;
	contentWidth: number;
	title?: string;
	collapseNav?: boolean;
	navBarHeight?: number;
}

export const appDetail: Writable<appDetail> = writable({
	vw: 0,
	vh: 0,
	isTouchInput: false,
	contentWidth: 0,
	title: 'artas maximus'
});

export function isTouchInputDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
