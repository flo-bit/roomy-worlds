<script lang="ts">
	import { useCursor } from '@threlte/extras';
	import { addVoxel, applyModelEditorTransform, deleteVoxel, modelEditor } from './state.svelte';
	import { T } from '@threlte/core';
	import { Voxel } from '$lib/roomy';

	let { voxel }: { voxel: Voxel } = $props();
	const { onPointerEnter, onPointerLeave } = useCursor();
</script>

<T.Mesh
	position={voxel.position.toArray()}
	quaternion={voxel.quaternion.toArray()}
	scale={voxel.scale.toArray()}
	onclick={(e) => {
		e.stopPropagation();

		if(!modelEditor.orbitControlsEnabled) return;

		if (modelEditor.tool === 'delete') {
			//editorState.cubes.splice(index, 1);
			deleteVoxel(voxel.id);
			modelEditor.ghostDeleteId = null;
		} else if (modelEditor.tool === 'place' && e.normal) {
			addVoxel(
				[e.point.x + e.normal.x * 0.5, e.point.y + e.normal.y * 0.5, e.point.z + e.normal.z * 0.5],
				[modelEditor.color.r, modelEditor.color.g, modelEditor.color.b]
			);
		} else if (
			modelEditor.tool === 'move' ||
			modelEditor.tool === 'rotate' ||
			modelEditor.tool === 'scale'
		) {
			applyModelEditorTransform();
			modelEditor.color = voxel.color;
			modelEditor.selectedVoxel = voxel;
		}

		onPointerLeave();
	}}
	onpointerenter={(e) => {
		e.stopPropagation();
		onPointerEnter();

		if (modelEditor.tool === 'delete') {
			modelEditor.ghostDeleteId = voxel.id;
		}
	}}
	onpointermove={(e) => {
		e.stopPropagation();

		if (modelEditor.tool === 'place' && e.normal) {
			modelEditor.ghostPosition = [
				e.point.x + e.normal.x * 0.5,
				e.point.y + e.normal.y * 0.5,
				e.point.z + e.normal.z * 0.5
			];
		}
		if (modelEditor.tool === 'delete') {
			modelEditor.ghostDeleteId = voxel.id;
		}
	}}
	onpointerleave={(e) => {
		e.stopPropagation();
		onPointerLeave();

		if (modelEditor.tool === 'delete') {
			modelEditor.ghostDeleteId = null;
		} else if (modelEditor.tool === 'place') {
			modelEditor.ghostPosition = null;
		}
	}}
>
	<T.BoxGeometry />
	<T.MeshStandardMaterial
		color={modelEditor.ghostDeleteId === voxel.id ? [1, 0, 0] : [voxel.r, voxel.g, voxel.b]}
	/>
</T.Mesh>
