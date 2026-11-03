import { redirect } from '@sveltejs/kit';
import resume from '$lib/assets/resume/Resume.pdf?url';

// The nav downloads the PDF directly. This keeps /resume as a shareable link.
export const GET = () => redirect(302, resume);
