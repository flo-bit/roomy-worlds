<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { modelEditor } from './state.svelte';
	import { T } from '@threlte/core';
	import type { Voxel } from '$lib/roomy';

	let { voxel }: { voxel: Voxel } = $props();
</script>

{#if modelEditor.tool === 'move' || modelEditor.tool === 'scale' || modelEditor.tool === 'rotate'}
	<TransformControls
		bind:controls={modelEditor.transformControls}
		mode={modelEditor.tool === 'move' ? 'translate' : modelEditor.tool}
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
