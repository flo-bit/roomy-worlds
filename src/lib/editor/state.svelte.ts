import type { Voxel } from '$lib/roomy';
import type { TransformControls } from 'three/examples/jsm/Addons.js';

export const modelEditor: {
	tool: 'place' | 'delete' | 'move' | 'rotate' | 'scale';
	color: { r: number; g: number; b: number };
	selectedVoxel: Voxel | null;
	transformControls: TransformControls | undefined;

	ghostDeleteIndex: number | null;
	ghostPosition: [number, number, number] | null;

	applyTransform: () => Promise<void>;
} = $state({
	tool: 'move',
	color: { r: 1, g: 1, b: 1 },
	selectedVoxel: null,
	transformControls: undefined,
	ghostDeleteIndex: null,
	ghostPosition: null,

	applyTransform: applyModelEditorTransform
});

// apply the transform to the selected voxel
export async function applyModelEditorTransform() {
	if (modelEditor.selectedVoxel === null || !modelEditor.transformControls?.object) return;

	const voxel = modelEditor.selectedVoxel;

	voxel.x = modelEditor.transformControls.object.position.x;
	voxel.y = modelEditor.transformControls.object.position.y;
	voxel.z = modelEditor.transformControls.object.position.z;

	voxel.sx = modelEditor.transformControls.object.scale.x;
	voxel.sy = modelEditor.transformControls.object.scale.y;
	voxel.sz = modelEditor.transformControls.object.scale.z;

	voxel.qx = modelEditor.transformControls.object.quaternion.x;
	voxel.qy = modelEditor.transformControls.object.quaternion.y;
	voxel.qz = modelEditor.transformControls.object.quaternion.z;
	voxel.qw = modelEditor.transformControls.object.quaternion.w;

	voxel.commit();

	await new Promise((resolve) => setTimeout(resolve, 10));
}

export function isTransforming() {
	return (
		modelEditor.tool === 'move' || modelEditor.tool === 'rotate' || modelEditor.tool === 'scale'
	);
}
