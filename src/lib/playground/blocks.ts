import rhythm from './rhythm.json';
import type { Block, Clip } from './rhythm';

const clips = rhythm as Record<string, Clip>;

function block(id: string, text: string, spoken?: Block['spoken']): Block {
	return { id, text, audio: `/playground/${id}.wav`, clip: clips[id], spoken };
}

/* Paragraph from the slime simulation project's "GPU Accelerated" section. */
export const gpuParagraph: Block[] = [
	block('gpu-1', 'The whole simulation is one compute shader with four kernels.'),
	block(
		'gpu-2',
		'One GPU thread per agent samples the trail map ahead of itself, steers, moves, and deposits.'
	),
	block(
		'gpu-3',
		'Two blur passes diffuse and fade the trails, and a last pass turns them into the image.'
	),
	block(
		'gpu-4',
		'By default that is a million agents on a 2560 x 1440 map, with room for two million.',
		{ '2560': 5, x: 1, '1440': 4 }
	)
];
