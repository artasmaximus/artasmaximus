<script lang="ts">
	const { children } = $props();
</script>

<section
	class="mb-20 flex w-full snap-start flex-col items-start justify-start px-[10vw] md:mb-[10vw]"
>
	{@render children({})}
</section>
