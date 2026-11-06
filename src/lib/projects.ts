import arcdCover from '$lib/assets/thumbnails/arcd.jpg';
import boomfitCover from '$lib/assets/thumbnails/boomfit.jpg';
import sanityCheckCover from '$lib/assets/thumbnails/data-sanity-check.svg';
import minimotorwaysCover from '$lib/assets/thumbnails/minimotorways.svg';
import slimeCover from '$lib/assets/thumbnails/slime.jpg';

export interface Project {
	slug: string;
	name: string;
	summary: string;
	/* A few words for the homepage index, so it doesn't repeat the project page's subtitle. */
	blurb: string;
	year?: string;
	role?: string;
	stack: string;
	context?: string;
	links?: { label: string; href: string }[];
	cover?: string;
	coverAlt?: string;
	/* Set when the cover is dark, so its title and the navbar over it go light. */
	coverTone?: 'dark';
	/* Reachable by URL, but left out of lists until it has imagery. */
	draft?: boolean;
}

/* The order here is the order on the homepage index and the projects page. */
const all: Project[] = [
	{
		slug: 'data-sanity-check',
		name: 'Sanity Check',
		blurb: 'A custom Streamlit app for report creation.',
		summary:
			'A Streamlit tool that replaced a days-long notebook workflow with a client data report you can generate in about two minutes.',
		role: 'Developer and designer',
		stack: 'Streamlit · Snowflake · Python · HTML/CSS',
		context: 'Work project',
		cover: sanityCheckCover,
		coverAlt:
			'A light report window with a sidebar and four small charts, with stacked pages behind it'
	},
	{
		slug: 'slimesimulation',
		name: 'Slime Simulation',
		blurb: 'An exploration of emergence.',
		summary:
			'A Physarum simulation in Unity, where millions of agents self-organize into emergent structures from local rules.',
		role: 'Developer',
		stack: 'Unity 6 · C# · HLSL compute shaders',
		context: 'Personal project',
		cover: slimeCover,
		coverAlt: 'Glowing violet and red trails winding across a black field',
		coverTone: 'dark'
	},
	{
		slug: 'arcd',
		name: 'arcd',
		blurb: 'An exercise in theming and consistency.',
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
		coverAlt: 'The four arcd aces: clubs, spades, hearts, and diamonds'
	},
	{
		slug: 'boomfit',
		name: 'BoomFit',
		blurb: 'A fitness app prototype for older adults.',
		summary:
			'A fitness app prototype that turns lifestyle aspirations into achievable workout plans for older adults.',
		year: '2022',
		role: 'UX design, with Natalie',
		stack: 'Figma',
		context: 'CMU XHacks',
		links: [{ label: 'Prototype', href: 'https://figma.fun/upfXT4' }],
		cover: boomfitCover,
		coverAlt: 'The BoomFit sign-in screen on a phone',
		coverTone: 'dark'
	},
	{
		slug: 'minimotorways',
		name: 'Mini Motorways',
		blurb: 'The Apple Arcade game, recreated in Python.',
		summary:
			'A recreation of the Apple Arcade game built from scratch in Python, with custom pathfinding and traffic simulation.',
		year: '2022',
		role: 'Developer',
		stack: 'Python, PyGame',
		context: 'University term project',
		links: [{ label: 'Video', href: 'https://www.youtube.com/watch?v=GaAHKJQ6lcY' }],
		cover: minimotorwaysCover,
		coverAlt: 'A mosaic of tiles showing roads, houses, and malls from the Mini Motorways recreation'
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
