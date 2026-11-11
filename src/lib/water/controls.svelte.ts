import { WATER_DEFAULTS, type WaterSettings } from './water';

/* One live set of water settings a page can share across all its WaterEffects;
   effects read it every frame, so slider changes apply immediately. */
export const liveWater: WaterSettings = $state({ ...WATER_DEFAULTS });

export function resetWater() {
	Object.assign(liveWater, WATER_DEFAULTS);
}

export type WaterControl = {
	key: keyof WaterSettings;
	label: string;
	min: number;
	max: number;
	step: number;
};

/* Grouped the way you'd describe the scene. Ranges run well past the tuned
   defaults, for exploring; the far ends can get wild. */
export const WATER_CONTROLS: { label: string; hint: string; controls: WaterControl[] }[] = [
	{
		label: 'The liquid',
		hint: 'What the water is like',
		controls: [
			{ key: 'viscosity', label: 'Thickness', min: 0, max: 1.25, step: 0.01 },
			{ key: 'force', label: 'Cling', min: 0, max: 2, step: 0.01 },
			{ key: 'cap', label: 'Swell limit', min: 0.05, max: 6, step: 0.05 },
			{ key: 'pace', label: 'Pace (how fast it plays)', min: 0.05, max: 2, step: 0.01 },
			{ key: 'linger', label: 'Linger (how long it lasts)', min: 0, max: 0.99, step: 0.01 }
		]
	},
	{
		label: 'The needle',
		hint: 'How you touch it',
		controls: [
			{ key: 'needleSize', label: 'Size', min: 0.002, max: 0.15, step: 0.001 },
			{ key: 'lift', label: 'Lift (negative dimples)', min: -1.5, max: 3, step: 0.05 },
			{ key: 'press', label: 'Press depth', min: 0, max: 5, step: 0.05 },
			{ key: 'trail', label: 'Drag behind', min: 0, max: 0.98, step: 0.01 }
		]
	},
	{
		label: 'The light',
		hint: 'How it bends the image',
		controls: [
			{ key: 'strength', label: 'Refraction', min: 0, max: 1, step: 0.005 },
			{ key: 'terms', label: 'Crest sharpness', min: 1, max: 12, step: 1 },
			{ key: 'freq', label: 'Color bands', min: 1, max: 120, step: 1 },
			{ key: 'chroma', label: 'Color split', min: 0, max: 4, step: 0.05 }
		]
	}
];
