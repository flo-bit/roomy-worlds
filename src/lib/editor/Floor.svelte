<script lang="ts">
	import { T } from '@threlte/core';
	import { applyModelEditorTransform, modelEditor, isTransforming } from './state.svelte';
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
		console.log(e.point, modelEditor.tool);
		e.stopPropagation();
		if (modelEditor.tool !== 'place') return;

		console.log(e.point);

		addVoxel(
			[e.point.x, e.point.y + 0.5, e.point.z],
			[modelEditor.color.r, modelEditor.color.g, modelEditor.color.b]
		);
	}}
	onpointerenter={(e) => {
		if (modelEditor.tool !== 'place') return;
		onPointerEnter();

		modelEditor.ghostPosition = [e.point.x, e.point.y + 0.5, e.point.z];
	}}
	onpointermove={(e) => {
		e.stopPropagation();
		if (modelEditor.tool !== 'place') return;
		modelEditor.ghostPosition = [e.point.x, e.point.y + 0.5, e.point.z];
	}}
	onpointerleave={() => {
		if (modelEditor.tool !== 'place') return;
		onPointerLeave();
	}}
	ondblclick={() => {
		if (!isTransforming()) return;
		// deselect current voxel

		applyModelEditorTransform();
		modelEditor.selectedVoxel = null;
	}}
>
	<T.PlaneGeometry args={[100, 100, 100]}></T.PlaneGeometry>

	<T.MeshStandardMaterial visible={false} />
</T.Mesh>
