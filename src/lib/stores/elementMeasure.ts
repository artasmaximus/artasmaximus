import { writable } from 'svelte/store';
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
	background?: string;
	blendMode?: string;
	underlineDistance?: number;
	borderRadius?: number;
}

export interface BubbleOptions {
	hPadding?: number;
	vPadding?: number;
	borderRadius?: number;
	background?: string;
	blendMode?: string;
	borderWidth?: number;
	borderColor?: string;
}

type MeasureOptions = UnderlineOptions | BubbleOptions;

function underline(rect: DOMRect, options: UnderlineOptions): ElementMeasurements {
	return {
		cursorShape: {
			width: rect.width,
			height: options.thickness ?? 3,
			borderRadius: options.borderRadius ?? (options.thickness ?? 3) / 2,
			backgroundColor: options.background ?? 'white',
			mixBlendMode: options.blendMode ?? 'difference'
		},
		cursorPosition: {
			x: rect.left,
			y: rect.bottom + (options.underlineDistance ?? 2)
		}
	};
}

function bubble(rect: DOMRect, options: BubbleOptions): ElementMeasurements {
	return {
		cursorShape: {
			width: rect.width + (options.hPadding ?? 0) * 2,
			height: rect.height + (options.vPadding ?? 0) * 2,
			borderRadius: options.borderRadius ?? (rect.height + (options.vPadding ?? 0) * 2) / 2,
			backgroundColor: options.background ?? 'white',
			mixBlendMode: options.blendMode ?? 'difference',
			borderColor: options.borderColor ?? 'transparent',
			borderWidth: options.borderWidth ?? 0
		},
		cursorPosition: {
			x: rect.left - (options.hPadding ?? 0),
			y: rect.top - (options.vPadding ?? 0)
		}
	};
}

export function createElementMeasureStore() {
	const { subscribe, set, update } = writable<ElementMeasurements | null>(null);

	function createMeasureFunction(
		measureLogic: (rect: DOMRect, options: MeasureOptions) => ElementMeasurements
	) {
		return (node: HTMLElement | SVGSVGElement, options: MeasureOptions) => {
			const update = () => {
				let rect = node.getBoundingClientRect();
				set(measureLogic(rect, options));
			};

			setTimeout(update, 150);

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
