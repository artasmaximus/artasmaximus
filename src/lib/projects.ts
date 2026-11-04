import arcdCover from '$lib/assets/thumbnails/arcd.jpg';
import boomfitCover from '$lib/assets/thumbnails/boomfit.jpg';
import minimotorwaysCover from '$lib/assets/thumbnails/minimotorways.svg';
import slimeCover from '$lib/assets/thumbnails/slime.jpg';

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
	/* Set when the cover is dark, so its title and the navbar over it go light. */
	coverTone?: 'dark';
	/* Cursor bubble fill on this project's links. Dark enough to carry white text. */
	accent: string;
	/* Reachable by URL, but left out of lists until it has imagery. */
	draft?: boolean;
}

const all: Project[] = [
	{
		slug: 'arcd',
		name: 'arcd',
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
		coverAlt: 'The four arcd aces: clubs, spades, hearts, and diamonds',
		accent: '#6452FF'
	},
	{
		slug: 'slimesimulation',
		name: 'Slime Simulation',
		summary:
			'A Physarum simulation in Unity, where thousands of agents following three rules form branching networks.',
		role: 'Developer',
		stack: 'Unity, compute shaders',
		context: 'Personal project',
		cover: slimeCover,
		coverAlt: 'Glowing violet and red trails winding across a black field',
		coverTone: 'dark',
		accent: '#00804B'
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
		coverTone: 'dark',
		accent: '#0F7F76'
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
		coverAlt: 'A mosaic of tiles showing roads, houses, and malls from the Mini Motorways recreation',
		accent: '#8A6B1F'
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
