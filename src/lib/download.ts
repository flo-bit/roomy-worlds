import type { EntityIdStr } from '@muni-town/leaf';
import { downloadObjectAsJson } from './model-editor/import';
import type { WorldData } from './viewer/types';
import type { TransformedGroup, World } from './roomy';
import { g } from './roomy.svelte';

export async function downloadWorld(world: World) {
	const instances: TransformedGroup[] = (await g.world?.instances.items()) ?? [];

	const json: WorldData = {
		instances: [],
		models: {},
		settings: world.settings
	};

	const addedModels = new Set<EntityIdStr>();

	for (const instance of instances) {
		if (!addedModels.has(instance.group)) {
			addedModels.add(instance.group);

			const model = await instance.loadGroup();
			const voxels = await model.voxels.items();

			json.models[instance.group] = {
				voxels: voxels.map((voxel) => ({
					id: voxel.id as string,
					position: voxel.position,
					quaternion: voxel.quaternion.toArray(),
					scale: voxel.scale,
					color: voxel.color as unknown as number,
					visible: voxel.visible,
					collider: voxel.collider
				}))
			};
		}

		json.instances.push({
			id: instance.id,
			position: instance.position,
			quaternion: instance.quaternion.toArray(),
			scale: instance.scale,
			model: instance.group
		});
	}

	downloadObjectAsJson(json, 'world');
}
