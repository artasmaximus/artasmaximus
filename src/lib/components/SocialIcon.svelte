<script lang="ts">
	export let iconName: string;
	export let href: string;
</script>

<div class="socialIcon">
	<a {href}><img src={`$lib/assets/${iconName}.png`} alt={iconName} /></a>
</div>

<style>
	.socialIcon {
		display: flex;
		align-items: center; /* Centers vertically */
		justify-content: center; /* Centers horizontally */
		cursor: pointer;
		transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
	}
	svg {
		display: block; /* Prevents inline SVG issues */
		width: 100%; /* Adjust width as needed */
		height: auto; /* Maintains aspect ratio */
	}
</style>
