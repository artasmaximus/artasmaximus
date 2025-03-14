import { Spring } from 'svelte/motion';

let POSITION_STIFFNESS = 0.7;
let POSITION_DAMPING = 0.8;
let POSITION_PRECISION = 0.01;

let SIZE_STIFFNESS = 0.2;
let SIZE_DAMPING = 0.7;

export const DEFAULT_SHAPE = { width: 16, height: 16, borderRadius: 8 };
export const DEFAULT_STYLE: CursorStyleParams = {
	background: 'white',
	'mix-blend-mode': 'difference',
	'border-color': 'transparent',
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
	'backdrop-filter': string;
	'z-index'?: number;
}

export function textCursor(
	color: string,
	width: number,
	height: number
): { shape: CursorShapeParams; style: CursorStyleParams } {
	return {
		shape: { width, height, borderRadius: width / 2 },
		style: {
			background: color,
			'mix-blend-mode': 'normal',
			'border-color': 'transparent',
			'backdrop-filter': 'none'
		}
	};
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
	}

	getPosition() {
		return {
			x: this.position.current.x,
			y: this.position.current.y
		};
	}

	getShape() {
		return {
			width: this.shape.current.width,
			height: this.shape.current.height,
			borderRadius: this.shape.current.borderRadius
		};
	}

	getStyle() {
		return {
			background: this.style['background'],
			'mix-blend-mode': this.style['mix-blend-mode'],
			'border-color': this.style['border-color'],
			'backdrop-filter': this.style['backdrop-filter']
		};
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
