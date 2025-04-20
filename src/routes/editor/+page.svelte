<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/editor/Scene.svelte';
	import { Button, PopoverColorPicker, Select } from 'fuchs';
	import { applyTransform, editorState } from '$lib/editor/state.svelte';
	import { downloadObjectAsJson, loadVoxelFromJson } from '$lib/editor/import';
	import { onMount } from 'svelte';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { Models, Voxel } from '$lib/shared/components';
	import { UndoManager, type EntityIdStr } from '$lib/roomy';
	import { ACESFilmicToneMapping } from 'three';

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

	let undoManager: UndoManager | null = $state(null);

	$effect(() => {
		if (g.voxelObject && !undoManager) {
			undoManager = new UndoManager(g.voxelObject.entity.doc, {
				maxUndoSteps: 100
			});

			window.addEventListener('keydown', async (e) => {
				// if target is input, don't handle
				if (e.target instanceof HTMLInputElement) return;

				if (e.key.toLowerCase() === 'z' && e.shiftKey) {
					undoManager?.undo();
				} else if (e.key.toLowerCase() === 'y' && e.shiftKey) {
					undoManager?.redo();
				}
			});
		}
	});

	onMount(() => {
		window.addEventListener('keydown', async (e) => {
			// if target is input, don't handle
			if (e.target instanceof HTMLInputElement) return;

			if (e.key === 'r') {
				selectedTool = 'rotate';
			} else if (e.key === 's') {
				selectedTool = 'scale';
			} else if (e.key === 'g') {
				selectedTool = 'move';
			} else if (e.key === 'd') {
				selectedTool = 'delete';
			} else if (e.key === 'p') {
				selectedTool = 'place';
			} else if (e.key === 'c') {
				if (editorState.selectedVoxel === null) return;

				applyTransform();

				await new Promise((resolve) => setTimeout(resolve, 10));
				// clone
				let v = editorState.selectedVoxel;

				addVoxel([v.x, v.y, v.z], [v.r, v.g, v.b], [v.sx, v.sy, v.sz], [v.qx, v.qy, v.qz, v.qw]);
			} else if (e.key === 'x') {
				// delete
				if (editorState.selectedVoxel === null) return;
				deleteVoxel(editorState.selectedVoxel.id);
				editorState.selectedVoxel = null;
			}
		});
	});
</script>

<div class="bg-base-100 absolute top-0 left-0 z-10 rounded-br-2xl p-2">
	<Select bind:selected={selectedTool} items={['place', 'delete', 'move', 'rotate', 'scale']} />
</div>

<div class="absolute top-3 right-3 z-10">
	<PopoverColorPicker bind:rgb={editorState.color} />
</div>

<div class="absolute bottom-4 left-4 z-10 flex hidden flex-col gap-2">
	<Button
		onclick={async () => {
			await applyTransform();
			downloadObjectAsJson(voxels.value, 'voxels');
		}}>Export</Button
	>
	<Button
		onclick={async () => {
			await applyTransform();
			loadVoxelFromJson(addVoxel);
		}}>Import</Button
	>
</div>

<div class="absolute right-4 bottom-4 z-10 flex flex-col gap-2">
	{#if !isPublished.value}
		<Button
			size="lg"
			class="bg-accent-100 hover:bg-accent-200"
			onclick={async () => {
				if (!g.voxelObject || !g.roomy) return;

				const models = await g.roomy.open(Models, id as EntityIdStr);
				models.models.push(g.voxelObject);
				models.commit();

				isPublished.value = true;
			}}
		>
			Save
		</Button>
	{:else}
		<Button
			size="lg"
			class="bg-accent-100 hover:bg-accent-200"
			onclick={async () => {
				if (!g.voxelObject || !g.roomy) return;

				const models = await g.roomy.open(Models, id as EntityIdStr);
				const index = (await models.models.items()).findIndex((m) => m.id === g.voxelObject?.id);
				if (index === -1) return;
				models.models.remove(index);

				isPublished.value = false;
				models.commit();
			}}
		>
			Delete
		</Button>
	{/if}
</div>

<div class="h-screen w-screen">
	<Canvas toneMapping={ACESFilmicToneMapping}>
		<Scene voxels={voxels.value} {addVoxel} {deleteVoxel} />
	</Canvas>
</div>
