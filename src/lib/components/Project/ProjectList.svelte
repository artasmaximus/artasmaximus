<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { navTheme } from '$lib/components/Navbar/NavbarState.svelte';
	import Reveal from '$lib/components/Reveal.svelte';
	import { projects } from '$lib/projects';
	import { BG, INK, SURFACE } from '$lib/theme';

	let tiles: HTMLElement[] = $state([]);

	// The navbar floats over the covers, so it flips light while a dark one sits behind it.
	function onScroll() {
		const navLine = navTheme.height / 2;
		navTheme.dark = projects.some((project, i) => {
			if (project.coverTone !== 'dark' || !tiles[i]) return false;
			const rect = tiles[i].getBoundingClientRect();
			return rect.top <= navLine && rect.bottom > navLine;
		});
	}

	onMount(() => {
		onScroll();
		return () => {
			navTheme.dark = false;
		};
	});
</script>

<svelte:window onscroll={onScroll} onresize={onScroll} />

<ul class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
	{#each projects as project, i (project.slug)}
		{@const dark = project.coverTone === 'dark'}
		<li>
			<Reveal>
				<div bind:this={tiles[i]} class="relative h-[70svh] md:h-[min(56.25vw,100svh)]">
					<img
						src={project.cover}
						alt={project.coverAlt}
						loading="lazy"
						decoding="async"
						class="absolute inset-0 h-full w-full object-cover"
					/>
					<div
						class="page absolute inset-0 flex flex-col items-start justify-end gap-4 pb-8 md:justify-center md:gap-5 md:pb-0"
					>
						<h2 class="text-title {dark ? 'text-white' : 'text-ink'}">{project.name}</h2>
						<Button
							href="/projects/{project.slug}"
							fill={dark ? SURFACE : INK}
							fillText={dark ? INK : BG}
							blend
							border={false}
							br={50}
							twclass="px-5 py-2.5"
						>
							View project<span class="sr-only">: {project.name}</span>
						</Button>
					</div>
				</div>
			</Reveal>
		</li>
	{/each}
</ul>
