<script lang="ts">
	import { page } from '$app/state';
	import fallbackImage from '$lib/assets/thumbnails/arcd.jpg';

	const NAME = 'Artas Alajbegu';

	let {
		title,
		description,
		image = fallbackImage
	}: {
		title?: string;
		description: string;
		image?: string;
	} = $props();

	let fullTitle = $derived(title ? `${title} · ${NAME}` : `${NAME} · Design Engineer`);
	let canonical = $derived(page.url.origin + page.url.pathname);
	let imageUrl = $derived(new URL(image, page.url).href);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={NAME} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
