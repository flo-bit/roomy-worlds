<script lang="ts">
	import EditViewVoxel from './EditViewVoxel.svelte';
	import { modelEditor } from './state.svelte';
	import TransformingVoxel from './TransformingVoxel.svelte';
	import type { Loaded } from 'jazz-tools';
	import { VoxelList } from '$lib/schema';

	let { voxels }: { voxels: Loaded<typeof VoxelList> } = $props();

	$effect(() => {
		if (modelEditor.tool !== 'place' && modelEditor.ghostPosition) {
			modelEditor.ghostPosition = null;
		}
		if (modelEditor.tool !== 'delete' && modelEditor.ghostDeleteId) {
			modelEditor.ghostDeleteId = null;
		}
	});

</script>

{#each voxels as voxel}
	{#if modelEditor.selectedVoxel?.id === voxel?.id}
		<TransformingVoxel {voxel} />
	{:else}
		<EditViewVoxel {voxel} />
	{/if}
{/each}
