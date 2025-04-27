<script lang="ts">
	import EditViewVoxel from './EditViewVoxel.svelte';
	import { modelEditor } from './state.svelte';
	import TransformingVoxel from './TransformingVoxel.svelte';
	import type { Voxel } from '$lib/roomy';
	import type { AddVoxelFunction } from './types';

	let {
		voxels,
		addVoxel,
		deleteVoxel
	}: { voxels: Voxel[]; addVoxel: AddVoxelFunction; deleteVoxel: (id: string) => Promise<void> } =
		$props();

	$effect(() => {
		if (modelEditor.tool !== 'place' && modelEditor.ghostPosition) {
			modelEditor.ghostPosition = null;
		}
		if (modelEditor.tool !== 'delete' && modelEditor.ghostDeleteIndex) {
			modelEditor.ghostDeleteIndex = null;
		}
	});
</script>

{#each voxels as voxel, index}
	{#if modelEditor.selectedVoxel?.id === voxel.id}
		<TransformingVoxel {voxel} />
	{:else}
		<EditViewVoxel {voxel} {index} {addVoxel} {deleteVoxel} />
	{/if}
{/each}
