<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { onMount, untrack } from 'svelte';
	import { getVoxelObject } from '$lib';
	import { Models, TransformedGroup, Voxel, VoxelGroup } from '$lib/shared/components';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { type EntityIdStr } from '@muni-town/leaf';
	import { ACESFilmicToneMapping, Quaternion, Vector3 } from 'three';
	import ModelSelection from './ModelSelection.svelte';
	import { applyTransform, editingState } from './state.svelte';
	import ModelScene from '$lib/editor/Scene.svelte';
	import { editorState } from '$lib/editor/state.svelte';
	import { Button, ColorGradientPicker, Label, SliderNumber } from 'fuchs';

	let voxelObject: VoxelGroup | null = $state(null);

	let instances = derivePromise([], async () => (g.world ? await g.world.instances.items() : []));
	let locations = derivePromise([], async () => (g.world ? await g.world.locations.items() : []));

	onMount(async () => {
		voxelObject = await getVoxelObject('leaf:vw7a1c7xhdcwnt915t953amrq8dfpcffj2ksc74pymqchv9ap48g');
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

	let selectedTool: 'place' | 'delete' | 'move' | 'rotate' | 'scale' = $state('place');
	let voxels = derivePromise([], async () =>
		g.voxelObject ? await g.voxelObject.voxels.items() : []
	);

	const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

	let isPublished = derivePromise(false, async () => {
		if (!g.voxelObject || !g.roomy) return;
		const models = await g.roomy.open(Models, id as EntityIdStr);
		return models.models.ids().some((m) => m === g.voxelObject?.id);
	});

	export async function addVoxel(
		position: [number, number, number],
		color: [number, number, number],
		scale?: [number, number, number],
		quaternion?: [number, number, number, number]
	) {
		if (!g.roomy) {
			await initRoomy();

			if (!g.roomy) return;
		}

		const voxel = await g.roomy.create(Voxel);
		voxel.x = position[0];
		voxel.y = position[1];
		voxel.z = position[2];
		voxel.r = color[0];
		voxel.g = color[1];
		voxel.b = color[2];

		if (scale) {
			voxel.sx = scale[0];
			voxel.sy = scale[1];
			voxel.sz = scale[2];
		} else {
			voxel.sx = 1;
			voxel.sy = 1;
			voxel.sz = 1;
		}

		if (quaternion) {
			voxel.qx = quaternion[0];
			voxel.qy = quaternion[1];
			voxel.qz = quaternion[2];
			voxel.qw = quaternion[3];
		} else {
			voxel.qx = 0;
			voxel.qy = 0;
			voxel.qz = 0;
			voxel.qw = 1;
		}

		voxel.visible = true;
		voxel.collider = false;

		voxel.commit();
		g.voxelObject?.voxels.push(voxel);
		g.voxelObject?.commit();
	}

	export async function deleteVoxel(id: string) {
		// find voxel by id
		const voxel = voxels.value.findIndex((v) => v.id === id);
		if (!voxel) return;

		g.voxelObject?.voxels.remove(voxel);
		g.voxelObject?.commit();
	}

	$effect(() => {
		applyTransform();

		editorState.tool = selectedTool;

		if (editorState.selectedVoxel !== null) {
			editorState.selectedVoxel.r = editorState.color.r;
			editorState.selectedVoxel.g = editorState.color.g;
			editorState.selectedVoxel.b = editorState.color.b;

			editorState.selectedVoxel.commit();
		}
	});
	
</script>

<div class="absolute left-80 h-screen w-[calc(100vw-320px)]">
	<Canvas toneMapping={ACESFilmicToneMapping}>
		{#if showPerfMonitor}
			<PerfMonitor anchorX={'right'} logsPerSecond={30} />
		{/if}
		<World framerate={60}>
			{#if editingState.showModelEditor}
				<ModelScene voxels={voxels.value} {addVoxel} {deleteVoxel} />
			{:else}
				<Scene instances={instances.value} {addInstance} locations={locations.value} />
			{/if}
		</World>
	</Canvas>
</div>

<div class="absolute top-0 bottom-0 left-0 w-80 px-8 py-16">

	<Label>Size</Label>
	<SliderNumber class="mt-2" min={20} max={100} bind:value={editingState.worldSettings.size} />

	<Label>Terrain</Label>
	<ColorGradientPicker
		class="mt-6 mb-8"
		bind:colors={editingState.worldSettings.terrainGradient}
		onchange={() => {
			editingState.worldSettings.version += 1;
		}}
	/>

	<Label>Water</Label>

	<ColorGradientPicker
		class="mt-6 mb-4"
		bind:colors={editingState.worldSettings.waterGradient}
		onchange={() => {
			editingState.worldSettings.version += 1;
		}}
	/>

	<Label>Percentage</Label>
	<SliderNumber class="mt-2" bind:value={editingState.worldSettings.waterPercentage} />

	<Button class="mt-6" onclick={() => {
		editingState.worldSettings.version += 1;
	}}>
		Update
	</Button>
</div>

<ModelSelection />

<div class="absolute right-2 bottom-2">
	<Button
		onclick={async () => {
			if (!g.roomy) return;

			if (!g.voxelObject) {
				const voxels = await g.roomy.create(VoxelGroup);
				voxels.commit();
				g.voxelObject = voxels;
			}
			editingState.showModelEditor = !editingState.showModelEditor;
		}}>Model Editor</Button
	>
</div>

<div class="absolute bottom-2 left-4 z-10 flex flex-col gap-2">
	<!-- <Button
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

			//downloadObjectAsJson(instances.value, 'world');
		}}>Export</Button
	> -->

	{#if editingState.selectedInstance}
		<div class="flex items-center gap-2">
			<span class="text-base-800 text-sm"> moving </span>

			<button
				onclick={() => {
					applyTransform();
					editingState.selectedInstance = null;
				}}
				class="bg-base-200/20 text-base-900 cursor-pointer rounded-full p-0.5"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-3"
				>
					<path
						fill-rule="evenodd"
						d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="sr-only"> deselect </span>
			</button>
		</div>
	{:else if editingState.selectedModelId}
		<div class="flex items-center gap-2">
			<span class="text-base-800 text-sm"> placing </span>

			<button
				onclick={() => {
					editingState.selectedModelId = null;
				}}
				class="bg-base-200/20 text-base-900 cursor-pointer rounded-full p-0.5"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="size-3"
				>
					<path
						fill-rule="evenodd"
						d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="sr-only"> deselect </span>
			</button>
		</div>
	{/if}
</div>
