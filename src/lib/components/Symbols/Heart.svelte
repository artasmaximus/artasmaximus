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
		width="283"
		height="283"
		viewBox="0 0 283 283"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			x="141.42"
			y="22.6274"
			width="168"
			height="168"
			transform="rotate(45 141.42 22.6274)"
			stroke="url(#paint0_linear_882_13430)"
			style=""
			stroke-width="32"
		/>
		<defs>
			<linearGradient
				id="paint0_linear_882_13430"
				x1="174.938"
				y1="31.3437"
				x2="343.594"
				y2="200"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stop-color="#6C00D8"
					style="stop-color:#6C00D8;stop-color:color(display-p3 0.4235 0.0000 0.8471);stop-opacity:1;"
				/>
				<stop
					offset="1"
					stop-color="#FF0E48"
					style="stop-color:#FF0E48;stop-color:color(display-p3 1.0000 0.0554 0.2821);stop-opacity:1;"
				/>
			</linearGradient>
		</defs>
	</svg>
{/snippet}

{#snippet inner()}
	<svg
		width="193"
		height="193"
		viewBox="0 0 193 193"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g filter="url(#filter0_i_882_13431)">
			<rect
				x="96.4199"
				y="22.8823"
				width="104"
				height="104"
				transform="rotate(45 96.4199 22.8823)"
				stroke="url(#paint0_linear_882_13431)"
				style=""
				stroke-width="32"
			/>
		</g>
		<defs>
			<filter
				id="filter0_i_882_13431"
				x="0.253906"
				y="0.254883"
				width="192.332"
				height="192.333"
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
				<feBlend mode="overlay" in2="shape" result="effect1_innerShadow_882_13431" />
			</filter>
			<linearGradient
				id="paint0_linear_882_13431"
				x1="96.661"
				y1="-0.982289"
				x2="233.898"
				y2="136.255"
				gradientUnits="userSpaceOnUse"
			>
				<stop
					stop-color="#FF0E48"
					style="stop-color:#FF0E48;stop-color:color(display-p3 1.0000 0.0549 0.2824);stop-opacity:1;"
				/>
				<stop
					offset="1"
					stop-color="#6C00D8"
					style="stop-color:#6C00D8;stop-color:color(display-p3 0.4235 0.0000 0.8471);stop-opacity:1;"
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
