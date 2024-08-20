<script lang="ts">
</script>

<div class="bg">
	<div class="frostedGlass">
		<div class="purple"></div>
		<div class="pink"></div>
		<div class="blue"></div>
		<div class="yellow"></div>
	</div>
</div>

<style>
	.bg {
		position: fixed; /* Ensure the background stays fixed */
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden; /* Ensure the overflow is hidden to prevent scrollbars */
		z-index: -1; /* Place behind all content */
	}

	.frostedGlass {
		position: absolute;
		top: -5%;
		left: -5%;
		width: 110%;
		height: 110%;
		filter: blur(100px);
	}

	.purple,
	.pink,
	.blue,
	.yellow {
		position: absolute;
		border-radius: 50%;
	}

	.purple {
		background-color: #c0a2ff;
		width: 46vw;
		height: 46vw;
		bottom: -23vw;
		left: -23vw;
	}

	.pink {
		background-color: #ff78b1;
		width: 33vw;
		height: 33vw;
		bottom: -16.5vw;
		left: 26vw;
	}

	.blue {
		background-color: #a2d2ff; /* Apply the background color */
		width: 50vw; /* Set a specific size for the blue circle */
		height: 50vw;
		top: 15vw; /* Adjust position to where you want it */
		right: -12.5vw; /* Adjust position to where you want it */
	}

	.yellow {
		background-color: #ffeaa2; /* Apply the background color */
		width: 32vw; /* Set a specific size for the yellow circle */
		height: 32vw;
		top: -10vw; /* Adjust position to where you want it */
		left: 18vw; /* Adjust position to where you want it */
	}
</style>
