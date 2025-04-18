<script lang="ts">
	import EditViewVoxel from './EditViewVoxel.svelte';
	import { editorState } from './state.svelte';
	import TransformingVoxel from './TransformingVoxel.svelte';
	import type { Voxel } from '$lib/shared/components';
	import type { AddVoxelFunction } from './types';

	let {
		voxels,
		addVoxel,
		deleteVoxel
	}: { voxels: Voxel[]; addVoxel: AddVoxelFunction; deleteVoxel: (id: string) => Promise<void> } =
		$props();

	$effect(() => {
		if (editorState.tool !== 'place' && editorState.ghostPosition) {
			editorState.ghostPosition = null;
		}
		if (editorState.tool !== 'delete' && editorState.ghostDeleteIndex) {
			editorState.ghostDeleteIndex = null;
		}
	});
</script>

{#each voxels as voxel, index}
	{#if editorState.selectedVoxel?.id === voxel.id}
		<TransformingVoxel {voxel} />
	{:else}
		<EditViewVoxel {voxel} {index} {addVoxel} {deleteVoxel} />
	{/if}
{/each}
