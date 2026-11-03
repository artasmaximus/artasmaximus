import { redirect, type Handle } from '@sveltejs/kit';

// URLs are lowercase. Older links (/Projects/arcd, /Artwork) keep working.
export const handle: Handle = ({ event, resolve }) => {
	const { pathname, search } = event.url;
	const lower = pathname.toLowerCase();

	if (pathname !== lower && !pathname.includes('.') && !pathname.startsWith('/_app/')) {
		redirect(308, lower + search);
	}

	return resolve(event);
};
