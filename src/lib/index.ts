// place files you want to import through the `$lib` alias in this folder.

import type { EntityIdStr } from '@muni-town/leaf';
import { VoxelGroup, World } from './shared/components';
import { g, initRoomy } from './shared/roomy.svelte';
import { goto } from '$app/navigation';

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