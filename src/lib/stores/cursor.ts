// src/stores/cursor.js
import { writable } from 'svelte/store';
import { spring, type Spring } from 'svelte/motion';

export const isCursorHovered = writable(false);

export interface CursorShapeParams {
	width: number;
	height: number;
	borderRadius: number;
	backgroundColor?: string;
	mixBlendMode?: string;
	borderWidth?: number;
	borderColor?: string;
	backdropFilter?: string;
}

export interface CursorPosition {
	x: number;
	y: number;
}

export interface CustomCursorShapeParams {
	width: Spring<number>;
	height: Spring<number>;
	borderRadius: Spring<number>;
	borderWidth?: Spring<number>;
	backgroundColor?: string;
	mixBlendMode?: string;
	borderColor?: string;
}

export interface CustomCursorPositionParams {
	x: Spring<number>;
	y: Spring<number>;
}

const POSITION_STIFFNESS = 0.5;
const POSITION_DAMPING = 0.9;
const POSITION_PRECISION = 0.01;

const WIDTH_STIFFNESS = 0.2;
const WIDTH_DAMPING = 0.7;

const HEIGHT_STIFFNESS = 0.2;
const HEIGHT_DAMPING = 0.7;

const BR_STIFFNESS = 0.13;
const BR_DAMPING = 0.9;

const BW_STIFFNESS = 0.13;
const BW_DAMPING = 0.9;

export const DEFAULT_CURSOR_SHAPE: CursorShapeParams = {
	width: 16,
	height: 16,
	borderRadius: 8,
	backgroundColor: 'white',
	mixBlendMode: 'difference',
	borderWidth: 0,
	borderColor: 'transparent',
	backdropFilter: 'none'
};

export const GLASS_CURSOR_SHAPE: CursorShapeParams = {
	width: 40,
	height: 40,
	backgroundColor: 'rgba(200, 200, 200, 0.7)',
	backdropFilter: 'blur(15px)',
	mixBlendMode: 'overlay',
	borderRadius: 22,
	borderColor: 'rgba(20, 20, 20, 1)',
	borderWidth: 2.5
};

export const cursorShape = writable<CursorShapeParams>(DEFAULT_CURSOR_SHAPE);

export const cursorPosition = writable({
	x: 0,
	y: 0
});

export const customCursorShape = writable<CustomCursorShapeParams>({
	width: spring(DEFAULT_CURSOR_SHAPE.width, {
		stiffness: WIDTH_STIFFNESS,
		damping: WIDTH_DAMPING
	}),
	height: spring(DEFAULT_CURSOR_SHAPE.height, {
		stiffness: HEIGHT_STIFFNESS,
		damping: HEIGHT_DAMPING
	}),
	borderRadius: spring(DEFAULT_CURSOR_SHAPE.borderRadius, {
		stiffness: BR_STIFFNESS,
		damping: BR_DAMPING
	}),
	borderWidth: spring(DEFAULT_CURSOR_SHAPE.borderWidth, {
		stiffness: BW_STIFFNESS,
		damping: BW_DAMPING
	}),
	backgroundColor: DEFAULT_CURSOR_SHAPE.backgroundColor,
	mixBlendMode: DEFAULT_CURSOR_SHAPE.mixBlendMode,
	borderColor: DEFAULT_CURSOR_SHAPE.borderColor
});

export const customCursorPosition = writable<CustomCursorPositionParams>({
	x: spring(0, {
		stiffness: POSITION_STIFFNESS,
		damping: POSITION_DAMPING,
		precision: POSITION_PRECISION
	}),
	y: spring(0, {
		stiffness: POSITION_STIFFNESS,
		damping: POSITION_DAMPING,
		precision: POSITION_PRECISION
	})
});

interface CustomCursorStore {
	setShape: (shape: CustomCursorShapeParams) => void;
	setPosition: (position: CustomCursorPositionParams) => void;
	resetShape: () => void;
}

function customCursorStore(): CustomCursorStore {
	function setShape(shape: CustomCursorShapeParams) {
		customCursorShape.update(() => shape);
	}

	function setPosition(position: CustomCursorPositionParams) {
		customCursorPosition.update(() => position);
	}

	function resetShape() {
		customCursorShape.update(() => ({
			width: spring(DEFAULT_CURSOR_SHAPE.width, {
				stiffness: WIDTH_STIFFNESS,
				damping: WIDTH_DAMPING
			}),
			height: spring(DEFAULT_CURSOR_SHAPE.height, {
				stiffness: HEIGHT_STIFFNESS,
				damping: HEIGHT_DAMPING
			}),
			borderRadius: spring(DEFAULT_CURSOR_SHAPE.borderRadius, {
				stiffness: BR_STIFFNESS,
				damping: BR_DAMPING
			}),
			borderWidth: spring(DEFAULT_CURSOR_SHAPE.borderWidth, {
				stiffness: BW_STIFFNESS,
				damping: BW_DAMPING
			}),
			backgroundColor: DEFAULT_CURSOR_SHAPE.backgroundColor,
			mixBlendMode: DEFAULT_CURSOR_SHAPE.mixBlendMode,
			borderColor: DEFAULT_CURSOR_SHAPE.borderColor
		}));
	}

	return {
		setShape,
		setPosition,
		resetShape
	};
}
