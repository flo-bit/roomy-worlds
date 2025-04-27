<script lang="ts">
	import EditViewVoxel from './EditViewVoxel.svelte';
	import { modelEditor } from './state.svelte';
	import TransformingVoxel from './TransformingVoxel.svelte';
	import type { Voxel } from '$lib/roomy';

	let { voxels }: { voxels: Voxel[] } = $props();

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
	{#if modelEditor.selectedVoxel?.id === voxel.id}
		<TransformingVoxel {voxel} />
	{:else}
		<EditViewVoxel {voxel} />
	{/if}
{/each}
