import { Spring } from 'svelte/motion';

export const GOLDEN_RATIO = 0.1618;

let POSITION_STIFFNESS = 0.7;
let POSITION_DAMPING = 0.8;
let POSITION_PRECISION = 0.01;

let SIZE_STIFFNESS = 0.2;
// Slightly underdamped so shape changes (dot -> glass, bubble swallow) land with a subtle bounce.
let SIZE_DAMPING = 0.6;

export const DEFAULT_SHAPE = { width: 16, height: 16, borderRadius: 8 };
export const DEFAULT_STYLE: CursorStyleParams = {
	background: 'white',
	'mix-blend-mode': 'difference',
	'border-color': 'transparent',
	'border-width': '0px',
	'backdrop-filter': 'none',
	'z-index': 9999
};

export const GLASS_CURSOR_STYLE: CursorStyleParams = {
	background: 'rgba(200, 200, 200, 0.7)',
	'backdrop-filter': 'blur(15px)',
	'mix-blend-mode': 'overlay',
	'border-color': 'rgba(20, 20, 20, 1)'
};

export const GLASS_CURSOR_SHAPE: CursorShapeParams = {
	width: 40,
	height: 40,
	borderRadius: 20
};

// Over anything clickable that isn't a button: a thin ring that breathes slowly.
// It stays difference-blended so it reads on light and dark grounds alike.
export const LINK_CURSOR_SHAPE: CursorShapeParams = { width: 34, height: 34, borderRadius: 17 };
export const LINK_CURSOR_STYLE: CursorStyleParams = {
	background: 'transparent',
	'mix-blend-mode': 'difference',
	'border-color': 'white',
	'border-width': '2px',
	'backdrop-filter': 'none',
	'z-index': 9999,
	animation: 'cursor-pulse 1.8s ease-in-out infinite'
};

export interface CursorPositionParams {
	x: number;
	y: number;
}

export interface CursorShapeParams {
	width: number;
	height: number;
	borderRadius: number;
}

export interface CursorStyleParams {
	background: string;
	'mix-blend-mode': string;
	'border-color': string;
	'border-width'?: string;
	'backdrop-filter': string;
	'z-index'?: number;
	animation?: string;
}

// The text caret takes the color of the text it sits over.
export function textCursorStyle(color: string): CursorStyleParams {
	return {
		background: color,
		'mix-blend-mode': 'normal',
		'border-color': 'transparent',
		'backdrop-filter': 'none'
	};
}

export function textCursorShape(height: number, width = 3): CursorShapeParams {
	return { width, height, borderRadius: width / 2 };
}

export type ClickEffect = (
	shape: CursorShapeParams,
	style: CursorStyleParams
) => { newShape: CursorShapeParams; newStyle: CursorStyleParams };

type HoverTargetPos = CursorPositionParams;

class CursorState {
	isLockedPos = $state(false);
	isHovering = $state(false);

	HoverTargetPos = $state<HoverTargetPos>({ x: 0, y: 0 });

	// How far a locked cursor leans toward the real pointer (0 = pinned to its target).
	lockPull = GOLDEN_RATIO;

	position = new Spring(
		{ x: 50, y: 50 },
		{
			stiffness: POSITION_STIFFNESS,
			damping: POSITION_DAMPING,
			precision: POSITION_PRECISION
		}
	);

	shape = new Spring(
		{ width: 16, height: 16, borderRadius: 8 },
		{
			stiffness: SIZE_STIFFNESS,
			damping: SIZE_DAMPING
		}
	);

	style = $state(DEFAULT_STYLE);

	reset() {
		this.shape.target = DEFAULT_SHAPE;
		this.style = DEFAULT_STYLE;
		this.isLockedPos = false;
		this.isHovering = false;
		this.lockPull = GOLDEN_RATIO;
	}

	getCenter() {
		return {
			x: this.position.current.x + this.shape.current.width / 2,
			y: this.position.current.y + this.shape.current.height / 2
		};
	}

	setPosition(pos: CursorPositionParams) {
		this.position.target = pos;
	}

	setShape(shape: CursorShapeParams) {
		this.shape.target = shape;
	}

	setStyle(style: CursorStyleParams) {
		this.style = style;
	}
}

export const cursorState = new CursorState();
