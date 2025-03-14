export interface Translation {
	x: number;
	y: number;
	rotAxis: { x: number; y: number; z: number };
	rotAngle: number;
}

export type Suit = 'Heart' | 'Diamond' | 'Club' | 'Spade';
