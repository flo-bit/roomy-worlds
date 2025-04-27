import { Voxel, VoxelGroup } from '$lib/roomy';
import { g } from '$lib/shared/roomy.svelte';
import type { EntityIdStr } from '@muni-town/leaf';

class Models {
	models: Record<string, Voxel[]> = $state({});

	async getModel(id: string) {
		if (!g.roomy) return [];

		if (this.models[id]) return this.models[id];

		const model = await g.roomy.open(VoxelGroup, id as EntityIdStr);

		const voxels = await model.voxels.items();

		this.models[id] = voxels;

		model.voxels.subscribe(async () => {
			this.models[id] = await model.voxels.items();
		});

		return voxels;
	}
}

export const models = new Models();
