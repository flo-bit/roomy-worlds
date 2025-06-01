<script lang="ts">
	import ModalModelPicker from '$lib/model-picker/modal/ModalModelPicker.svelte';
	import { applyTransform, editingState } from './state.svelte';
	import { dev } from '$app/environment';
	import { getPathsForModel, models } from './models';

	function getItems() {
		let color = ((editingState.modelPickerColor ?? 0) + 1).toString();
		let m = models
			.map((model) => {
				return { path: getPathsForModel(model, undefined, color)[0], model };
			})
			.map((model) => {
				return {
					path: model.path,
					label: model.model.label,
					model: model.model
				};
			});

		return m;
	}
</script>

<ModalModelPicker
	bind:open={editingState.showModelPicker}
	items={getItems()}
	onselect={({ path, label, model }) => {
		applyTransform();
		console.log('path', path);
		editingState.selectedInstance = null;
		editingState.selectedModel = model;
		console.log('selectedModel', editingState.selectedModel);
	}}
	showEditButton={editingState.modelPickerType === 'private' || dev}
/>
