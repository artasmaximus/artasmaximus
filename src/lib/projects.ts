import minimotorwaysCover from '$lib/assets/minimotorways/rules.jpg';
import arcdCover from '$lib/assets/thumbnails/arcd.jpg';
import boomfitCover from '$lib/assets/thumbnails/boomfit.jpg';

export interface Project {
	slug: string;
	name: string;
	summary: string;
	year?: string;
	role?: string;
	stack: string;
	context?: string;
	links?: { label: string; href: string }[];
	cover?: string;
	coverAlt?: string;
	/* Cursor bubble fill on this project's links. Dark enough to carry white text. */
	accent: string;
	dotPrimary: string;
	dotBlink: string;
	/* Reachable by URL, but left out of lists until it has imagery. */
	draft?: boolean;
}

const all: Project[] = [
	{
		slug: 'arcd',
		name: 'ARCD',
		summary:
			'A 52-card deck that rebuilds the four suits from nothing but rectangles and circular arcs.',
		year: '2021–ongoing',
		role: 'Designer',
		stack: 'Figma',
		context: 'Personal project',
		links: [
			{
				label: 'Figma file',
				href: 'https://www.figma.com/design/eRPB90nCMuDbk89wBRW5zW/Card-Deck-Master'
			}
		],
		cover: arcdCover,
		coverAlt: 'The four ARCD aces: clubs, spades, hearts, and diamonds',
		accent: '#6452FF',
		dotPrimary: '#E5E1F6',
		dotBlink: '#B7ACEF'
	},
	{
		slug: 'boomfit',
		name: 'BoomFit',
		summary:
			'A fitness app prototype that turns lifestyle aspirations into achievable workout plans for older adults.',
		year: '2022',
		role: 'UX design, with Natalie',
		stack: 'Figma',
		context: 'CMU XHacks',
		links: [{ label: 'Prototype', href: 'https://figma.fun/upfXT4' }],
		cover: boomfitCover,
		coverAlt: 'The BoomFit sign-in screen on a phone',
		accent: '#0F7F76',
		dotPrimary: '#DCEEEA',
		dotBlink: '#8FD9CC'
	},
	{
		slug: 'minimotorways',
		name: 'Mini Motorways',
		summary:
			'A recreation of the Apple Arcade game built from scratch in Python, with custom pathfinding and traffic simulation.',
		year: '2022',
		role: 'Developer',
		stack: 'Python, PyGame',
		context: 'University term project',
		links: [{ label: 'Video', href: 'https://www.youtube.com/watch?v=GaAHKJQ6lcY' }],
		cover: minimotorwaysCover,
		coverAlt: 'The rules screen of the Mini Motorways recreation',
		accent: '#8A6B1F',
		dotPrimary: '#E9E3D3',
		dotBlink: '#CDBE8E'
	},
	{
		slug: 'slimesimulation',
		name: 'Slime Simulation',
		summary:
			'A Physarum simulation in Unity, where thousands of agents following three rules form branching networks.',
		role: 'Developer',
		stack: 'Unity, compute shaders',
		context: 'Personal project',
		accent: '#00804B',
		dotPrimary: '#DCEEE2',
		dotBlink: '#7FDFAC',
		draft: true
	}
];

export const projects = all.filter((project) => !project.draft);

export function getProject(slug: string): Project {
	const project = all.find((p) => p.slug === slug);
	if (!project) throw new Error(`Unknown project: ${slug}`);
	return project;
}

export function nextProject(slug: string): Project {
	const i = projects.findIndex((p) => p.slug === slug);
	return projects[(i + 1) % projects.length];
}
