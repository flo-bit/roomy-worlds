import { TransformedGroup } from '$lib/roomy';
import { g, initRoomy } from '$lib/roomy.svelte';
import type { EntityIdStr } from '@muni-town/leaf';
import { Quaternion, Vector3 } from 'three';
import type { TransformControls } from 'three/examples/jsm/Addons.js';

export const editingState = $state({
	selectedInstance: null as TransformedGroup | null,
	selectedModelId: null as EntityIdStr | null,
	transformControls: undefined as TransformControls | undefined,
	showModelEditor: false,
	showWorldSettings: false,
	showModelPicker: false,
	modelPickerType: 'public' as 'private' | 'world' | 'public',
	worldSettings: {
		seed: Math.floor(Math.random() * 1000000),
		size: 100,
		terrainGradient: [
			{ rgb: { r: 0, g: 0.05, b: 0 }, position: 0 },
			{ rgb: { r: 0, g: 0.35, b: 0 }, position: 1 }
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
			{ rgb: { r: 0, g: 0, b: 1 }, position: 1 }
		] as {
			rgb: {
				r: number;
				g: number;
				b: number;
			};
			position: number;
		}[],
		waterPercentage: 35,
		version: 0
	}
});

export type AddInstanceFunction = (id: EntityIdStr, position: Vector3) => void;

// apply the transform to the selected voxel
export async function applyTransform() {
	if (editingState.selectedInstance === null || !editingState.transformControls?.object) return;

	const instance = editingState.selectedInstance;

	instance.x = editingState.transformControls.object.position.x;
	instance.y = editingState.transformControls.object.position.y;
	instance.z = editingState.transformControls.object.position.z;

	instance.sx = editingState.transformControls.object.scale.x;
	instance.sy = editingState.transformControls.object.scale.y;
	instance.sz = editingState.transformControls.object.scale.z;

	instance.qx = editingState.transformControls.object.quaternion.x;
	instance.qy = editingState.transformControls.object.quaternion.y;
	instance.qz = editingState.transformControls.object.quaternion.z;
	instance.qw = editingState.transformControls.object.quaternion.w;

	instance.commit();

	console.log('commit');

	await new Promise((resolve) => setTimeout(resolve, 10));
}

export async function addInstance(id: EntityIdStr, position: Vector3) {
	if (!g.roomy) {
		await initRoomy();

		if (!g.roomy) return;
	}

	const instance = await g.roomy.create(TransformedGroup);
	instance.group = id;
	instance.position = position;
	instance.quaternion = new Quaternion();
	instance.scale = new Vector3(1, 1, 1);
	instance.commit();

	g.world?.instances.push(instance);
	g.world?.commit();
}
