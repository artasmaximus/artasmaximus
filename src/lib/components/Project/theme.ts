export interface ProjectTheme {
	name: string;
	from: string;
	to: string;
	/* darker accent that stays readable as small text on the stone-50 background */
	accent: string;
	dotPrimary: string;
	dotBlink: string;
}

export const themes: Record<string, ProjectTheme> = {
	minimotorways: {
		name: 'Mini Motorways',
		from: '#494435',
		to: '#F7D282',
		accent: '#A8842B',
		dotPrimary: '#E9E3D3',
		dotBlink: '#CDBE8E'
	},
	arcd: {
		name: 'ARCD',
		from: '#D1005D',
		to: '#6452FF',
		accent: '#6452FF',
		dotPrimary: '#E5E1F6',
		dotBlink: '#B7ACEF'
	},
	boomfit: {
		name: 'BoomFit',
		from: '#FF6B6B',
		to: '#4ECDC4',
		accent: '#17A398',
		dotPrimary: '#DCEEEA',
		dotBlink: '#8FD9CC'
	},
	slimesimulation: {
		name: 'Slime Simulation',
		from: '#1AFF8C',
		to: '#0066FF',
		accent: '#00A661',
		dotPrimary: '#DCEEE2',
		dotBlink: '#7FDFAC'
	}
};
