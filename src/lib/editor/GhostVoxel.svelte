<script lang="ts">
	import { T } from '@threlte/core';
	import { editorState } from './state.svelte';
</script>

<!-- ghost voxel that shows where a newly placed voxel will be -->
{#if editorState.ghostPosition}
	<T.Mesh position={editorState.ghostPosition}>
		<T.BoxGeometry />
		<T.MeshStandardMaterial opacity={0.5} transparent />
	</T.Mesh>
{/if}
