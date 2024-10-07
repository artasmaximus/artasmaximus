import { get, writable } from 'svelte/store';
import { tick } from 'svelte';
import {
	cursorShape,
	DEFAULT_CURSOR_SHAPE,
	isCursorHovered,
	type CursorShapeParams,
	type CursorPosition
} from './cursor';

export interface ElementMeasurements {
	cursorShape: CursorShapeParams;
	cursorPosition: CursorPosition;
}

export interface UnderlineOptions {
	thickness?: number;
	bg?: string;
	mbm?: string;
	distance?: number;
	br?: number;
}

export interface BubbleOptions {
	hpad?: number;
	vpad?: number;
	br?: number;
	bg?: string;
	mbm?: string;
	bw?: number;
	bc?: string;
}

type MeasureOptions = UnderlineOptions | BubbleOptions;

function underline(rect: DOMRect, options: UnderlineOptions): ElementMeasurements {
	return {
		cursorShape: {
			width: rect.width,
			height: options.thickness ?? 3,
			borderRadius: options.br ?? (options.thickness ?? 3) / 2,
			backgroundColor: options.bg ?? 'white',
			mixBlendMode: options.mbm ?? 'difference'
		},
		cursorPosition: {
			x: rect.left,
			y: rect.bottom + (options.distance ?? 2)
		}
	};
}

function bubble(rect: DOMRect, options: BubbleOptions): ElementMeasurements {
	return {
		cursorShape: {
			width: rect.width + (options.hpad ?? 0) * 2,
			height: rect.height + (options.vpad ?? 0) * 2,
			borderRadius: options.br ?? (rect.height + (options.vpad ?? 0) * 2) / 2,
			backgroundColor: options.bg ?? 'white',
			mixBlendMode: options.mbm ?? 'difference',
			borderColor: options.bc ?? 'transparent',
			borderWidth: options.bw ?? 0
		},
		cursorPosition: {
			x: rect.left - (options.hpad ?? 0),
			y: rect.top - (options.vpad ?? 0)
		}
	};
}

export function createElementMeasureStore() {
	const { subscribe, set, update } = writable<ElementMeasurements | null>(null);

	function createMeasureFunction(
		measureLogic: (rect: DOMRect, options: MeasureOptions) => ElementMeasurements
	) {
		return (node: HTMLElement | SVGSVGElement, options: MeasureOptions) => {
			const update = async () => {
				await tick();
				let rect = node.getBoundingClientRect();
				set(measureLogic(rect, options));
			};

			update(); // Initial measurement

			window.addEventListener('resize', update);
			window.addEventListener('scroll', update);

			return {
				update,
				destroy: () => {
					window.removeEventListener('resize', update);
					window.removeEventListener('scroll', update);
				}
			};
		};
	}

	return {
		subscribe,
		set,
		update,
		underline: createMeasureFunction(underline),
		bubble: createMeasureFunction(bubble),
		reset: () => {
			isCursorHovered.set(false);
			cursorShape.set(DEFAULT_CURSOR_SHAPE);
		}
	};
}
