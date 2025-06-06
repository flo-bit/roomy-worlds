import {
	Cell,
	Instance,
	InstanceList,
	PlayerData,
	PlayerDataList,
	Transform,
	World,
	WorldsList
} from '$lib/schema';
import { publicGroup } from '$lib/utils.svelte';
import type { EntityIdStr } from '@muni-town/leaf';
import type { Loaded } from 'jazz-tools';
import { Quaternion, Vector3 } from 'three';
import type { TransformControls } from 'three/examples/jsm/Addons.js';
import { getPathsForModel, type Model } from './models';
import { toast } from '$lib/sonner';

export const editingState = $state({
	selectedInstance: null as Loaded<typeof Instance> | null,
	selectedCellId: null as string | null,
	selectedModelId: null as string | null,

	selectedModel: null as Model | null,

	transformControls: undefined as TransformControls | undefined,
	showModelEditor: false,
	showWorldSettings: false,
	showModelPicker: false,
	camera: 'third' as 'first' | 'third',
	modelPickerType: 'public' as 'private' | 'world' | 'public',

	modelPickerColor: null as number | null,

	showChat: false,

	selectedCharacter: null as string | null,
	showCharacterPicker: false,

	tool: 'move' as 'move' | 'rotate' | 'scale',

	worldId: null as string | null,
	world: null as Loaded<typeof World> | null,

	worldsList: null as Loaded<typeof WorldsList> | null
});

export type AddInstanceFunction = (id: EntityIdStr, position: Vector3) => void;

// apply the transform to the selected voxel
export async function applyTransform() {
	if (editingState.selectedInstance === null || !editingState.transformControls?.object) return;

	const instance = editingState.selectedInstance;

	if (!instance) return;
	if (!instance.transform) return;
	instance.transform.position = {
		x: editingState.transformControls.object.position.x,
		y: editingState.transformControls.object.position.y,
		z: editingState.transformControls.object.position.z
	};

	instance.transform.scale = {
		x: editingState.transformControls.object.scale.x,
		y: editingState.transformControls.object.scale.y,
		z: editingState.transformControls.object.scale.z
	};

	instance.transform.quaternion = {
		x: editingState.transformControls.object.quaternion.x,
		y: editingState.transformControls.object.quaternion.y,
		z: editingState.transformControls.object.quaternion.z,
		w: editingState.transformControls.object.quaternion.w
	};

	console.log(instance);
	await new Promise((resolve) => setTimeout(resolve, 10));
}

export function clickedOn(point: Vector3, isFloor?: boolean) {
	if (!editingState.selectedModel) return;

	if (isFloor && !editingState.selectedModel.canPlaceOnFloor) {
		toast.error('This model can only be placed on top of other models');
		return;
	}
	const currentColor = (editingState.modelPickerColor ?? 0) + 1;

	let variant = undefined;
	if (editingState.selectedModel.variants) {
		const randomVariant = Math.floor(Math.random() * editingState.selectedModel.variants?.length);
		variant = editingState.selectedModel.variants[randomVariant];
	}

	const paths = getPathsForModel(editingState.selectedModel, variant, currentColor.toString());
	const randomIndex = Math.floor(Math.random() * paths.length);
	addInstance(
		paths[randomIndex],
		editingState.selectedModel.path,
		point,
		currentColor.toString(),
		undefined,
		!editingState.selectedModel.noCollision
	);
}

export const cellSize = 50;

export function getCellId(position: { x: number; y: number; z: number }) {
	const x = Math.floor(position.x / cellSize);
	const z = Math.floor(position.z / cellSize);
	return `${x},${z}`;
}

export async function addInstance(
	id: string,
	model: string,
	position: Vector3,
	color?: string,
	variant?: string,
	collision?: boolean
) {
	if (!editingState.world) return;

	const quaternion = new Quaternion();
	quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.random() * 2 * Math.PI);
	const instance = Instance.create(
		{
			path: id,
			model,
			color,
			variant,
			collision,
			transform: Transform.create(
				{
					position: {
						x: position.x,
						y: position.y,
						z: position.z
					},
					scale: {
						x: 1,
						y: 1,
						z: 1
					},
					quaternion: {
						x: quaternion.x,
						y: quaternion.y,
						z: quaternion.z,
						w: quaternion.w
					}
				},
				{ owner: publicGroup() }
			)
		},
		{ owner: publicGroup() }
	);

	// check if cell exists
	const cellId = getCellId(position);
	let cell = editingState.world?.current?.cells[cellId];
	if (!cell) {
		cell = createCell(cellId);
	}

	cell.instances.push(instance);
	// editingState.world?.current?.instances?.push(instance);
}

export function createCell(cellId: string) {
	if (!editingState.world) return;

	const cell = Cell.create(
		{
			instances: InstanceList.create([], publicGroup())
		},
		publicGroup()
	);

	editingState.world.current.cells[cellId] = cell;

	return cell;
}

export async function deleteInstance(id: string) {
	const cell = editingState.selectedCellId;
	if (!cell) return;

	// find voxel by id
	const instance = editingState.world?.current?.cells[cell]?.instances?.findIndex(
		(v) => v?.id === id
	);
	console.log(instance);
	if (instance === undefined || instance < 0) return;

	editingState.world?.current?.cells[cell]?.instances?.splice(instance, 1);
}

export function updatePlayerData(
	playerId: string,
	position: { x: number; y: number; z: number },
	rotation: number
) {
	if (!editingState.world) return;

	const players = editingState.world.current.players;

	if (!players[playerId]) {
		console.log('creating player data', playerId);
		players[playerId] = PlayerData.create(
			{
				position: position,
				rotation: rotation,
				timestamp: Date.now(),
				character: editingState.selectedCharacter ?? 'player',
				velocity: {
					x: 0,
					y: 0,
					z: 0
				}
			},
			publicGroup()
		);
	} else {
		console.log('updating player data', playerId);
		players[playerId].position = {
			x: position.x,
			y: position.y,
			z: position.z
		};
		players[playerId].rotation = rotation;
		players[playerId].timestamp = Date.now();
		players[playerId].character = editingState.selectedCharacter ?? 'player';
		players[playerId].velocity = {
			x: 0,
			y: 0,
			z: 0
		};
	}
}
