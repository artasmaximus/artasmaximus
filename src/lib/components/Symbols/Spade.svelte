<script lang="ts">
	import {
		type CursorShapeParams,
		DEFAULT_STYLE,
		GLASS_CURSOR_SHAPE,
		cursorState
	} from '$lib/cursor/CursorState.svelte.ts';
	import HoverEffect from '$lib/cursor/effects/HoverEffect.svelte';
	import { type Translation } from './SymbolTypes.svelte';
	import { Spring } from 'svelte/motion';

	const hoverShape = (): CursorShapeParams => ({
		...GLASS_CURSOR_SHAPE,
		width: 18,
		height: 18,
		borderRadius: 3
	});

	let nullT = {
		x: 0,
		y: 0,
		rotAxis: { x: 0, y: 1, z: 0 },
		rotAngle: 0
	};

	let innerT = new Spring<Translation>(nullT);
	let outerT = new Spring<Translation>(nullT);

	let innerNode = $state<HTMLElement>();
	let outerNode = $state<HTMLElement>();

	function onmousemove(e: MouseEvent) {
		if (outerNode) {
			let { top, left, width, height } = outerNode.getBoundingClientRect();
			let cx = left + width / 2;
			let cy = top + height / 2;
			let dmcx = e.clientX - cx;
			let dmcy = e.clientY - cy;

			// Calculate rotation axis perpendicular to mouse movement
			const L = {
				x: -dmcy,
				y: dmcx,
				z: 0
			};

			// Calculate rotation angle based on distance
			const distance = Math.sqrt(dmcx * dmcx + dmcy * dmcy);
			const angle = distance * 0.1;

			innerT.target = {
				x: dmcx * 0.11,
				y: dmcy * 0.11,
				rotAxis: L,
				rotAngle: angle * 1.2
			};
			outerT.target = {
				x: dmcx * 0.1,
				y: dmcy * 0.1,
				rotAxis: L,
				rotAngle: angle
			};
		}
	}

	let innerStyle = $derived.by(() => {
		let { x, y, rotAxis, rotAngle } = innerT.current;
		return `transform: translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) rotate3d(${rotAxis.x}, ${rotAxis.y}, ${rotAxis.z}, ${rotAngle}deg)`;
	});

	let outerStyle = $derived.by(() => {
		let { x, y, rotAxis, rotAngle } = outerT.current;
		return `transform: translate3d(${x}px, ${y}px, 0) rotate3d(${rotAxis.x}, ${rotAxis.y}, ${rotAxis.z}, ${rotAngle}deg)`;
	});

	// Rest of the component remains the same...
</script>

