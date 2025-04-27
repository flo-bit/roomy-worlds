import type { EntityIdStr } from '@muni-town/leaf';
import { downloadObjectAsJson } from './model-editor/import';
import type { WorldData } from './viewer/types';
import type { TransformedGroup } from './roomy';

export async function download(instances: TransformedGroup[]) {
	const json: WorldData = {
		instances: [],
		models: {}
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
