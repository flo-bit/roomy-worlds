<script lang="ts">
	import { T } from '@threlte/core';
	import { modelEditor } from './state.svelte';
</script>

<!-- ghost voxel that shows where a newly placed voxel will be -->
{#if modelEditor.ghostPosition}
	<T.Mesh position={modelEditor.ghostPosition}>
		<T.BoxGeometry />
		<T.MeshStandardMaterial opacity={0.5} transparent />
	</T.Mesh>
{/if}
