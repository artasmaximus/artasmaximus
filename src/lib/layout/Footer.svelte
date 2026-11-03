<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import { SocialsInfo } from '$lib/icons/IconPaths';
	import { RESUME_FILENAME, resumeUrl } from '$lib/nav';
</script>

<footer class="page pb-10">
	<div class="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
		<p class="text-small text-ink-muted">Artas Alajbegu</p>
		<div class="-mr-3 flex gap-1">
			<Button href={SocialsInfo.linkedin.href} external twclass="px-3 py-1" br={50} border={false}>
				LinkedIn
			</Button>
			<Button href={SocialsInfo.github.href} external twclass="px-3 py-1" br={50} border={false}>
				GitHub
			</Button>
			<Button
				href={resumeUrl}
				download={RESUME_FILENAME}
				twclass="px-3 py-1"
				br={50}
				border={false}
			>
				Resume
			</Button>
		</div>
	</div>
</footer>
