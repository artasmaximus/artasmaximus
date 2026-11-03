import resume from '$lib/assets/resume/Resume.pdf?url';

export const RESUME_FILENAME = 'Artas-Alajbegu-Resume.pdf';
export const resumeUrl = resume;

export const navItems: { label: string; href: string; download?: string }[] = [
	{ label: 'Projects', href: '/projects' },
	{ label: 'Artwork', href: '/artwork' },
	{ label: 'Resume', href: resumeUrl, download: RESUME_FILENAME }
];
