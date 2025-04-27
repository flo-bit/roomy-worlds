import { Voxel, type EntityIdStr } from '$lib/roomy';
import type { TransformControls } from 'three/examples/jsm/Addons.js';
import { g, initRoomy } from '$lib/shared/roomy.svelte';

export const modelEditor: {
	tool: 'place' | 'delete' | 'move' | 'rotate' | 'scale';
	color: { r: number; g: number; b: number };
	selectedVoxel: Voxel | null;
	transformControls: TransformControls | undefined;

	ghostDeleteId: EntityIdStr | null;
	ghostPosition: [number, number, number] | null;

	applyTransform: () => Promise<void>;
} = $state({
	tool: 'move',
	color: { r: 1, g: 1, b: 1 },
	selectedVoxel: null,
	transformControls: undefined,
	ghostDeleteId: null,
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

export async function addVoxel(
	position: [number, number, number],
	color: [number, number, number],
	scale?: [number, number, number],
	quaternion?: [number, number, number, number]
) {
	if (!g.roomy) {
		await initRoomy();

		if (!g.roomy) return;
	}

	const voxel = await g.roomy.create(Voxel);
	voxel.x = position[0];
	voxel.y = position[1];
	voxel.z = position[2];
	voxel.r = color[0];
	voxel.g = color[1];
	voxel.b = color[2];

	if (scale) {
		voxel.sx = scale[0];
		voxel.sy = scale[1];
		voxel.sz = scale[2];
	} else {
		voxel.sx = 1;
		voxel.sy = 1;
		voxel.sz = 1;
	}

	if (quaternion) {
		voxel.qx = quaternion[0];
		voxel.qy = quaternion[1];
		voxel.qz = quaternion[2];
		voxel.qw = quaternion[3];
	} else {
		voxel.qx = 0;
		voxel.qy = 0;
		voxel.qz = 0;
		voxel.qw = 1;
	}

	voxel.visible = true;
	voxel.collider = false;

	voxel.commit();
	g.voxelObject?.voxels.push(voxel);
	g.voxelObject?.commit();
}

export async function deleteVoxel(id: string) {
	const voxels = await g.voxelObject?.voxels.items();
	// find voxel by id
	const voxel = voxels?.findIndex((v) => v.id === id);
	if (!voxel) return;

	g.voxelObject?.voxels.remove(voxel);
	g.voxelObject?.commit();
}
