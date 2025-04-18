import type { Voxel } from '$lib/shared/components';
import type { TransformControls } from 'three/examples/jsm/Addons.js';

export const editorState: {
	tool: 'place' | 'delete' | 'move' | 'rotate' | 'scale';
	color: { r: number; g: number; b: number };
	selectedVoxel: Voxel | null;
	transformControls: TransformControls | undefined;

	ghostDeleteIndex: number | null;
	ghostPosition: [number, number, number] | null;
} = $state({
	tool: 'move',
	color: { r: 1, g: 1, b: 1 },
	selectedVoxel: null,
	transformControls: undefined,
	ghostDeleteIndex: null,
	ghostPosition: null
});

// apply the transform to the selected voxel
export async function applyTransform() {
	if (editorState.selectedVoxel === null || !editorState.transformControls?.object) return;

	const voxel = editorState.selectedVoxel;

	voxel.x = editorState.transformControls.object.position.x;
	voxel.y = editorState.transformControls.object.position.y;
	voxel.z = editorState.transformControls.object.position.z;

	voxel.sx = editorState.transformControls.object.scale.x;
	voxel.sy = editorState.transformControls.object.scale.y;
	voxel.sz = editorState.transformControls.object.scale.z;

	voxel.qx = editorState.transformControls.object.quaternion.x;
	voxel.qy = editorState.transformControls.object.quaternion.y;
	voxel.qz = editorState.transformControls.object.quaternion.z;
	voxel.qw = editorState.transformControls.object.quaternion.w;

	voxel.commit();

	await new Promise((resolve) => setTimeout(resolve, 10));
}

export function isTransforming() {
	return (
		editorState.tool === 'move' || editorState.tool === 'rotate' || editorState.tool === 'scale'
	);
}
