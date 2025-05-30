import { Instance, Transform, World } from '$lib/schema';
import { publicGroup } from '$lib/utils.svelte';
import type { EntityIdStr } from '@muni-town/leaf';
import type { Loaded } from 'jazz-tools';
import { Vector3 } from 'three';
import type { TransformControls } from 'three/examples/jsm/Addons.js';
import type { Model } from './models';

export const editingState = $state({
	selectedInstance: null as Loaded<typeof Instance> | null,
	selectedModelId: null as string | null,

	selectedModel: null as Model | null,

	transformControls: undefined as TransformControls | undefined,
	showModelEditor: false,
	showWorldSettings: false,
	showModelPicker: false,
	camera: 'third' as 'first' | 'third',
	modelPickerType: 'public' as 'private' | 'world' | 'public',

	showChat: false,

	selectedCharacter: null as string | null,
	showCharacterPicker: false,

	tool: 'move' as 'move' | 'rotate' | 'scale',

	worldSettings: {
		seed: Math.floor(Math.random() * 1000000).toString(),
		size: 0,
		terrainGradient: [
			{ rgb: { r: 0, g: 0, b: 0 }, position: 0 },
			{ rgb: { r: 0, g: 0, b: 0 }, position: 1 }
		] as {
			rgb: {
				r: number;
				g: number;
				b: number;
			};
			position: number;
		}[],
		waterGradient: [
			{ rgb: { r: 0, g: 0, b: 0 }, position: 0 },
			{ rgb: { r: 0, g: 0, b: 0 }, position: 1 }
		] as {
			rgb: {
				r: number;
				g: number;
				b: number;
			};
			position: number;
		}[],
		waterPercentage: 35,
		version: -1
	},
	worldId: null as string | null,
	world: null as Loaded<typeof World> | null
});

export type AddInstanceFunction = (id: EntityIdStr, position: Vector3) => void;

// apply the transform to the selected voxel
export async function applyTransform() {
	if (editingState.selectedInstance === null || !editingState.transformControls?.object) return;

	// const instance = new CoState(Instance, editingState.selectedInstance);
	const instance = editingState.selectedInstance;

	if (!instance) return;
	if (!instance.transform) return;
	instance.transform.x = editingState.transformControls.object.position.x;
	instance.transform.y = editingState.transformControls.object.position.y;
	instance.transform.z = editingState.transformControls.object.position.z;

	instance.transform.sx = editingState.transformControls.object.scale.x;
	instance.transform.sy = editingState.transformControls.object.scale.y;
	instance.transform.sz = editingState.transformControls.object.scale.z;

	instance.transform.rx = editingState.transformControls.object.quaternion.x;
	instance.transform.ry = editingState.transformControls.object.quaternion.y;
	instance.transform.rz = editingState.transformControls.object.quaternion.z;
	instance.transform.rw = editingState.transformControls.object.quaternion.w;

	await new Promise((resolve) => setTimeout(resolve, 10));
}

export async function addInstance(id: string, position: Vector3) {
	const instance = Instance.create(
		{
			model: id,
			transform: Transform.create(
				{
					x: position.x,
					y: position.y,
					z: position.z,
					sx: 1,
					sy: 1,
					sz: 1,
					rx: 0,
					ry: 0,
					rz: 0,
					rw: 1
				},
				{ owner: publicGroup() }
			)
		},
		{ owner: publicGroup() }
	);

	// const world = new CoState(World, editingState.worldId);
	console.log('editingState.world', editingState.world);
	console.log(editingState.world?.current?.instances);
	editingState.world?.current?.instances?.push(instance);
}

export async function deleteInstance(id: string) {
	// find voxel by id
	const instance = editingState.world?.current?.instances?.findIndex((v) => v?.id === id);
	console.log(instance);
	if (instance === undefined || instance < 0) return;

	editingState.world?.current?.instances?.splice(instance, 1);
}
