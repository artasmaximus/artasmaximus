import type { Config } from 'tailwindcss';
import { BG, INK, INK_MUTED, INK_SUBTLE, LINE, SURFACE } from './src/lib/theme';

// colors, fontSize, and fontWeight replace Tailwind's defaults rather than
// extending them, so anything off the system simply doesn't compile to a style.
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: '#FFFFFF',
			black: '#000000',
			bg: BG,
			surface: SURFACE,
			line: LINE,
			ink: {
				DEFAULT: INK,
				muted: INK_MUTED,
				subtle: INK_SUBTLE
			}
		},

		fontFamily: {
			sans: [
				'Inter Variable',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Helvetica',
				'Arial',
				'sans-serif'
			]
		},

		fontSize: {
			// Home statement
			display: [
				'clamp(2.75rem, 1.75rem + 4.25vw, 5.5rem)',
				{ lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '500' }
			],
			// Page and project titles
			title: [
				'clamp(2.25rem, 1.75rem + 2vw, 3.5rem)',
				{ lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '500' }
			],
			// Section headings, project names
			heading: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '500' }],
			// Summaries and intros
			lead: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
			body: ['1rem', { lineHeight: '1.6', letterSpacing: '-0.006em' }],
			// Nav, buttons, captions, fact values
			small: ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.003em' }],
			// Eyebrows and fact labels
			label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }]
		},

		fontWeight: {
			normal: '400',
			medium: '500',
			semibold: '600'
		},

		extend: {
			maxWidth: {
				content: '75rem',
				prose: '38rem'
			},
			spacing: {
				gutter: 'clamp(1.25rem, 5vw, 4rem)',
				section: 'clamp(4rem, 10vw, 8rem)'
			}
		}
	},

	plugins: []
} satisfies Config;
