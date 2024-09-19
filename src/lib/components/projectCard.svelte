<script lang="ts">
	import { onMount } from 'svelte';

	export let title: string;
	export let description: string;
	export let href: string;
	export let imgSrc: string;
	export let imgAlt: string;

	let src: any;
	onMount(async () => {
		src = (await import(`$lib/assets/${imgSrc}.png`)).default;
	});
</script>

<div class="projectCard">
	<div class="image">
		<img {src} alt={imgAlt} />
	</div>
	<div class="title">
		<a {href}>{title}</a>
	</div>
	<div class="description">
		<p>{description}</p>
	</div>
</div>

<style lang="scss">
	.projectCard {
		display: inline-flex;
		padding: 20px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		border-radius: 30px;
		width: 300px;
		position: relative;
		.image {
			position: relative;
			width: 100%;
			img {
				width: 100%;
				border-radius: 15px;
			}
		}
		.title {
			font-size: 24px;
			font-weight: bold;
			width: 100%;

			a {
				text-align: left;
				font-family: 'Playfair Display', serif;
				font-weight: 800;
				text-decoration: none;
				color: #000;
				cursor: none;
			}
		}
		.description {
			font-size: 1em;
			width: 100%;
			p {
				color: #000;
				color: color(display-p3 0 0 0);
				font-family: Urbanist;
				font-size: 14px;
				font-style: normal;
				font-weight: 300;
				line-height: normal;
				margin: 0;
			}
		}
	}
</style>
