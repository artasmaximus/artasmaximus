<script lang="ts">
	import Clickable from './Clickable.svelte';

	export let href = '';
	export let active = false;
	let options = { padding_x: 16, padding_y: 8, borderRadius: '50vh' };
</script>

<div class="link">
	<Clickable>
		<a {href} class:active>
			<slot></slot>
		</a>
	</Clickable>
</div>

<style>
	.link {
		display: flex;
		font-family: 'Urbanist', sans-serif;
		place-content: center;
		place-items: center;
		align-items: center;
		width: 100px;
	}
	.link a {
		text-decoration: none;
		font-weight: 300;
		width: auto;
		display: inline-block; /* Ensure that the min-width applies correctly */
		text-align: center; /* Optional: to center the text within the block */
		color: #000;
		color: color(display-p3 0 0 0);
		font-family: Urbanist;
		font-size: 18px;
		font-style: normal;
		line-height: normal;
		letter-spacing: -0.54px;
	}

	.link a.active {
		font-weight: 700;
		/* cursor: none; */
	}

	.link a:hover {
		color: black;
		transition:
			color 0.2s,
			font-weight 0.2s;
		width: 0.3s;
		/* cursor: none; */
	}
</style>
