<script lang="ts">
	import Artwork from '$lib/components/Artwork/Artwork.svelte';
	import GradientText from '$lib/components/GradientText.svelte';
	import Section from '$lib/layout/Section.svelte';
	import resumeImg from '$lib/assets/resume/resume.png';
</script>

<Section>
	<div class="flex w-full flex-col items-center gap-16 pb-24 pt-12 md:pt-0">
		<GradientText text="Resume" twclass="text-4xl whitespace-nowrap" to="#FF48CE"></GradientText>

		<div class="w-full max-w-2xl">
			<Artwork src={resumeImg} alt="Resume" />
		</div>
	</div>
</Section>
