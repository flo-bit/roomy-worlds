<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { editorState } from './state.svelte';
	import { T } from '@threlte/core';
	import type { Voxel } from '$lib/shared/components';

	let { voxel }: { voxel: Voxel } = $props();
</script>

{#if editorState.tool === 'move' || editorState.tool === 'scale' || editorState.tool === 'rotate'}
	<TransformControls
		bind:controls={editorState.transformControls}
		mode={editorState.tool === 'move' ? 'translate' : editorState.tool}
		position={voxel.position.toArray()}
		quaternion={voxel.quaternion.toArray()}
		scale={voxel.scale.toArray()}
	>
		<T.Mesh>
			<T.BoxGeometry />
			<T.MeshStandardMaterial color={voxel.color} />
		</T.Mesh>
	</TransformControls>
{/if}
