<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { onMount } from 'svelte';
	import { getVoxelObject } from '$lib';
	import { TransformedGroup, type Voxel, type VoxelGroup } from '$lib/shared/components';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { UndoManager, type EntityIdStr } from '@muni-town/leaf';
	import { Quaternion, Vector3 } from 'three';
	import ModelSelection from './ModelSelection.svelte';
	import { Button } from 'fuchs';
	import { downloadObjectAsJson } from '$lib/editor/import';
	import { type WorldData } from '$lib/viewer/types';

	let voxelObject: VoxelGroup | null = $state(null);

	let voxels: Voxel[] = $state([]);

	let instances = derivePromise([], async () => (g.world ? await g.world.instances.items() : []));
	let locations = derivePromise([], async () => (g.world ? await g.world.locations.items() : []));

	let undoManager: UndoManager | null = $state(null);

	$inspect(instances);

	onMount(async () => {
		voxelObject = await getVoxelObject('leaf:vw7a1c7xhdcwnt915t953amrq8dfpcffj2ksc74pymqchv9ap48g');

		voxels = await voxelObject.voxels.items();
	});

	$effect(() => {
		if (g.world?.entity.doc && !undoManager) {
			undoManager = new UndoManager(g.world.entity.doc, {
				maxUndoSteps: 100
			});

			window.addEventListener('keyup', (e) => {
				if (e.key.toLowerCase() === 'z' && e.shiftKey) {
					console.log('undo', e);
					undoManager?.undo();
				} else if (e.key.toLowerCase() === 'y' && e.shiftKey) {
					undoManager?.redo();
				} else if (e.key.toLowerCase() === 'p') {
					showPerfMonitor = !showPerfMonitor;
				}
			});
		}
	});

	async function addInstance(id: EntityIdStr, position: Vector3) {
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

	let showPerfMonitor = $state(false);
</script>

<div class="h-screen w-screen">
	<Canvas>
		{#if showPerfMonitor}
			<PerfMonitor anchorX={'right'} logsPerSecond={30} />
		{/if}
		<World framerate={60}>
			<Scene instances={instances.value} {addInstance} locations={locations.value} />
		</World>
	</Canvas>
</div>

<ModelSelection />

<div class="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
	<Button
		onclick={async () => {
			// turn into json with all the instances
			const json: WorldData = {
				instances: [],
				models: {}
			}

			const addedModels = new Set<EntityIdStr>();

			for (const instance of instances.value) {
				if (!addedModels.has(instance.group)) {
					addedModels.add(instance.group);

					let model = await instance.loadGroup();
					const voxels = await model.voxels.items();

					json.models[instance.group] = {
						voxels: voxels.map((voxel) => ({
							id: voxel.id,
							position: voxel.position,
							quaternion: voxel.quaternion,
							scale: voxel.scale,
							color: voxel.color,
							visible: voxel.visible,
							collider: voxel.collider
						}))
					};
				}

				json.instances.push({
					id: instance.id,
					position: instance.position,
					quaternion: instance.quaternion,
					scale: instance.scale,
					model: instance.group
				});
			}

			downloadObjectAsJson(json, 'world');

			//downloadObjectAsJson(instances.value, 'world');
		}}>Export</Button
	>
</div>