// place files you want to import through the `$lib` alias in this folder.

import type { EntityIdStr } from '@muni-town/leaf';
import { g, initRoomy } from './shared/roomy.svelte';
import { goto } from '$app/navigation';
import { VoxelGroup, World } from './roomy';

export async function getVoxelObject(id: string) {
	if (!g.roomy) {
		await initRoomy();
	}
	const voxelObject = await g.roomy!.open(VoxelGroup, id as EntityIdStr);
	return voxelObject;
}

export async function createModel(base: string, newTab: boolean = false) {
	if (!g.roomy) return;

	const voxels = await g.roomy.create(VoxelGroup);
	voxels.commit();

	if (newTab) {
		window.open(base + `/editor?id=${voxels.id}`, '_blank');
	} else {
		goto(base + `/editor?id=${voxels.id}`);
	}
}

export async function createWorld(base: string) {
	if (!g.roomy) {
		await initRoomy();

		if (!g.roomy) return;
	}
	const world = await g.roomy.create(World);
	world.commit();

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