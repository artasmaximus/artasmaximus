<script>
	import Button from '$lib/components/ui/Button.svelte';
	import resume from '$lib/assets/Resume.jpg';
	import resumepdf from '$lib/assets/RESUME.pdf';
</script>

<div class="hero">
	<h1>Resume</h1>
	<Button href={resumepdf} label="Download" downloadName="Artas' Resume" />
</div>
<div class="resume">
	<img src={resume} alt="" />
</div>

<style lang="scss">
	.hero {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		gap: 25px;
		padding: 64px 0px;
		text-align: center;
		h1 {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 42px;
			font-style: normal;
			font-weight: 800;
			line-height: normal;
			letter-spacing: -2px;
		}

		p {
			color: #2e2e2e;
			color: color(display-p3 0.1804 0.1804 0.1804);
			text-align: center;
			font-family: Urbanist;
			font-size: 24px;
			font-style: normal;
			font-weight: 300;
			line-height: normal;
			letter-spacing: -0.24px;
			width: 80%;
			margin: 0;
		}
	}

	.resume {
		display: flex;
		justify-content: center;
		align-items: center;
		border: #2e2e2e;
		padding: 32px;
		overflow: hidden;
		img {
			border-radius: 15px;
			width: 100%;
			max-width: 800px;
		}
	}
</style>
