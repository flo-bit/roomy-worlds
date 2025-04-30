<script lang="ts">
	import { T } from '@threlte/core';
	import { applyModelEditorTransform, modelEditor, isTransforming, addVoxel } from './state.svelte';
	import { useCursor } from '@threlte/extras';

	const { onPointerEnter, onPointerLeave } = useCursor();
</script>

<!-- floor that we can click on to place voxels -->
<T.Mesh
	rotation.x={-Math.PI / 2}
	onclick={(e) => {
		if (modelEditor.tool !== 'place') return;
		e.stopPropagation();

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
		if (modelEditor.tool !== 'place') return;
		e.stopPropagation();
		
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
