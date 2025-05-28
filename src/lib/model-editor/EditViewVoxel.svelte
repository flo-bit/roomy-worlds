<script lang="ts">
	import { useCursor } from '@threlte/extras';
	import { addVoxel, applyModelEditorTransform, deleteVoxel, modelEditor } from './state.svelte';
	import { T } from '@threlte/core';
	import type { Loaded } from 'jazz-tools';
	import { Voxel } from '$lib/schema';

	let { voxel }: { voxel: Loaded<typeof Voxel> } = $props();
	const { onPointerEnter, onPointerLeave } = useCursor();
</script>

{#if voxel?.transform}
	<T.Mesh
		position={[voxel.transform?.x, voxel.transform?.y, voxel.transform?.z]}
		quaternion={[
			voxel.transform?.rx,
			voxel.transform?.ry,
			voxel.transform?.rz,
			voxel.transform?.rw
		]}
		scale={[voxel.transform?.sx, voxel.transform?.sy, voxel.transform?.sz]}
		onclick={(e) => {
			e.stopPropagation();

			if (!modelEditor.orbitControlsEnabled) return;

			if (modelEditor.tool === 'delete') {
				//editorState.cubes.splice(index, 1);
				deleteVoxel(voxel.id);
				modelEditor.ghostDeleteId = null;
			} else if (modelEditor.tool === 'place' && e.normal) {
				addVoxel(
					[
						e.point.x + e.normal.x * 0.5,
						e.point.y + e.normal.y * 0.5,
						e.point.z + e.normal.z * 0.5
					],
					[modelEditor.color.r, modelEditor.color.g, modelEditor.color.b]
				);
			} else if (
				modelEditor.tool === 'move' ||
				modelEditor.tool === 'rotate' ||
				modelEditor.tool === 'scale'
			) {
				applyModelEditorTransform();
				modelEditor.color = { r: voxel.r, g: voxel.g, b: voxel.b };
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
{/if}
