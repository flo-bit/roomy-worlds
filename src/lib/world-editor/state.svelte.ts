import { PlayerLocation, TransformedGroup, type WorldSettings } from '$lib/roomy';
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
	} as WorldSettings
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

export async function deleteInstance(id: string) {
	const instances = await g.world?.instances.items();
	// find voxel by id
	const instance = instances?.findIndex((v) => v.id === id);
	console.log(instance);
	if (instance === undefined || instance < 0) return;

	g.world?.instances.remove(instance);
	g.world?.commit();
}

async function createPlayerLocation() {
	console.log('createPlayerLocation');
	if (!g.roomy) {
		await initRoomy();

		if (!g.roomy) return;
	}

	const player = await g.roomy.create(PlayerLocation);

	player.x = 0;
	player.y = 0;
	player.z = 0;
	player.rotation = 0;
	player.model = editingState.selectedCharacter ?? 'male f';
	player.time = Date.now();
	player.commit();

	g.world?.players.push(player);
	g.world?.commit();

	localStorage.setItem('playerId', player.id);
	return player;
}

export async function getPlayerLocation() {
	// get player location
	const players = await g.world?.players.items();
	if (!players) return;

	// get saved id
	const savedId = localStorage.getItem('playerId');
	console.log('saved id', savedId);
	if (!savedId) {
		return createPlayerLocation();
	}

	// find player by id
	const player = players?.find((p) => p.id === savedId);

	if (!player) {
		console.log('player id not found', players);
		return createPlayerLocation();
	}

	console.log('reusing player location', player);

	return player;
}

export async function removeOldPlayerLocations() {
	// remove a random player location that is more than 10 seconds old
	const players = await g.world?.players.items();
	if (!players) return;

	const now = Date.now();
	const tenSecondsAgo = now - 10000;

	// remove a random player location that is more than 10 seconds old
	// first filter all by time
	const oldPlayers = players.filter((p) => p.time && p.time < tenSecondsAgo);
	if (oldPlayers.length === 0) return;

	// remove a random one
	const randomIndex = Math.floor(Math.random() * oldPlayers.length);

	g.world?.players.remove(randomIndex);
	g.world?.commit();
}