{#snippet outer()}
	<svg
		width="274"
		height="319"
		viewBox="0 0 274 319"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<mask id="path-1-inside-1_0_1" fill="white">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M137.42 227.058C106.178 258.3 55.5253 258.3 24.2834 227.058C-6.95856 195.816 -6.95856 145.163 24.2834 113.921C24.3954 113.809 24.5078 113.697 24.6203 113.586L137.422 0.784296L250.559 113.921L250.558 113.922C281.799 145.164 281.799 195.817 250.557 227.058C219.315 258.3 168.662 258.3 137.42 227.058Z"
			/>
		</mask>
		<path
			d="M137.42 227.058L114.793 204.431L137.42 181.804L160.048 204.431L137.42 227.058ZM24.6203 113.586L47.2477 136.214L47.1819 136.279L47.1158 136.345L24.6203 113.586ZM137.422 0.784296L114.795 -21.8431L137.422 -44.4705L160.05 -21.8431L137.422 0.784296ZM250.559 113.921L273.187 91.294L295.814 113.921L273.187 136.549L250.559 113.921ZM250.558 113.922L227.93 136.549L205.304 113.922L227.931 91.295L250.558 113.922ZM160.048 249.686C116.309 293.424 45.3946 293.424 1.65597 249.686L46.9108 204.431C65.6559 223.176 96.0478 223.176 114.793 204.431L160.048 249.686ZM1.65597 249.686C-42.0828 205.947 -42.0828 135.033 1.65597 91.2938L46.9108 136.549C28.1656 155.294 28.1656 185.686 46.9108 204.431L1.65597 249.686ZM1.65597 91.2938C1.81189 91.1379 1.96818 90.9825 2.12485 90.8276L47.1158 136.345C47.0473 136.413 46.979 136.48 46.9108 136.549L1.65597 91.2938ZM1.99289 90.9588L114.795 -21.8431L160.05 23.4117L47.2477 136.214L1.99289 90.9588ZM160.05 -21.8431L273.187 91.294L227.932 136.549L114.795 23.4117L160.05 -21.8431ZM273.187 136.549L273.186 136.55L227.931 91.295L227.932 91.294L273.187 136.549ZM227.93 204.431C246.675 185.686 246.675 155.295 227.93 136.549L273.186 91.2954C316.923 135.034 316.923 205.948 273.185 249.686L227.93 204.431ZM160.048 204.431C178.793 223.176 209.185 223.176 227.93 204.431L273.185 249.686C229.446 293.424 158.532 293.424 114.793 249.686L160.048 204.431Z"
			fill="url(#paint0_linear_0_1)"
			style=""
			mask="url(#path-1-inside-1_0_1)"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M154.393 277.97C163.765 287.343 163.765 302.539 154.392 311.911C145.02 321.284 129.824 321.284 120.451 311.911C111.079 302.539 111.079 287.343 120.451 277.97C120.475 277.947 120.498 277.924 120.521 277.901L137.422 261L154.393 277.97L154.393 277.97Z"
			fill="url(#paint1_linear_0_1)"
			style=""
		/>
		<defs>
			<linearGradient
				id="paint0_linear_0_1"
				x1="137.421"
				y1="21.4915"
				x2="137.422"
				y2="249.134"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stop-color="#9CF9FF"
					style="stop-color:#9CF9FF;stop-color:color(display-p3 0.6134 0.9756 1.0000);stop-opacity:1;"
				/>
				<stop
					offset="1"
					stop-color="#593FFF"
					style="stop-color:#593FFF;stop-color:color(display-p3 0.3490 0.2471 1.0000);stop-opacity:1;"
				/>
			</linearGradient>
			<linearGradient
				id="paint1_linear_0_1"
				x1="137.422"
				y1="419.451"
				x2="137.422"
				y2="261"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stop-color="#9CF9FF"
					style="stop-color:#9CF9FF;stop-color:color(display-p3 0.6118 0.9765 1.0000);stop-opacity:1;"
				/>
				<stop
					offset="1"
					stop-color="#593FFF"
					style="stop-color:#593FFF;stop-color:color(display-p3 0.3490 0.2471 1.0000);stop-opacity:1;"
				/>
			</linearGradient>
		</defs>
	</svg>
{/snippet}

{#snippet inner()}
	<svg
		width="210"
		height="173"
		viewBox="0 0 210 173"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_i_883_17446)">
			<mask id="path-1-inside-1_883_17446" fill="white">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M83.0511 158.169C82.9648 158.257 82.8782 158.344 82.7912 158.431C64.046 177.176 33.6541 177.176 14.9089 158.431C-3.83606 139.686 -3.83626 109.294 14.9083 90.5492L14.9073 90.5482L105.417 0.0385795L105.419 0.0405327L105.42 0.0391408L195.93 90.5488L195.929 90.5498C214.673 109.295 214.673 139.686 195.928 158.431C177.183 177.176 146.791 177.176 128.046 158.431C127.959 158.344 127.872 158.257 127.786 158.17L105.418 135.802L83.0511 158.169Z"
				/>
			</mask>
			<path
				d="M83.0511 158.169L60.2543 135.712L60.3387 135.627L60.4237 135.542L83.0511 158.169ZM14.9083 90.5492L37.5357 67.9218L60.1627 90.5488L37.5361 113.176L14.9083 90.5492ZM14.9073 90.5482L-7.7201 113.176L-30.3475 90.5482L-7.7201 67.9208L14.9073 90.5482ZM105.417 0.0385795L82.7896 -22.5888L105.417 -45.2163L128.044 -22.5888L105.417 0.0385795ZM105.419 0.0405327L128.046 22.668L105.419 45.2954L82.7915 22.668L105.419 0.0405327ZM105.42 0.0391408L82.7929 -22.5883L105.42 -45.2157L128.048 -22.5883L105.42 0.0391408ZM195.93 90.5488L218.557 67.9214L241.185 90.5488L218.557 113.176L195.93 90.5488ZM195.929 90.5498L173.301 113.176L150.675 90.549L173.302 67.9224L195.929 90.5498ZM127.786 158.17L150.414 135.542L150.499 135.628L150.584 135.713L127.786 158.17ZM105.418 135.802L82.791 113.174L105.418 90.5469L128.046 113.174L105.418 135.802ZM60.1637 135.803C60.1938 135.773 60.224 135.743 60.2543 135.712L105.848 180.626C105.706 180.77 105.563 180.914 105.419 181.058L60.1637 135.803ZM37.5363 135.803C43.7847 142.052 53.9154 142.052 60.1637 135.803L105.419 181.058C74.1766 212.3 23.5234 212.3 -7.71851 181.058L37.5363 135.803ZM37.5361 113.176C31.2879 119.425 31.288 129.555 37.5363 135.803L-7.71851 181.058C-38.9601 149.817 -38.9605 99.1642 -7.71951 67.9222L37.5361 113.176ZM37.5347 67.9208L37.5357 67.9218L-7.71911 113.177L-7.7201 113.176L37.5347 67.9208ZM128.044 22.666L37.5347 113.176L-7.7201 67.9208L82.7896 -22.5888L128.044 22.666ZM82.7915 22.668L82.7896 22.666L128.044 -22.5888L128.046 -22.5869L82.7915 22.668ZM128.048 22.6666L128.046 22.668L82.7915 -22.5869L82.7929 -22.5883L128.048 22.6666ZM173.303 113.176L82.7929 22.6666L128.048 -22.5883L218.557 67.9214L173.303 113.176ZM173.302 67.9224L173.303 67.9214L218.557 113.176L218.556 113.177L173.302 67.9224ZM173.3 135.803C179.549 129.555 179.549 119.425 173.301 113.176L218.557 67.9231C249.797 99.1652 249.797 149.817 218.555 181.058L173.3 135.803ZM150.673 135.803C156.921 142.052 167.052 142.052 173.3 135.803L218.555 181.058C187.313 212.3 136.66 212.3 105.418 181.058L150.673 135.803ZM150.584 135.713C150.613 135.743 150.642 135.773 150.673 135.803L105.418 181.058C105.275 180.915 105.132 180.771 104.989 180.626L150.584 135.713ZM128.046 113.174L150.414 135.542L105.159 180.797L82.791 158.429L128.046 113.174ZM60.4237 135.542L82.791 113.174L128.046 158.429L105.679 180.796L60.4237 135.542Z"
				fill="url(#paint0_linear_883_17446)"
				style=""
				mask="url(#path-1-inside-1_883_17446)"
			/>
		</g>
		<defs>
			<filter
				id="filter0_i_883_17446"
				x="0.849609"
				y="0.0385742"
				width="209.137"
				height="172.451"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/>
				<feOffset />
				<feGaussianBlur stdDeviation="8" />
				<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
				<feBlend mode="overlay" in2="shape" result="effect1_innerShadow_883_17446" />
			</filter>
			<linearGradient
				id="paint0_linear_883_17446"
				x1="105.418"
				y1="7.08126"
				x2="105.418"
				y2="182.161"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stop-color="#593FFF"
					style="stop-color:#593FFF;stop-color:color(display-p3 0.3490 0.2471 1.0000);stop-opacity:1;"
				/>
				<stop
					offset="1"
					stop-color="#9CF9FF"
					style="stop-color:#9CF9FF;stop-color:color(display-p3 0.6118 0.9765 1.0000);stop-opacity:1;"
				/>
			</linearGradient>
		</defs>
	</svg>
{/snippet}

<HoverEffect
	{hoverShape}
	hoverStyle={{ ...DEFAULT_STYLE, 'mix-blend-mode': 'multiply', background: 'black' }}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="flex h-fit w-fit" style="perspective: 20cm;">
		<div
			bind:this={outerNode}
			id="outer"
			class="relative flex h-[283px] w-[283px] items-center justify-center"
			style={outerStyle}
			{onmousemove}
			onmouseleave={() => {
				innerT.target = nullT;
				outerT.target = nullT;
			}}
		>
			{@render outer()}
			<div id="inner" class="absolute left-1/2 top-1/2" style={innerStyle}>
				{@render inner()}
			</div>
		</div>
	</div>
</HoverEffect>
