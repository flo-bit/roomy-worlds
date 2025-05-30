<script lang="ts">
	import ModalModelPicker from '$lib/model-picker/modal/ModalModelPicker.svelte';
	import type { EntityIdStr } from '@muni-town/leaf';
	import { onMount } from 'svelte';
	import { applyTransform, editingState } from './state.svelte';
	import { modelEditor } from '$lib/model-editor/state.svelte';
	import { dev } from '$app/environment';
	import { AccountCoState, CoState } from 'jazz-svelte';
	import { Model, ModelList, MyAppAccount, VoxelList } from '$lib/schema';
	import type { Loaded } from 'jazz-tools';
	import { createModel } from '$lib/utils.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getPathsForModel, models } from './models';

	const globalModelListId = '';

	let globalModelList = new CoState(ModelList, globalModelListId);

	// let worldModelList = derivePromise([], async () => {
	// 	if (!editingState.world || !g.roomy) {
	// 		return [];
	// 	}

	// 	const models = await editingState.world.instances.items();
	// 	const groups = new Set<EntityIdStr>();
	// 	for (const model of models ?? []) {
	// 		groups.add(model.group);
	// 	}
	// 	return Promise.all(
	// 		Array.from(groups)
	// 			.filter((group) => group)
	// 			.map(async (group) => await g.roomy?.open(VoxelGroup, group))
	// 	);
	// });

	const me = new AccountCoState(MyAppAccount, {
		resolve: {
			profile: true,
			root: {
				models: {
					$each: true,
					$onError: null
				}
			}
		}
	});

	onMount(async () => {});

	function getItems() {
		let items: { voxels: Loaded<typeof VoxelList>; label: string }[] = [];
		// if (editingState.modelPickerType === 'public') {
		// 	items = globalModelList.value.map((model) => ({ voxels: model, label: model.name }));
		// }

		// if (editingState.modelPickerType === 'private') {
		// 	items = privateModelList.value.map((model) => ({ voxels: model, label: model.name }));
		// }

		// if (editingState.modelPickerType === 'world') {
		// 	items = worldModelList.value.map((model) => ({ voxels: model, label: model?.name })) as {
		// 		voxels: VoxelGroup;
		// 		label: string;
		// 	}[];
		// }

		items =
			me.current?.root.models?.map((model) => {
				if (!model) return null;
				return {
					voxels: model.voxels,
					label: model.name
				};
			}) ?? [];

		console.log('items', me.current?.root.models);

		// filter all items that have no voxels
		// items = items.filter((item) => item.voxels.voxels.length > 0);

		// // remove duplicates (id)
		// items = items.filter((item, index, self) => index === self.findIndex((t) => t.voxels.id === item.voxels.id));

		let m = models
			.map((model) => {
				return { path: getPathsForModel(model)[0], model };
			})
			.map((model) => {
				return {
					path: model.path,
					label: model.model.label,
					model: model.model
				};
			});
		console.log(m);

		return m;
	}
</script>

<ModalModelPicker
	newModelButtonClick={async () => {
		const model = createModel();
		me?.current?.root.models?.push(model);

		console.log('model', model, model?.id);

		goto(`/model-editor?id=${model.id}`);

		modelEditor.tool = 'place';

		editingState.showModelPicker = false;
		editingState.showModelEditor = true;
	}}
	bind:open={editingState.showModelPicker}
	items={getItems()}
	onselect={({ path, label, model }) => {
		applyTransform();
		console.log('path', path);
		editingState.selectedInstance = null;
		editingState.selectedModelId = path;
		editingState.selectedModel = model;
		console.log('selectedModel', editingState.selectedModel);
	}}
	showEditButton={editingState.modelPickerType === 'private' || dev}
/>
