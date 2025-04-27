<script lang="ts">
	import ModalModelPicker from '$lib/model-picker/modal/ModalModelPicker.svelte';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import type { EntityIdStr } from '@muni-town/leaf';
	import { Button } from 'fuchs';
	import { onMount } from 'svelte';
	import { applyTransform, editingState } from './state.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { modelEditor } from '$lib/editor/state.svelte';
	import { Models, VoxelGroup } from '$lib/roomy';

	let globalModels: Models | null = $state(null);

	let globalModelList = derivePromise([], async () =>
		globalModels ? await globalModels.models.items() : []
	);

	let worldModelList = derivePromise([], async () => {
		if (!g.roomy) return [];
		const models = await g.world?.instances.items();
		const groups = new Set<EntityIdStr>();
		for (const model of models ?? []) {
			groups.add(model.group);
		}
		return Promise.all(
			Array.from(groups).map(async (group) => await g.roomy?.open(VoxelGroup, group))
		);
	});

	let privateModelList = derivePromise([], async () => {
		if (!g.roomy?.models) return [];
		return await g.roomy.models.items();
	});

	onMount(async () => {
		if (!g.roomy) {
			await initRoomy();

			if (!g.roomy) return;
		}

		const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

		globalModels = await g.roomy.open(Models, id as EntityIdStr);
	});

	function getItems() {
		let items: { voxels: VoxelGroup; label: string }[] = [];
		if (editingState.modelPickerType === 'public') {
			items=  globalModelList.value.map((model) => ({ voxels: model, label: model.name }));
		}

		if (editingState.modelPickerType === 'private') {
			items = privateModelList.value.map((model) => ({ voxels: model, label: model.name }));
		}

		if (editingState.modelPickerType === 'world') {
			items = worldModelList.value.map((model) => ({ voxels: model, label: model.name }));
		}

		// filter all items that have no voxels
		items = items.filter((item) => item.voxels.voxels.length > 0);

		return items;
	}
</script>

<ModalModelPicker
	newModelButtonClick={async () => {
		if (!g.roomy) return;

		const voxels = await g.roomy.create(VoxelGroup);
		voxels.commit();
		g.voxelObject = voxels;

		g.roomy.models.push(voxels);
		g.roomy.models.commit();

		modelEditor.tool = 'place';

		editingState.showModelPicker = false;
		editingState.showModelEditor = true;
	}}
	bind:open={editingState.showModelPicker}
	items={getItems()}
	onselect={({ voxels, label }) => {
		applyTransform();
		editingState.selectedInstance = null;
		editingState.selectedModelId = voxels.id;
	}}
	showEditButton={editingState.modelPickerType === 'private'}
/>
