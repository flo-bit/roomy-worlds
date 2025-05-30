import { goto } from '$app/navigation';
import { Group } from 'jazz-tools';
import { Instance, InstanceList, Transform, World } from './schema';
import { editingState } from './world-editor/state.svelte';
import { getPathsForModel, models } from './world-editor/models';

export function publicGroup(readWrite: 'reader' | 'writer' = 'writer') {
	const group = Group.create();
	group.addMember('everyone', readWrite);

	return group;
}

export async function createWorld(base: string) {
	const model = models.find((m) => m.path === 'Hill_8x8x2_Color{color}');
	console.log(model);
	const path = getPathsForModel(model!, undefined, '1')[0];
	const startInstance = Instance.create(
		{
			path,
			model: 'Hill_8x8x2_Color1',
			transform: Transform.create(
				{
					position: { x: 0, y: 0, z: 0 },
					quaternion: { x: 0, y: 0, z: 0, w: 1 },
					scale: { x: 1, y: 1, z: 1 }
				},
				publicGroup()
			),
			collision: true,
			color: '1'
		},
		publicGroup()
	);

	const world = World.create(
		{
			instances: InstanceList.create([startInstance], publicGroup())
		},
		publicGroup()
	);

	editingState.showWorldSettings = true;

	goto(base + `/world?id=${world.id}`);
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
