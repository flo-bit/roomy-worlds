<script lang="ts">
	import { T } from '@threlte/core';
	import { applyTransform, editorState, isTransforming } from './state.svelte';
	import { useCursor } from '@threlte/extras';
	import type { AddVoxelFunction } from './types';

	const { onPointerEnter, onPointerLeave } = useCursor();

	let {
		addVoxel
	}: { addVoxel: AddVoxelFunction } =
		$props();
</script>

<!-- floor that we can click on to place voxels -->
<T.Mesh
	rotation.x={-Math.PI / 2}
	onclick={(e) => {
		console.log(e.point, editorState.tool);
		e.stopPropagation();
		if (editorState.tool !== 'place') return;

		console.log(e.point);

		addVoxel(
			[e.point.x, e.point.y + 0.5, e.point.z],
			[editorState.color.r, editorState.color.g, editorState.color.b]
		);
	}}
	onpointerenter={(e) => {
		if (editorState.tool !== 'place') return;
		onPointerEnter();

		editorState.ghostPosition = [e.point.x, e.point.y + 0.5, e.point.z];
	}}
	onpointermove={(e) => {
		e.stopPropagation();
		if (editorState.tool !== 'place') return;
		editorState.ghostPosition = [e.point.x, e.point.y + 0.5, e.point.z];
	}}
	onpointerleave={() => {
		if (editorState.tool !== 'place') return;
		onPointerLeave();
	}}
	ondblclick={() => {
		if (!isTransforming()) return;
		// deselect current voxel

		applyTransform();
		editorState.selectedVoxel = null;
	}}
>
	<T.PlaneGeometry args={[100, 100, 100]}></T.PlaneGeometry>

	<T.MeshStandardMaterial visible={false} />
</T.Mesh>
