<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { VoxelGroup } from '$lib/shared/components';
	import { g, initRoomy } from '$lib/shared/roomy.svelte';
	import { Button } from 'fuchs';
	import { Models } from '$lib/shared/components';
	import { derivePromise } from '$lib/shared/utils.svelte';
	import type { EntityIdStr } from '@muni-town/leaf';
	import { onMount } from 'svelte';
	import ModelPicker from '$lib/model-picker/base/ModelPicker.svelte';
	import { createModel } from '$lib';
	import { base } from '$app/paths';

	let models: Models | null = $state(null);

	let modelList = derivePromise([], async () => (models ? await models.models.items() : []));

	onMount(async () => {
		if (!g.roomy) {
			await initRoomy();
		}
		const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

		models = await g.roomy!.open(Models, id as EntityIdStr);
	});

	let { children } = $props();

	let showEditor = $state(false);

	$effect(() => {
		if(!g.roomy) return;
		
		// const voxelObjectId = page.params.id;
		// or we use search params
		const voxelObjectId = page.url.searchParams.get('id');

		if(!voxelObjectId) return;

		showEditor = true;

		g.roomy
			.open(VoxelGroup, voxelObjectId as EntityIdStr)
			.then((voxelObject) => {
				g.voxelObject = voxelObject;
			})
			.catch((e) => {
				console.error('Error opening voxel object', e);
				goto('/');
			});
	});
</script>

{#if showEditor}
	{@render children()}
	{:else}

<Button class="m-4" size="lg" onclick={() => createModel(base, false)}
	><svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2.5"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>

	New Model</Button
>

{#if modelList.value.length > 0}
	<ModelPicker
		items={modelList.value.map((model) => ({ voxels: model, label: model.name }))}
		onselect={({ voxels, label }) => {
			goto(`/editor/${voxels.id}`);
		}}
	/>
{/if}

{/if}
