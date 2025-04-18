<script lang="ts">
	import ModalModelPicker from '$lib/model-picker/modal/ModalModelPicker.svelte';
	import { Models } from '$lib/shared/components';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import type { EntityIdStr } from '@muni-town/leaf';
	import { Button } from 'fuchs';
	import { onMount } from 'svelte';
	import { editingState } from './state.svelte';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { createModel } from '$lib';
	import { base } from '$app/paths';

	let models: Models | null = $state(null);

	let modelList = derivePromise([], async () => (models ? await models.models.items() : []));

	onMount(async () => {
		if (!g.roomy) {
			await initRoomy();

			if (!g.roomy) return;
		}
		
		const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

		models = await g.roomy.open(Models, id as EntityIdStr);
	});

	let open = $state(false);
</script>

<Button size="iconLg" class="absolute top-4 left-4 bg-accent-100 hover:bg-accent-200" onclick={() => (open = true)}>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	  </svg>

	  <span class="sr-only">Add Model</span>
</Button>

<ModalModelPicker
	newModelButtonClick={() => {
		createModel(base, true);
	}}
	bind:open
	items={modelList.value.map((model) => ({ voxels: model, label: model.name }))}
	onselect={({ voxels, label }) => {
		editingState.selectedId = voxels.id;
		console.log(editingState.selectedId);
	}}
/>
