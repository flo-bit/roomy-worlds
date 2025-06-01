<script lang="ts" module>
	export const joystickData = $state({
		x: 0,
		y: 0,
	});
</script>

<script lang="ts">
	let startPosition: { x: number; y: number } | null = $state(null);

	let pointerId: number | null = $state(null);
	const size = 72;

	let x = $state(0);
	let y = $state(0);
</script>

<svelte:window
	onpointermove={(e) => {
		if (!startPosition) return;
		if (pointerId !== e.pointerId) {
			return;
		}
		
		let deltaX = (e.clientX - startPosition.x) / size;
		let deltaY = (e.clientY - startPosition.y) / size;

		// restrict deltaX and deltaY to length <1
		const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
		if (length > 1) {
			deltaX = deltaX / length;
			deltaY = deltaY / length;
		}
		joystickData.x = deltaX;
		joystickData.y = deltaY;

		x = deltaX * size;
		y = deltaY * size;
	}}
	onpointerup={(e) => {
		if (pointerId !== e.pointerId) {
			return;
		}
		pointerId = null;
		startPosition = null;

		x = 0;
		y = 0;
		joystickData.x = 0;
		joystickData.y = 0;
	}}
/>

<div
	class="absolute bottom-4 left-4 size-36 rounded-full bg-white/20 pointer-fine:hidden"
	onpointerdown={(e) => {
		startPosition = { x: e.clientX, y: e.clientY };
		pointerId = e.pointerId;
	}}
>
	<div
		class="size-12 rounded-full bg-white/50"
		style="transform: translate({size + x - 24}px, {size + y - 24}px);"
	></div>
</div>
