<script lang="ts">
	import { useCursor } from '@threlte/extras';
	import { applyTransform, editorState } from './state.svelte';
	import { T } from '@threlte/core';
	import type { Voxel } from '$lib/shared/components';
	import type { AddVoxelFunction } from './types';

	let {
		voxel,
		index,
		addVoxel,
		deleteVoxel
	}: {
		voxel: Voxel;
		index: number;
		addVoxel: AddVoxelFunction;
		deleteVoxel: (id: string) => Promise<void>;
	} = $props();
	const { onPointerEnter, onPointerLeave } = useCursor();
</script>

<T.Mesh
	position={voxel.position.toArray()}
	quaternion={voxel.quaternion.toArray()}
	scale={voxel.scale.toArray()}
	onclick={(e) => {
		e.stopPropagation();
		if (editorState.tool === 'delete') {
			//editorState.cubes.splice(index, 1);
			deleteVoxel(voxel.id);
			editorState.ghostDeleteIndex = null;
		} else if (editorState.tool === 'place' && e.normal) {
			addVoxel(
				[e.point.x + e.normal.x * 0.5, e.point.y + e.normal.y * 0.5, e.point.z + e.normal.z * 0.5],
				[editorState.color.r, editorState.color.g, editorState.color.b]
			);
		} else if (
			editorState.tool === 'move' ||
			editorState.tool === 'rotate' ||
			editorState.tool === 'scale'
		) {
			applyTransform();
			editorState.color = voxel.color;
			editorState.selectedVoxel = voxel;
		}

		onPointerLeave();
	}}
	onpointerenter={(e) => {
		e.stopPropagation();
		onPointerEnter();

		if (editorState.tool === 'delete') {
			editorState.ghostDeleteIndex = index;
		}
	}}
	onpointermove={(e) => {
		e.stopPropagation();

		if (editorState.tool === 'place' && e.normal) {
			editorState.ghostPosition = [
				e.point.x + e.normal.x * 0.5,
				e.point.y + e.normal.y * 0.5,
				e.point.z + e.normal.z * 0.5
			];
		}
		if (editorState.tool === 'delete') {
			editorState.ghostDeleteIndex = index;
		}
	}}
	onpointerleave={(e) => {
		e.stopPropagation();
		onPointerLeave();

		if (editorState.tool === 'delete') {
			editorState.ghostDeleteIndex = null;
		} else if (editorState.tool === 'place') {
			editorState.ghostPosition = null;
		}
	}}
>
	<T.BoxGeometry />
	<T.MeshStandardMaterial
		color={index === editorState.ghostDeleteIndex ? [1, 0, 0] : [voxel.r, voxel.g, voxel.b]}
	/>
</T.Mesh>
