<script lang="ts">
	import { TransformControls } from '@threlte/extras';
	import { modelEditor } from './state.svelte';
	import { T } from '@threlte/core';
	import type { Voxel } from '$lib/schema';
	import type { Loaded } from 'jazz-tools';

	let { voxel }: { voxel: Loaded<typeof Voxel> } = $props();
</script>

{#if (modelEditor.tool === 'move' || modelEditor.tool === 'scale' || modelEditor.tool === 'rotate') && voxel?.transform}
	<TransformControls
		bind:controls={modelEditor.transformControls}
		mode={modelEditor.tool === 'move' ? 'translate' : modelEditor.tool}
		position={[voxel.transform?.x, voxel.transform?.y, voxel.transform?.z]}
		quaternion={[
			voxel.transform?.rx,
			voxel.transform?.ry,
			voxel.transform?.rz,
			voxel.transform?.rw
		]}
		scale={[voxel.transform?.sx, voxel.transform?.sy, voxel.transform?.sz]}
		onchange={() => {
			let enabled = !(modelEditor.transformControls?.dragging ?? true);

			if (!enabled) {
				modelEditor.orbitControlsEnabled = false;
			} else if (modelEditor.orbitControlsEnabled === false) {
				setTimeout(() => {
					modelEditor.orbitControlsEnabled = true;
				}, 200);
			}
		}}
	>
		<T.Mesh>
			<T.BoxGeometry />
			<T.MeshStandardMaterial color={[voxel.r, voxel.g, voxel.b]} />
		</T.Mesh>
	</TransformControls>
{/if}
