<script>
	export let x = 50; // center x
	export let y = 50; // center y
	export let width = 20; // width of rectangle
	export let height = 20; // height of rectangle
	export let borderRadius = 10; // border radius
	export let fill = 'gray'; // fill color
</script>

<rect
	x={x - width / 2}
	y={y - height / 2}
	{width}
	{height}
	rx={borderRadius}
	ry={borderRadius}
	{fill}
/>
