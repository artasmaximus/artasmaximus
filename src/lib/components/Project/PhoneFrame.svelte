<script lang="ts">
	let { src, alt = '' }: { src: string; alt?: string } = $props();
</script>

<div class="relative mx-auto w-full max-w-[250px]">
	<div class="absolute -right-[3px] top-20 h-12 w-[3px] rounded-r-sm bg-stone-700"></div>
	<div class="absolute -left-[3px] top-16 h-8 w-[3px] rounded-l-sm bg-stone-700"></div>
	<div class="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l-sm bg-stone-700"></div>
	<div
		class="relative overflow-hidden rounded-[2.4rem] border-[9px] border-stone-900 bg-stone-900 shadow-xl"
	>
		<img {src} {alt} loading="lazy" class="block w-full rounded-[1.85rem]" />
		<div
			class="absolute left-1/2 top-[10px] h-[14px] w-16 -translate-x-1/2 rounded-full bg-stone-900"
		></div>
	</div>
</div>
