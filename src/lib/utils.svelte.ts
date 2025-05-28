import { goto } from '$app/navigation';
import { Group } from 'jazz-tools';
import { InstanceList, Model, VoxelList, World } from './schema';
import { editingState } from './world-editor/state.svelte';

export function publicGroup(readWrite: 'reader' | 'writer' = 'writer') {
	const group = Group.create();
	group.addMember('everyone', readWrite);

	return group;
}

export async function createWorld(base: string) {
	const world = World.create(
		{
			instances: InstanceList.create([], { owner: publicGroup() })
		},
		{
			owner: publicGroup()
		}
	);

	editingState.showWorldSettings = true;

	goto(base + `/world?id=${world.id}`);
}

export function createModel() {
	const model = Model.create(
		{
			voxels: VoxelList.create([], { owner: publicGroup() })
		},
		{
			owner: publicGroup()
		}
	);

	return model;
}

export function shuffle<T>(array: T[]): T[] {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}
