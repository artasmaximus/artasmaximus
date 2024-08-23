<script lang="ts">
	export let href = '';
	export let active = false;
</script>

<div class="link">
	<a {href} class:active>
		<slot></slot>
	</a>
</div>

<style>
	.link {
		font-family: 'Urbanist', sans-serif;
		place-content: center;
	}
	.link a {
		text-decoration: none;
		color: #1a1a1a;
		font-weight: 300;
		min-width: 120px; /* Adjust this value to match the longest link */
		width: 100%;
		display: inline-block; /* Ensure that the min-width applies correctly */
		text-align: center; /* Optional: to center the text within the block */
		transition:
			font-weight 0.07s ease-in,
			color 0.07s ease-in-out,
			letter-spacing 0.07s ease-in-out;
	}

	.link a.active {
		font-weight: 700;
	}

	.link a:hover {
		color: black;
		font-kerning: normal;
		letter-spacing: 0.1em;
	}
</style>
