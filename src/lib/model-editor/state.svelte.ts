import { Model, Transform, Voxel } from '$lib/schema';
import { publicGroup } from '$lib/utils.svelte';
import { CoState } from 'jazz-svelte';
import type { Loaded } from 'jazz-tools';
import type { TransformControls } from 'three/examples/jsm/Addons.js';

export const modelEditor: {
	tool: 'place' | 'delete' | 'move' | 'rotate' | 'scale';
	color: { r: number; g: number; b: number };
	selectedVoxel: Loaded<typeof Voxel> | null;
	transformControls: TransformControls | undefined;

	ghostDeleteId: string | null;
	ghostPosition: [number, number, number] | null;

	orbitControlsEnabled: boolean;

	applyTransform: () => Promise<void>;

	voxelObject: Loaded<typeof Model> | null;
} = $state({
	tool: 'move',
	color: { r: 1, g: 1, b: 1 },
	selectedVoxel: null,
	transformControls: undefined,
	ghostDeleteId: null,
	ghostPosition: null,

	orbitControlsEnabled: true,

	applyTransform: applyModelEditorTransform,

	voxelObject: null
});

// apply the transform to the selected voxel
export async function applyModelEditorTransform() {
	if (modelEditor.selectedVoxel === null || !modelEditor.transformControls?.object) return;

	// const voxel = modelEditor.selectedVoxel;
	const voxel = modelEditor.selectedVoxel;
	if (!voxel.transform) return;

	voxel.transform.x = modelEditor.transformControls.object.position.x;
	voxel.transform.y = modelEditor.transformControls.object.position.y;
	voxel.transform.z = modelEditor.transformControls.object.position.z;

	voxel.transform.sx = modelEditor.transformControls.object.scale.x;
	voxel.transform.sy = modelEditor.transformControls.object.scale.y;
	voxel.transform.sz = modelEditor.transformControls.object.scale.z;

	voxel.transform.rx = modelEditor.transformControls.object.quaternion.x;
	voxel.transform.ry = modelEditor.transformControls.object.quaternion.y;
	voxel.transform.rz = modelEditor.transformControls.object.quaternion.z;
	voxel.transform.rw = modelEditor.transformControls.object.quaternion.w;

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
	scale = scale ?? [1, 1, 1];
	quaternion = quaternion ?? [0, 0, 0, 1];

	const voxel = Voxel.create(
		{
			transform: Transform.create(
				{
					x: position[0],
					y: position[1],
					z: position[2],
					sx: scale[0],
					sy: scale[1],
					sz: scale[2],
					rx: quaternion[0],
					ry: quaternion[1],
					rz: quaternion[2],
					rw: quaternion[3]
				},
				{ owner: publicGroup() }
			),
			r: color[0],
			g: color[1],
			b: color[2],
			visible: true,
			collider: false
		},
		{ owner: publicGroup() }
	);

	console.log(modelEditor.voxelObject?.current);

	modelEditor.voxelObject?.current?.ensureLoaded({
		resolve: {
			voxels: true
		}
	});

	modelEditor.voxelObject?.current?.voxels?.push(voxel);
}

export async function deleteVoxel(id: string) {
	console.log(id, modelEditor.voxelObject?.current?.voxels);
	// find voxel by id
	const voxel = modelEditor.voxelObject?.current?.voxels?.findIndex((v) => v?.id === id);
	if (!voxel) return;

	modelEditor.voxelObject?.current?.voxels?.splice(voxel, 1);
}
