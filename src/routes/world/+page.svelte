<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { PerfMonitor } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { type EntityIdStr } from '@muni-town/leaf';
	import { ACESFilmicToneMapping, Quaternion, Vector3 } from 'three';
	import ModelSelection from './ModelSelection.svelte';
	import { applyTransform, editingState } from './state.svelte';
	import ModelScene from '$lib/editor/Scene.svelte';
	import { Button, cn, ColorGradientPicker, Label, SliderNumber } from 'fuchs';
	import ModelEditorUi from '$lib/editor/ModelEditorUI.svelte';
	import { TransformedGroup, Models, Voxel } from '$lib/roomy';

	let instances = derivePromise([], async () => (g.world ? await g.world.instances.items() : []));

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
</script>

<div
	class={cn(
		'absolute h-[100dvh]',
		!editingState.showModelEditor && editingState.showWorldSettings
			? 'left-80 w-[calc(100vw-320px)]'
			: 'left-0 w-screen'
	)}
>
	<Canvas toneMapping={ACESFilmicToneMapping}>
		{#if showPerfMonitor}
			<PerfMonitor anchorX={'right'} logsPerSecond={30} />
		{/if}
		<World framerate={60}>
			{#if editingState.showModelEditor}
				<ModelScene voxels={voxels.value} {addVoxel} {deleteVoxel} />
			{:else}
				<Scene instances={instances.value} {addInstance} />
			{/if}
		</World>
	</Canvas>
</div>

<ModelSelection />

{#if !editingState.showModelEditor}
	{#if editingState.showWorldSettings}
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

			<Button
				class="mt-6"
				onclick={() => {
					editingState.worldSettings.version += 1;
				}}
			>
				Update
			</Button>
		</div>
	{:else}
		<Button
			size="iconLg"
			class="bg-accent-100 hover:bg-accent-200 absolute top-4 left-4"
			onclick={() => (editingState.showModelPicker = true)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>

			<span class="sr-only">Add Model</span>
		</Button>
	{/if}
{:else}
	<ModelEditorUi />
{/if}

<div class="absolute bottom-2 left-4 z-10 flex flex-col gap-2">
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
