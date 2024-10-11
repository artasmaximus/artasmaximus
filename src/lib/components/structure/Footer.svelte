<script lang="ts">
	import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
	import { appDetail } from '$lib/stores/appDetail';
</script>

<div class="footer">
	<div class="footerContent" style="width: {$appDetail.contentWidth}px">
		<div class="socialIcons">
			<SocialIcon
				iconName="facebook"
				href="https://www.facebook.com/profile.php?id=100009427889455"
			/>
			<SocialIcon iconName="github" href="https://github.com/artasmaximus" />
			<SocialIcon
				iconName="instagram"
				href="https://www.instagram.com/artasmaximus.a"
				borderRadius={13}
			/>
			<SocialIcon
				iconName="linkedin"
				href="https://www.linkedin.com/in/artasalajbegu/"
				borderRadius={8}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.footer {
		display: flex;
		position: relative;
		place-content: center;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		padding: 32px 0px;
		z-index: 10;
	}

	.footerContent {
		display: flex;
		justify-content: right;
	}

	.socialIcons {
		display: flex;
		height: auto;
		width: auto;
		gap: 4rem;
	}
</style>
