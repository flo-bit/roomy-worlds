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
